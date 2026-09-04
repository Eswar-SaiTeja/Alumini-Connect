import { Response } from 'express';
import { prisma } from '../config/prisma';
import { AuthRequest } from '../middleware/auth';
import { broadcastEvent } from '../sockets/socketHandler';
import { logAudit } from '../middleware/audit';
import { Parser } from 'json2csv';

export const getEvents = async (req: AuthRequest, res: Response) => {
  try {
    const type = req.query.type as string; // 'upcoming', 'past', or 'all'
    const category = req.query.category as string;
    const search = req.query.search as string;

    const where: any = {};

    // Non-admin users only see published events
    const isAdmin = req.user?.role === 'SUPER_ADMIN' || req.user?.role === 'ADMIN' || req.user?.role === 'CONTENT_MANAGER';
    if (!isAdmin) {
      where.isPublished = true;
    }

    if (category && category !== 'ALL') {
      where.category = category;
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
        { venue: { contains: search } },
        { speaker: { contains: search } },
      ];
    }

    const today = new Date().toISOString().split('T')[0];

    if (type === 'upcoming') {
      where.eventDate = { gte: today };
    } else if (type === 'past') {
      where.eventDate = { lt: today };
    }

    const events = await prisma.event.findMany({
      where,
      orderBy: { eventDate: type === 'past' ? 'desc' : 'asc' },
      include: {
        _count: {
          select: {
            registrations: {
              where: { attendanceStatus: { not: 'CANCELLED' } },
            },
          },
        },
      },
    });

    // Check if logged-in user is registered for each event
    let userRegisteredEventIds = new Set<string>();
    if (req.user) {
      const userRegs = await prisma.eventRegistration.findMany({
        where: {
          userId: req.user.id,
          attendanceStatus: { not: 'CANCELLED' },
        },
        select: { eventId: true },
      });
      userRegisteredEventIds = new Set(userRegs.map((r) => r.eventId));
    }

    const formattedEvents = events.map((evt) => ({
      id: evt.id,
      title: evt.title,
      description: evt.description,
      category: evt.category,
      bannerImage: evt.bannerImage,
      eventDate: evt.eventDate,
      time: evt.time,
      venue: evt.venue,
      isOnline: evt.isOnline,
      onlineLink: evt.onlineLink,
      speaker: evt.speaker,
      organizer: evt.organizer,
      capacity: evt.capacity,
      registrationDeadline: evt.registrationDeadline,
      isPublished: evt.isPublished,
      registeredCount: evt._count.registrations,
      isUserRegistered: userRegisteredEventIds.has(evt.id),
      createdAt: evt.createdAt,
    }));

    return res.status(200).json({ events: formattedEvents });
  } catch (error: any) {
    console.error('getEvents error:', error);
    return res.status(500).json({ message: 'Failed to fetch events.' });
  }
};

export const getEventById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        registrations: {
          where: { attendanceStatus: { not: 'CANCELLED' } },
          select: {
            id: true,
            alumniName: true,
            attendanceStatus: true,
            createdAt: true,
          },
          take: 20,
        },
        _count: {
          select: {
            registrations: {
              where: { attendanceStatus: { not: 'CANCELLED' } },
            },
          },
        },
      },
    });

    if (!event) {
      return res.status(404).json({ message: 'Event not found.' });
    }

    let userRegistration = null;
    if (req.user) {
      userRegistration = await prisma.eventRegistration.findFirst({
        where: {
          eventId: id,
          userId: req.user.id,
          attendanceStatus: { not: 'CANCELLED' },
        },
      });
    }

    return res.status(200).json({
      event: {
        ...event,
        registeredCount: event._count.registrations,
        isUserRegistered: !!userRegistration,
        userRegistration,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ message: 'Failed to retrieve event.' });
  }
};

export const createEvent = async (req: AuthRequest, res: Response) => {
  try {
    const {
      title,
      description,
      category,
      bannerImage,
      eventDate,
      time,
      venue,
      isOnline,
      onlineLink,
      speaker,
      organizer,
      capacity,
      registrationDeadline,
      isPublished,
    } = req.body;

    if (!title || !description || !eventDate || !time || !venue) {
      return res.status(400).json({ message: 'Please provide title, description, date, time, and venue.' });
    }

    const event = await prisma.event.create({
      data: {
        title,
        description,
        category: category || 'REUNION',
        bannerImage,
        eventDate,
        time,
        venue,
        isOnline: Boolean(isOnline),
        onlineLink: onlineLink || null,
        speaker: speaker || null,
        organizer: organizer || 'GCRJY Alumni Association',
        capacity: capacity ? parseInt(capacity, 10) : 200,
        registrationDeadline: registrationDeadline || null,
        isPublished: isPublished !== undefined ? Boolean(isPublished) : true,
      },
    });

    // Create system notification for all users
    await prisma.notification.create({
      data: {
        title: `New Event: ${event.title}`,
        message: `Join us for ${event.title} on ${event.eventDate} at ${event.venue}.`,
        type: 'EVENT',
        link: `/events/${event.id}`,
      },
    });

    if (req.user) {
      await logAudit(req.user.email, 'CREATED_EVENT', 'Event', event.id, `Created event: ${event.title}`);
    }

    broadcastEvent('EVENT_CREATED', event);

    return res.status(201).json({ message: 'Event created successfully!', event });
  } catch (error: any) {
    console.error('createEvent error:', error);
    return res.status(500).json({ message: 'Failed to create event.' });
  }
};

export const updateEvent = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;

    if (data.capacity) data.capacity = parseInt(data.capacity, 10);
    if (data.isOnline !== undefined) data.isOnline = Boolean(data.isOnline);
    if (data.isPublished !== undefined) data.isPublished = Boolean(data.isPublished);

    const updated = await prisma.event.update({
      where: { id },
      data,
    });

    if (req.user) {
      await logAudit(req.user.email, 'UPDATED_EVENT', 'Event', id, `Updated event: ${updated.title}`);
    }

    broadcastEvent('EVENT_UPDATED', updated);

    return res.status(200).json({ message: 'Event updated successfully.', event: updated });
  } catch (error: any) {
    return res.status(500).json({ message: 'Failed to update event.' });
  }
};

export const deleteEvent = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const event = await prisma.event.findUnique({ where: { id } });

    await prisma.event.delete({ where: { id } });

    if (req.user && event) {
      await logAudit(req.user.email, 'DELETED_EVENT', 'Event', id, `Deleted event: ${event.title}`);
    }

    broadcastEvent('EVENT_DELETED', { id });

    return res.status(200).json({ message: 'Event deleted successfully.' });
  } catch (error: any) {
    return res.status(500).json({ message: 'Failed to delete event.' });
  }
};

export const registerForEvent = async (req: AuthRequest, res: Response) => {
  try {
    const { id: eventId } = req.params;
    const { alumniName, alumniEmail, alumniPhone } = req.body;

    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        _count: {
          select: {
            registrations: {
              where: { attendanceStatus: { not: 'CANCELLED' } },
            },
          },
        },
      },
    });

    if (!event) {
      return res.status(404).json({ message: 'Event not found.' });
    }

    if (event._count.registrations >= event.capacity) {
      return res.status(400).json({ message: 'Sorry, this event has reached its maximum registration capacity.' });
    }

    const emailToUse = (req.user?.email || alumniEmail || '').toLowerCase().trim();
    const nameToUse = req.user ? (await prisma.alumniProfile.findUnique({ where: { userId: req.user.id } }))?.fullName || req.user.email : alumniName;

    if (!emailToUse || !nameToUse) {
      return res.status(400).json({ message: 'Please provide your name and email to register.' });
    }

    // Check if already registered
    const existing = await prisma.eventRegistration.findFirst({
      where: {
        eventId,
        OR: [
          req.user ? { userId: req.user.id } : {},
          { alumniEmail: emailToUse },
        ],
        attendanceStatus: { not: 'CANCELLED' },
      },
    });

    if (existing) {
      return res.status(409).json({
        message: 'You are already registered for this event.',
        registration: existing,
      });
    }

    const ticketNumber = `GCRJY-${Math.floor(1000 + Math.random() * 9000)}-${Date.now().toString().slice(-4)}`;

    const registration = await prisma.eventRegistration.create({
      data: {
        eventId,
        userId: req.user?.id || null,
        alumniName: nameToUse,
        alumniEmail: emailToUse,
        alumniPhone: alumniPhone || null,
        ticketNumber,
        attendanceStatus: 'REGISTERED',
      },
    });

    // Notify user
    if (req.user) {
      await prisma.notification.create({
        data: {
          userId: req.user.id,
          title: `Confirmed: ${event.title}`,
          message: `Your registration is confirmed. Ticket #${ticketNumber}`,
          type: 'EVENT',
          link: `/events/${event.id}`,
        },
      });
    }

    broadcastEvent('EVENT_REGISTERED', {
      eventId,
      registrationCount: event._count.registrations + 1,
      ticketNumber,
    });

    return res.status(201).json({
      message: 'Registration successful! See you at the event.',
      registration,
    });
  } catch (error: any) {
    console.error('registerForEvent error:', error);
    return res.status(500).json({ message: 'Failed to complete event registration.' });
  }
};

export const cancelRegistration = async (req: AuthRequest, res: Response) => {
  try {
    const { id: eventId } = req.params;

    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required.' });
    }

    const registration = await prisma.eventRegistration.findFirst({
      where: {
        eventId,
        userId: req.user.id,
        attendanceStatus: { not: 'CANCELLED' },
      },
    });

    if (!registration) {
      return res.status(404).json({ message: 'Active registration not found.' });
    }

    await prisma.eventRegistration.update({
      where: { id: registration.id },
      data: { attendanceStatus: 'CANCELLED' },
    });

    const count = await prisma.eventRegistration.count({
      where: { eventId, attendanceStatus: { not: 'CANCELLED' } },
    });

    broadcastEvent('EVENT_UPDATED', { eventId, registeredCount: count });

    return res.status(200).json({ message: 'Event registration has been cancelled.' });
  } catch (error: any) {
    return res.status(500).json({ message: 'Failed to cancel registration.' });
  }
};

export const getEventRegistrations = async (req: AuthRequest, res: Response) => {
  try {
    const { id: eventId } = req.params;

    const registrations = await prisma.eventRegistration.findMany({
      where: { eventId },
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          include: {
            profile: true,
          },
        },
      },
    });

    return res.status(200).json({ registrations });
  } catch (error: any) {
    return res.status(500).json({ message: 'Failed to fetch registrations.' });
  }
};

export const updateAttendance = async (req: AuthRequest, res: Response) => {
  try {
    const { registrationId } = req.params;
    const { attendanceStatus } = req.body;

    const updated = await prisma.eventRegistration.update({
      where: { id: registrationId },
      data: { attendanceStatus },
    });

    return res.status(200).json({ message: 'Attendance status updated.', registration: updated });
  } catch (error: any) {
    return res.status(500).json({ message: 'Failed to update attendance.' });
  }
};

export const exportEventRegistrationsCSV = async (req: AuthRequest, res: Response) => {
  try {
    const { id: eventId } = req.params;

    const event = await prisma.event.findUnique({ where: { id: eventId } });
    const registrations = await prisma.eventRegistration.findMany({
      where: { eventId },
      include: {
        user: { include: { profile: true } },
      },
    });

    const data = registrations.map((r) => ({
      TicketNumber: r.ticketNumber,
      Name: r.alumniName,
      Email: r.alumniEmail,
      Phone: r.alumniPhone || 'N/A',
      Department: r.user?.profile?.department || 'N/A',
      Batch: r.user?.profile?.graduationYear || 'N/A',
      Company: r.user?.profile?.currentCompany || 'N/A',
      Designation: r.user?.profile?.currentDesignation || 'N/A',
      Status: r.attendanceStatus,
      RegistrationDate: r.createdAt.toISOString(),
    }));

    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(data);

    res.header('Content-Type', 'text/csv');
    res.attachment(`${event?.title.replace(/[^a-zA-Z0-9]/g, '_')}_Attendees.csv`);
    return res.send(csv);
  } catch (error: any) {
    return res.status(500).json({ message: 'Failed to export CSV.' });
  }
};
