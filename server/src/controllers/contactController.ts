import { Request, Response } from 'express';
import { prisma } from '../config/prisma';
import { AuthRequest } from '../middleware/auth';
import { broadcastEvent } from '../sockets/socketHandler';
import { logAudit } from '../middleware/audit';

export const submitContactMessage = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: 'Please fill in all required fields.' });
    }

    const contact = await prisma.contactMessage.create({
      data: {
        name,
        email: email.toLowerCase().trim(),
        phone: phone || null,
        subject,
        message,
        status: 'NEW',
      },
    });

    broadcastEvent('NEW_CONTACT_MESSAGE', {
      id: contact.id,
      name: contact.name,
      subject: contact.subject,
    });

    return res.status(201).json({
      message: 'Thank you for reaching out! Your message has been submitted to the alumni office.',
      contact,
    });
  } catch (error: any) {
    return res.status(500).json({ message: 'Failed to submit contact message.' });
  }
};

export const getContactMessages = async (req: AuthRequest, res: Response) => {
  try {
    const status = req.query.status as string;
    const where: any = {};

    if (status && status !== 'ALL') {
      where.status = status;
    }

    const messages = await prisma.contactMessage.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return res.status(200).json({ messages });
  } catch (error: any) {
    return res.status(500).json({ message: 'Failed to retrieve messages.' });
  }
};

export const updateContactStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status, replyNotes } = req.body;

    const updated = await prisma.contactMessage.update({
      where: { id },
      data: {
        status: status || undefined,
        replyNotes: replyNotes !== undefined ? replyNotes : undefined,
      },
    });

    return res.status(200).json({ message: 'Message updated.', contact: updated });
  } catch (error: any) {
    return res.status(500).json({ message: 'Failed to update message.' });
  }
};

export const deleteContactMessage = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.contactMessage.delete({ where: { id } });

    return res.status(200).json({ message: 'Message deleted.' });
  } catch (error: any) {
    return res.status(500).json({ message: 'Failed to delete message.' });
  }
};
