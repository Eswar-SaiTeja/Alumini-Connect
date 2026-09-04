import { Response } from 'express';
import { prisma } from '../config/prisma';
import { AuthRequest } from '../middleware/auth';
import { broadcastEvent } from '../sockets/socketHandler';
import { logAudit } from '../middleware/audit';

export const getGalleryItems = async (req: AuthRequest, res: Response) => {
  try {
    const category = req.query.category as string;
    const isAdmin = req.user && (req.user.role === 'SUPER_ADMIN' || req.user.role === 'ADMIN' || req.user.role === 'CONTENT_MANAGER');

    const where: any = {};
    if (!isAdmin) {
      where.isPublished = true;
    }

    if (category && category !== 'ALL') {
      where.category = category;
    }

    const items = await prisma.galleryItem.findMany({
      where,
      orderBy: [{ orderIndex: 'asc' }, { createdAt: 'desc' }],
    });

    return res.status(200).json({ gallery: items });
  } catch (error: any) {
    return res.status(500).json({ message: 'Failed to fetch gallery items.' });
  }
};

export const createGalleryItem = async (req: AuthRequest, res: Response) => {
  try {
    const { title, category, imageUrl, videoUrl, caption, isPublished, orderIndex } = req.body;

    if (!title || !imageUrl) {
      return res.status(400).json({ message: 'Title and image are required.' });
    }

    const item = await prisma.galleryItem.create({
      data: {
        title,
        category: category || 'CAMPUS',
        imageUrl,
        videoUrl: videoUrl || null,
        caption: caption || null,
        isPublished: isPublished !== undefined ? Boolean(isPublished) : true,
        orderIndex: orderIndex ? parseInt(orderIndex, 10) : 0,
      },
    });

    if (req.user) {
      await logAudit(req.user.email, 'UPLOADED_GALLERY_ITEM', 'GalleryItem', item.id, `Uploaded photo: ${item.title}`);
    }

    broadcastEvent('GALLERY_UPDATED', item);

    return res.status(201).json({ message: 'Gallery item added successfully!', item });
  } catch (error: any) {
    return res.status(500).json({ message: 'Failed to add gallery item.' });
  }
};

export const updateGalleryItem = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;

    if (data.orderIndex) data.orderIndex = parseInt(data.orderIndex, 10);
    if (data.isPublished !== undefined) data.isPublished = Boolean(data.isPublished);

    const updated = await prisma.galleryItem.update({
      where: { id },
      data,
    });

    broadcastEvent('GALLERY_UPDATED', updated);

    return res.status(200).json({ message: 'Gallery item updated.', item: updated });
  } catch (error: any) {
    return res.status(500).json({ message: 'Failed to update gallery item.' });
  }
};

export const deleteGalleryItem = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.galleryItem.delete({ where: { id } });

    broadcastEvent('GALLERY_UPDATED', { deletedId: id });

    return res.status(200).json({ message: 'Gallery item deleted.' });
  } catch (error: any) {
    return res.status(500).json({ message: 'Failed to delete gallery item.' });
  }
};
