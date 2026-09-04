import { Response } from 'express';
import { prisma } from '../config/prisma';
import { AuthRequest } from '../middleware/auth';
import { broadcastEvent } from '../sockets/socketHandler';
import { logAudit } from '../middleware/audit';

export const getNewsList = async (req: AuthRequest, res: Response) => {
  try {
    const category = req.query.category as string;
    const search = req.query.search as string;
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined;
    const isAdmin = req.user && (req.user.role === 'SUPER_ADMIN' || req.user.role === 'ADMIN' || req.user.role === 'CONTENT_MANAGER');

    const where: any = {};
    if (!isAdmin) {
      where.isPublished = true;
    }

    if (category && category !== 'ALL') {
      where.category = category;
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { content: { contains: search } },
        { subtitle: { contains: search } },
        { tags: { contains: search } },
      ];
    }

    const news = await prisma.newsAnnouncement.findMany({
      where,
      orderBy: { publishDate: 'desc' },
      take: limit,
    });

    return res.status(200).json({ news });
  } catch (error: any) {
    return res.status(500).json({ message: 'Failed to fetch news and announcements.' });
  }
};

export const getNewsById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const item = await prisma.newsAnnouncement.findUnique({
      where: { id },
    });

    if (!item) {
      return res.status(404).json({ message: 'News article not found.' });
    }

    return res.status(200).json({ news: item });
  } catch (error: any) {
    return res.status(500).json({ message: 'Failed to retrieve article.' });
  }
};

export const createNews = async (req: AuthRequest, res: Response) => {
  try {
    const { title, subtitle, content, category, featuredImage, author, tags, isPublished, publishDate } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required.' });
    }

    const news = await prisma.newsAnnouncement.create({
      data: {
        title,
        subtitle: subtitle || null,
        content,
        category: category || 'COLLEGE_NEWS',
        featuredImage: featuredImage || null,
        author: author || (req.user ? req.user.email : 'College Administration'),
        tags: tags || null,
        isPublished: isPublished !== undefined ? Boolean(isPublished) : true,
        publishDate: publishDate ? new Date(publishDate) : new Date(),
      },
    });

    // Create system notification for all users
    await prisma.notification.create({
      data: {
        title: `Announcement: ${news.title}`,
        message: news.subtitle || (news.content.slice(0, 100) + '...'),
        type: 'ANNOUNCEMENT',
        link: `/news/${news.id}`,
      },
    });

    if (req.user) {
      await logAudit(req.user.email, 'CREATED_NEWS', 'NewsAnnouncement', news.id, `Created news: ${news.title}`);
    }

    // Broadcast immediately so clients receive real-time notification
    broadcastEvent('NEWS_PUBLISHED', news);

    return res.status(201).json({ message: 'News article published successfully!', news });
  } catch (error: any) {
    console.error('createNews error:', error);
    return res.status(500).json({ message: 'Failed to publish news.' });
  }
};

export const updateNews = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;

    if (data.publishDate) data.publishDate = new Date(data.publishDate);
    if (data.isPublished !== undefined) data.isPublished = Boolean(data.isPublished);

    const updated = await prisma.newsAnnouncement.update({
      where: { id },
      data,
    });

    if (req.user) {
      await logAudit(req.user.email, 'UPDATED_NEWS', 'NewsAnnouncement', id, `Updated news: ${updated.title}`);
    }

    broadcastEvent('NEWS_UPDATED', updated);

    return res.status(200).json({ message: 'News updated successfully.', news: updated });
  } catch (error: any) {
    return res.status(500).json({ message: 'Failed to update news.' });
  }
};

export const deleteNews = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const item = await prisma.newsAnnouncement.findUnique({ where: { id } });

    await prisma.newsAnnouncement.delete({ where: { id } });

    if (req.user && item) {
      await logAudit(req.user.email, 'DELETED_NEWS', 'NewsAnnouncement', id, `Deleted news: ${item.title}`);
    }

    broadcastEvent('NEWS_DELETED', { id });

    return res.status(200).json({ message: 'Article deleted successfully.' });
  } catch (error: any) {
    return res.status(500).json({ message: 'Failed to delete article.' });
  }
};
