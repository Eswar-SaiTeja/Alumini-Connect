import { Request, Response } from 'express';
import { prisma } from '../config/prisma';
import { AuthRequest } from '../middleware/auth';
import { broadcastEvent } from '../sockets/socketHandler';
import { logAudit } from '../middleware/audit';

export const getSettings = async (req: Request, res: Response) => {
  try {
    const settings = await prisma.siteSetting.findMany();
    const settingsMap: { [key: string]: string } = {};

    settings.forEach((s) => {
      settingsMap[s.key] = s.value;
    });

    return res.status(200).json({ settings: settingsMap });
  } catch (error: any) {
    return res.status(500).json({ message: 'Failed to retrieve site settings.' });
  }
};

export const updateSettings = async (req: AuthRequest, res: Response) => {
  try {
    const { settings } = req.body; // { key1: value1, key2: value2 }

    if (!settings || typeof settings !== 'object') {
      return res.status(400).json({ message: 'Settings object is required.' });
    }

    const updates = [];
    for (const [key, value] of Object.entries(settings)) {
      updates.push(
        prisma.siteSetting.upsert({
          where: { key },
          update: { value: String(value) },
          create: { key, value: String(value) },
        })
      );
    }

    await prisma.$transaction(updates);

    if (req.user) {
      await logAudit(req.user.email, 'UPDATED_SETTINGS', 'SiteSetting', undefined, `Updated ${Object.keys(settings).length} settings`);
    }

    broadcastEvent('SETTINGS_CHANGED', settings);

    return res.status(200).json({ message: 'Site settings updated successfully!', settings });
  } catch (error: any) {
    console.error('updateSettings error:', error);
    return res.status(500).json({ message: 'Failed to update site settings.' });
  }
};
