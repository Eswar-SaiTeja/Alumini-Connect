import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../config/prisma';
import { generateToken, AuthRequest } from '../middleware/auth';
import { broadcastEvent } from '../sockets/socketHandler';
import { logAudit } from '../middleware/audit';

export const register = async (req: Request, res: Response) => {
  try {
    const {
      fullName,
      email,
      password,
      phone,
      graduationYear,
      department,
      degree,
      studentId,
      currentCompany,
      currentDesignation,
      industry,
      city,
      state,
      country,
      profilePhoto,
    } = req.body;

    if (!fullName || !email || !password || !graduationYear || !department || !degree) {
      return res.status(400).json({ message: 'Please provide all required registration fields.' });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existingUser) {
      return res.status(409).json({ message: 'An account with this email address already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase().trim(),
        passwordHash,
        role: 'ALUMNI',
        status: 'APPROVED', // Default to approved so users can immediately connect, or PENDING if admin review is toggled
        profile: {
          create: {
            fullName: fullName.trim(),
            graduationYear: parseInt(graduationYear, 10),
            department,
            degree,
            studentId: studentId || null,
            currentCompany: currentCompany || null,
            currentDesignation: currentDesignation || null,
            industry: industry || null,
            city: city || null,
            state: state || null,
            country: country || 'India',
            phone: phone || null,
            profilePhoto: profilePhoto || null,
            isVerified: true,
          },
        },
      },
      include: {
        profile: true,
      },
    });

    // Create a welcome notification
    await prisma.notification.create({
      data: {
        userId: user.id,
        title: 'Welcome to GCRJY Alumni Connect!',
        message: 'Your profile has been created. Explore events, connect with your batchmates, and stay in touch.',
        type: 'SYSTEM',
        link: '/user/dashboard',
      },
    });

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
      status: user.status,
    });

    // Broadcast real-time event to Admin Dashboard
    broadcastEvent('ALUMNI_REGISTERED', {
      id: user.profile?.id,
      name: user.profile?.fullName,
      batch: user.profile?.graduationYear,
      department: user.profile?.department,
    });

    return res.status(201).json({
      message: 'Registration successful! Welcome to the Alumni Network.',
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        status: user.status,
        profile: user.profile,
      },
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    return res.status(500).json({ message: error.message || 'Internal server error during registration.' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      include: {
        profile: {
          include: {
            experiences: { orderBy: { startDate: 'desc' } },
            educations: { orderBy: { startYear: 'desc' } },
            skills: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email address or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email address or password.' });
    }

    if (user.status === 'SUSPENDED') {
      return res.status(403).json({ message: 'Your account has been suspended by administration.' });
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
      status: user.status,
    });

    return res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        status: user.status,
        profile: user.profile,
      },
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Server error during login.' });
  }
};

export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated.' });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        profile: {
          include: {
            experiences: { orderBy: { startDate: 'desc' } },
            educations: { orderBy: { startYear: 'desc' } },
            skills: true,
          },
        },
        registrations: {
          include: {
            event: true,
          },
          orderBy: { createdAt: 'desc' },
        },
        notifications: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const unreadNotificationsCount = await prisma.notification.count({
      where: {
        OR: [{ userId: user.id }, { userId: null }],
        isRead: false,
      },
    });

    return res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        status: user.status,
        profile: user.profile,
        registrations: user.registrations,
        notifications: user.notifications,
        unreadNotificationsCount,
      },
    });
  } catch (error: any) {
    console.error('GetMe error:', error);
    return res.status(500).json({ message: 'Server error retrieving user data.' });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated.' });
    }

    const {
      fullName,
      graduationYear,
      department,
      degree,
      studentId,
      currentCompany,
      currentDesignation,
      industry,
      city,
      state,
      country,
      bio,
      profilePhoto,
      phone,
      linkedIn,
      github,
      website,
      emailPrivacy,
      phonePrivacy,
      companyPrivacy,
      skills,
    } = req.body;

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { profile: true },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    let updatedProfile;

    if (user.profile) {
      // Update skills if provided
      if (Array.isArray(skills)) {
        await prisma.alumniSkill.deleteMany({
          where: { alumniId: user.profile.id },
        });
        if (skills.length > 0) {
          await prisma.alumniSkill.createMany({
            data: skills.map((name: string) => ({
              alumniId: user.profile!.id,
              name: name.trim(),
            })),
          });
        }
      }

      updatedProfile = await prisma.alumniProfile.update({
        where: { id: user.profile.id },
        data: {
          fullName: fullName ?? user.profile.fullName,
          graduationYear: graduationYear ? parseInt(graduationYear, 10) : user.profile.graduationYear,
          department: department ?? user.profile.department,
          degree: degree ?? user.profile.degree,
          studentId: studentId !== undefined ? studentId : user.profile.studentId,
          currentCompany: currentCompany !== undefined ? currentCompany : user.profile.currentCompany,
          currentDesignation: currentDesignation !== undefined ? currentDesignation : user.profile.currentDesignation,
          industry: industry !== undefined ? industry : user.profile.industry,
          city: city !== undefined ? city : user.profile.city,
          state: state !== undefined ? state : user.profile.state,
          country: country !== undefined ? country : user.profile.country,
          bio: bio !== undefined ? bio : user.profile.bio,
          profilePhoto: profilePhoto !== undefined ? profilePhoto : user.profile.profilePhoto,
          phone: phone !== undefined ? phone : user.profile.phone,
          linkedIn: linkedIn !== undefined ? linkedIn : user.profile.linkedIn,
          github: github !== undefined ? github : user.profile.github,
          website: website !== undefined ? website : user.profile.website,
          emailPrivacy: emailPrivacy ?? user.profile.emailPrivacy,
          phonePrivacy: phonePrivacy ?? user.profile.phonePrivacy,
          companyPrivacy: companyPrivacy ?? user.profile.companyPrivacy,
        },
        include: {
          experiences: true,
          educations: true,
          skills: true,
        },
      });
    } else {
      updatedProfile = await prisma.alumniProfile.create({
        data: {
          userId: user.id,
          fullName: fullName || 'Alumni Member',
          graduationYear: graduationYear ? parseInt(graduationYear, 10) : 2024,
          department: department || 'General',
          degree: degree || 'Bachelor',
          currentCompany,
          currentDesignation,
          industry,
          city,
          state,
          country: country || 'India',
          bio,
          profilePhoto,
          phone,
          linkedIn,
        },
        include: {
          experiences: true,
          educations: true,
          skills: true,
        },
      });
    }

    broadcastEvent('ALUMNI_UPDATED', {
      id: updatedProfile.id,
      name: updatedProfile.fullName,
      department: updatedProfile.department,
    });

    return res.status(200).json({
      message: 'Profile updated successfully!',
      profile: updatedProfile,
    });
  } catch (error: any) {
    console.error('Update profile error:', error);
    return res.status(500).json({ message: 'Server error updating profile.' });
  }
};

export const addExperience = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.profileId) {
      return res.status(400).json({ message: 'Profile not found.' });
    }

    const { title, company, location, startDate, endDate, isCurrent, description } = req.body;

    const experience = await prisma.workExperience.create({
      data: {
        alumniId: req.user.profileId,
        title,
        company,
        location,
        startDate,
        endDate: isCurrent ? null : endDate,
        isCurrent: Boolean(isCurrent),
        description,
      },
    });

    return res.status(201).json({ message: 'Experience added successfully.', experience });
  } catch (error: any) {
    return res.status(500).json({ message: 'Failed to add work experience.' });
  }
};

export const deleteExperience = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.workExperience.delete({
      where: { id },
    });
    return res.status(200).json({ message: 'Experience deleted successfully.' });
  } catch (error: any) {
    return res.status(500).json({ message: 'Failed to delete experience.' });
  }
};

export const addEducation = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.profileId) {
      return res.status(400).json({ message: 'Profile not found.' });
    }

    const { institution, degree, fieldOfStudy, startYear, endYear } = req.body;

    const education = await prisma.education.create({
      data: {
        alumniId: req.user.profileId,
        institution,
        degree,
        fieldOfStudy,
        startYear: parseInt(startYear, 10),
        endYear: endYear ? parseInt(endYear, 10) : null,
      },
    });

    return res.status(201).json({ message: 'Education added successfully.', education });
  } catch (error: any) {
    return res.status(500).json({ message: 'Failed to add education record.' });
  }
};

export const deleteEducation = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.education.delete({
      where: { id },
    });
    return res.status(200).json({ message: 'Education record deleted successfully.' });
  } catch (error: any) {
    return res.status(500).json({ message: 'Failed to delete education record.' });
  }
};

export const changePassword = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated.' });
    }

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword || newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect current password.' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword, salt);

    await prisma.user.update({
      where: { id: req.user.id },
      data: { passwordHash },
    });

    return res.status(200).json({ message: 'Password changed successfully.' });
  } catch (error: any) {
    return res.status(500).json({ message: 'Failed to change password.' });
  }
};
