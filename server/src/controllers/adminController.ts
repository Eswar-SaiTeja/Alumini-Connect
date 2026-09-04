import { Response } from 'express';
import { prisma } from '../config/prisma';
import { AuthRequest } from '../middleware/auth';
import { logAudit } from '../middleware/audit';
import { broadcastEvent } from '../sockets/socketHandler';
import { Parser } from 'json2csv';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import csvParser from 'csv-parser';

export const getDashboardStats = async (req: AuthRequest, res: Response) => {
  try {
    const [
      totalAlumni,
      verifiedAlumni,
      pendingApprovals,
      totalEvents,
      totalRegistrations,
      totalNews,
      totalStories,
      galleryCount,
      unreadMessages,
      totalUsers,
    ] = await Promise.all([
      prisma.alumniProfile.count(),
      prisma.alumniProfile.count({ where: { isVerified: true } }),
      prisma.user.count({ where: { status: 'PENDING' } }),
      prisma.event.count(),
      prisma.eventRegistration.count({ where: { attendanceStatus: { not: 'CANCELLED' } } }),
      prisma.newsAnnouncement.count(),
      prisma.successStory.count(),
      prisma.galleryItem.count(),
      prisma.contactMessage.count({ where: { status: 'NEW' } }),
      prisma.user.count(),
    ]);

    // Batch Distribution (e.g. by groups of years)
    const batches = await prisma.alumniProfile.groupBy({
      by: ['graduationYear'],
      _count: { id: true },
      orderBy: { graduationYear: 'asc' },
    });

    const alumniByBatch = batches.map((b) => ({
      year: b.graduationYear.toString(),
      count: b._count.id,
    }));

    // Department Distribution
    const departments = await prisma.alumniProfile.groupBy({
      by: ['department'],
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
    });

    const alumniByDepartment = departments.map((d) => ({
      name: d.department,
      count: d._count.id,
    }));

    // Industry Distribution
    const industries = await prisma.alumniProfile.groupBy({
      by: ['industry'],
      where: { industry: { not: null } },
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
    });

    const alumniByIndustry = industries.map((i) => ({
      name: i.industry || 'Other',
      count: i._count.id,
    }));

    // Event Participation data
    const events = await prisma.event.findMany({
      take: 6,
      orderBy: { eventDate: 'desc' },
      include: {
        _count: {
          select: {
            registrations: { where: { attendanceStatus: { not: 'CANCELLED' } } },
          },
        },
      },
    });

    const eventParticipation = events.map((e) => ({
      name: e.title.length > 20 ? e.title.slice(0, 20) + '...' : e.title,
      capacity: e.capacity,
      registered: e._count.registrations,
    }));

    // Recent registered alumni
    const recentAlumni = await prisma.alumniProfile.findMany({
      take: 6,
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { email: true, status: true } } },
    });

    // Recent Audit Logs
    const recentLogs = await prisma.auditLog.findMany({
      take: 8,
      orderBy: { createdAt: 'desc' },
    });

    return res.status(200).json({
      metrics: {
        totalAlumni,
        verifiedAlumni,
        pendingApprovals,
        totalEvents,
        totalRegistrations,
        totalNews,
        totalStories,
        galleryCount,
        unreadMessages,
        totalUsers,
      },
      charts: {
        alumniByBatch,
        alumniByDepartment,
        alumniByIndustry,
        eventParticipation,
      },
      recentAlumni,
      recentLogs,
    });
  } catch (error: any) {
    console.error('getDashboardStats error:', error);
    return res.status(500).json({ message: 'Failed to retrieve dashboard analytics.' });
  }
};

export const getUsers = async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 15;
    const role = req.query.role as string;
    const status = req.query.status as string;
    const search = req.query.search as string;

    const where: any = {};

    if (role && role !== 'ALL') {
      where.role = role;
    }

    if (status && status !== 'ALL') {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { email: { contains: search } },
        { profile: { fullName: { contains: search } } },
        { profile: { department: { contains: search } } },
      ];
    }

    const total = await prisma.user.count({ where });

    const users = await prisma.user.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        profile: true,
      },
    });

    return res.status(200).json({
      users,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    return res.status(500).json({ message: 'Failed to fetch users.' });
  }
};

export const updateUser = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { role, status, password } = req.body;

    const data: any = {};
    if (role) data.role = role;
    if (status) data.status = status;

    if (password && password.length >= 6) {
      const salt = await bcrypt.genSalt(10);
      data.passwordHash = await bcrypt.hash(password, salt);
    }

    const updated = await prisma.user.update({
      where: { id },
      data,
      include: { profile: true },
    });

    if (req.user) {
      await logAudit(req.user.email, 'UPDATED_USER', 'User', id, `Updated user ${updated.email} role: ${role}, status: ${status}`);
    }

    broadcastEvent('USER_STATUS_UPDATED', { userId: id, status, role });

    return res.status(200).json({ message: 'User updated successfully.', user: updated });
  } catch (error: any) {
    return res.status(500).json({ message: 'Failed to update user.' });
  }
};

export const deleteUser = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (user.role === 'SUPER_ADMIN') {
      return res.status(403).json({ message: 'Super Admin account cannot be deleted.' });
    }

    await prisma.user.delete({ where: { id } });

    if (req.user) {
      await logAudit(req.user.email, 'DELETED_USER', 'User', id, `Deleted user ${user.email}`);
    }

    return res.status(200).json({ message: 'User deleted successfully.' });
  } catch (error: any) {
    return res.status(500).json({ message: 'Failed to delete user.' });
  }
};

export const bulkUserAction = async (req: AuthRequest, res: Response) => {
  try {
    const { userIds, action } = req.body; // action: 'APPROVE', 'REJECT', 'SUSPEND', 'DELETE'

    if (!Array.isArray(userIds) || userIds.length === 0 || !action) {
      return res.status(400).json({ message: 'User IDs array and action are required.' });
    }

    if (action === 'APPROVE') {
      await prisma.user.updateMany({
        where: { id: { in: userIds } },
        data: { status: 'APPROVED' },
      });
      await prisma.alumniProfile.updateMany({
        where: { userId: { in: userIds } },
        data: { isVerified: true },
      });
    } else if (action === 'REJECT') {
      await prisma.user.updateMany({
        where: { id: { in: userIds } },
        data: { status: 'REJECTED' },
      });
    } else if (action === 'SUSPEND') {
      await prisma.user.updateMany({
        where: { id: { in: userIds } },
        data: { status: 'SUSPENDED' },
      });
    } else if (action === 'DELETE') {
      await prisma.user.deleteMany({
        where: { id: { in: userIds }, role: { not: 'SUPER_ADMIN' } },
      });
    }

    if (req.user) {
      await logAudit(req.user.email, `BULK_${action}`, 'User', undefined, `Executed ${action} on ${userIds.length} users`);
    }

    broadcastEvent('USERS_BULK_UPDATED', { count: userIds.length, action });

    return res.status(200).json({ message: `Successfully performed ${action} on selected users.` });
  } catch (error: any) {
    return res.status(500).json({ message: 'Bulk action failed.' });
  }
};

export const verifyAlumni = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { isVerified } = req.body;

    const profile = await prisma.alumniProfile.update({
      where: { id },
      data: { isVerified: Boolean(isVerified) },
      include: { user: true },
    });

    if (profile.user) {
      await prisma.user.update({
        where: { id: profile.user.id },
        data: { status: isVerified ? 'APPROVED' : 'PENDING' },
      });

      // Notification
      await prisma.notification.create({
        data: {
          userId: profile.user.id,
          title: isVerified ? 'Profile Verified!' : 'Profile Status Update',
          message: isVerified
            ? 'Your alumni profile has been verified by the college administration.'
            : 'Your verification status has been updated.',
          type: 'ALUMNI',
          link: '/user/dashboard',
        },
      });
    }

    if (req.user) {
      await logAudit(req.user.email, 'VERIFIED_ALUMNI', 'AlumniProfile', id, `Updated verification status for ${profile.fullName} to ${isVerified}`);
    }

    broadcastEvent('ALUMNI_VERIFIED', { id, isVerified, name: profile.fullName });

    return res.status(200).json({ message: 'Alumni verification status updated.', profile });
  } catch (error: any) {
    return res.status(500).json({ message: 'Failed to update verification status.' });
  }
};

export const getAuditLogs = async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 25;
    const action = req.query.action as string;

    const where: any = {};
    if (action && action !== 'ALL') {
      where.action = action;
    }

    const total = await prisma.auditLog.count({ where });

    const logs = await prisma.auditLog.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });

    return res.status(200).json({
      logs,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    return res.status(500).json({ message: 'Failed to fetch audit logs.' });
  }
};

export const exportAlumniCSV = async (req: AuthRequest, res: Response) => {
  try {
    const profiles = await prisma.alumniProfile.findMany({
      include: {
        user: { select: { email: true, status: true, role: true } },
        skills: true,
      },
      orderBy: { graduationYear: 'desc' },
    });

    const data = profiles.map((p) => ({
      FullName: p.fullName,
      Email: p.user.email,
      Phone: p.phone || '',
      GraduationYear: p.graduationYear,
      Department: p.department,
      Degree: p.degree,
      StudentId: p.studentId || '',
      CurrentCompany: p.currentCompany || '',
      CurrentDesignation: p.currentDesignation || '',
      Industry: p.industry || '',
      City: p.city || '',
      State: p.state || '',
      Country: p.country || 'India',
      LinkedIn: p.linkedIn || '',
      IsVerified: p.isVerified ? 'YES' : 'NO',
      Status: p.user.status,
      Skills: p.skills.map((s) => s.name).join(', '),
    }));

    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(data);

    res.header('Content-Type', 'text/csv');
    res.attachment(`GCRJY_Alumni_Directory_${new Date().toISOString().split('T')[0]}.csv`);
    return res.send(csv);
  } catch (error: any) {
    console.error('exportAlumniCSV error:', error);
    return res.status(500).json({ message: 'Failed to export alumni directory.' });
  }
};

export const importAlumniCSV = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'CSV file is required.' });
    }

    const results: any[] = [];
    const filePath = req.file.path;

    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on('data', (data) => results.push(data))
      .on('end', async () => {
        try {
          fs.unlinkSync(filePath); // delete temp file

          let importedCount = 0;
          let skippedCount = 0;
          const errors: string[] = [];

          for (const row of results) {
            // Map possible column headers
            const email = (row.Email || row.email || row['Email Address'] || '').toLowerCase().trim();
            const fullName = (row.FullName || row.name || row.Name || row['Full Name'] || '').trim();
            const graduationYearStr = row.GraduationYear || row.batch || row.Year || row['Graduation Year'] || '2024';
            const department = row.Department || row.department || row.Branch || 'General';
            const degree = row.Degree || row.degree || 'Bachelor of Science (B.Sc)';
            const company = row.CurrentCompany || row.company || row.Company || '';
            const designation = row.CurrentDesignation || row.designation || row.Role || '';
            const city = row.City || row.city || row.Location || 'Rajahmundry';
            const country = row.Country || row.country || 'India';
            const phone = row.Phone || row.phone || row['Mobile Number'] || '';

            if (!email || !fullName) {
              skippedCount++;
              errors.push(`Row missing email or name: ${JSON.stringify(row)}`);
              continue;
            }

            const existingUser = await prisma.user.findUnique({ where: { email } });
            if (existingUser) {
              skippedCount++;
              errors.push(`Email already exists: ${email}`);
              continue;
            }

            const defaultPassword = 'AlumniPassword@2026';
            const salt = await bcrypt.genSalt(10);
            const passwordHash = await bcrypt.hash(defaultPassword, salt);

            await prisma.user.create({
              data: {
                email,
                passwordHash,
                role: 'ALUMNI',
                status: 'APPROVED',
                profile: {
                  create: {
                    fullName,
                    graduationYear: parseInt(graduationYearStr, 10) || 2024,
                    department,
                    degree,
                    currentCompany: company || null,
                    currentDesignation: designation || null,
                    city: city || null,
                    country: country || 'India',
                    phone: phone || null,
                    isVerified: true,
                  },
                },
              },
            });

            importedCount++;
          }

          if (req.user) {
            await logAudit(
              req.user.email,
              'IMPORTED_ALUMNI_CSV',
              'AlumniProfile',
              undefined,
              `Imported ${importedCount} alumni, ${skippedCount} skipped`
            );
          }

          broadcastEvent('ALUMNI_BULK_IMPORTED', { importedCount });

          return res.status(200).json({
            message: `Import completed: ${importedCount} records imported, ${skippedCount} skipped.`,
            importedCount,
            skippedCount,
            errors: errors.slice(0, 10),
          });
        } catch (innerError: any) {
          return res.status(500).json({ message: 'Error processing CSV rows: ' + innerError.message });
        }
      });
  } catch (error: any) {
    return res.status(500).json({ message: 'Failed to import CSV.' });
  }
};
