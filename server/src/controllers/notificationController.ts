import { Response } from 'express';
import { prisma } from '../config/prisma';
import { AuthRequest } from '../middleware/auth';

export const getUserNotifications = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required.' });
    }

    const notifications = await prisma.notification.findMany({
      where: {
        OR: [{ userId: req.user.id }, { userId: null }],
      },
      orderBy: { createdAt: 'desc' },
      take: 30,
    });

    const unreadCount = await prisma.notification.count({
      where: {
        OR: [{ userId: req.user.id }, { userId: null }],
        isRead: false,
      },
    });

    return res.status(200).json({ notifications, unreadCount });
  } catch (error: any) {
    return res.status(500).json({ message: 'Failed to fetch notifications.' });
  }
};

export const markAsRead = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });

    return res.status(200).json({ message: 'Marked as read.' });
  } catch (error: any) {
    return res.status(500).json({ message: 'Failed to mark notification.' });
  }
};

export const markAllAsRead = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required.' });
    }

    await prisma.notification.updateMany({
      where: {
        OR: [{ userId: req.user.id }, { userId: null }],
        isRead: false,
      },
      data: { isRead: true },
    });

    return res.status(200).json({ message: 'All notifications marked as read.' });
  } catch (error: any) {
    return res.status(500).json({ message: 'Failed to mark all notifications.' });
  }
};
