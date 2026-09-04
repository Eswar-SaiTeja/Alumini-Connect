import { Response } from 'express';
import { prisma } from '../config/prisma';
import { AuthRequest } from '../middleware/auth';
import { broadcastEvent } from '../sockets/socketHandler';
import { logAudit } from '../middleware/audit';

export const getStories = async (req: AuthRequest, res: Response) => {
  try {
    const search = req.query.search as string;
    const featured = req.query.featured === 'true';
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined;
    const isAdmin = req.user && (req.user.role === 'SUPER_ADMIN' || req.user.role === 'ADMIN' || req.user.role === 'CONTENT_MANAGER');

    const where: any = {};
    if (!isAdmin) {
      where.isPublished = true;
    }

    if (featured) {
      where.isFeatured = true;
    }

    if (search) {
      where.OR = [
        { alumniName: { contains: search } },
        { achievementTitle: { contains: search } },
        { department: { contains: search } },
        { story: { contains: search } },
      ];
    }

    const stories = await prisma.successStory.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return res.status(200).json({ stories });
  } catch (error: any) {
    return res.status(500).json({ message: 'Failed to fetch success stories.' });
  }
};

export const getStoryById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const story = await prisma.successStory.findUnique({ where: { id } });

    if (!story) {
      return res.status(404).json({ message: 'Success story not found.' });
    }

    return res.status(200).json({ story });
  } catch (error: any) {
    return res.status(500).json({ message: 'Failed to retrieve story.' });
  }
};

export const createStory = async (req: AuthRequest, res: Response) => {
  try {
    const { alumniName, batch, department, achievementTitle, story, careerInfo, photoUrl, isFeatured, isPublished } = req.body;

    if (!alumniName || !batch || !achievementTitle || !story) {
      return res.status(400).json({ message: 'Please provide all required story fields.' });
    }

    const newStory = await prisma.successStory.create({
      data: {
        alumniName,
        batch: parseInt(batch, 10),
        department: department || 'General',
        achievementTitle,
        story,
        careerInfo: careerInfo || null,
        photoUrl: photoUrl || null,
        isFeatured: Boolean(isFeatured),
        isPublished: isPublished !== undefined ? Boolean(isPublished) : true,
      },
    });

    if (req.user) {
      await logAudit(req.user.email, 'CREATED_STORY', 'SuccessStory', newStory.id, `Created success story for ${alumniName}`);
    }

    broadcastEvent('STORY_PUBLISHED', newStory);

    return res.status(201).json({ message: 'Success story created successfully!', story: newStory });
  } catch (error: any) {
    return res.status(500).json({ message: 'Failed to create story.' });
  }
};

export const updateStory = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;

    if (data.batch) data.batch = parseInt(data.batch, 10);
    if (data.isFeatured !== undefined) data.isFeatured = Boolean(data.isFeatured);
    if (data.isPublished !== undefined) data.isPublished = Boolean(data.isPublished);

    const updated = await prisma.successStory.update({
      where: { id },
      data,
    });

    if (req.user) {
      await logAudit(req.user.email, 'UPDATED_STORY', 'SuccessStory', id, `Updated story: ${updated.achievementTitle}`);
    }

    broadcastEvent('STORY_UPDATED', updated);

    return res.status(200).json({ message: 'Story updated successfully.', story: updated });
  } catch (error: any) {
    return res.status(500).json({ message: 'Failed to update story.' });
  }
};

export const deleteStory = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const item = await prisma.successStory.findUnique({ where: { id } });

    await prisma.successStory.delete({ where: { id } });

    if (req.user && item) {
      await logAudit(req.user.email, 'DELETED_STORY', 'SuccessStory', id, `Deleted story for ${item.alumniName}`);
    }

    broadcastEvent('STORY_DELETED', { id });

    return res.status(200).json({ message: 'Story deleted successfully.' });
  } catch (error: any) {
    return res.status(500).json({ message: 'Failed to delete story.' });
  }
};
