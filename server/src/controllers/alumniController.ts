import { Response } from 'express';
import { prisma } from '../config/prisma';
import { AuthRequest } from '../middleware/auth';

export const getAlumniList = async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 12;
    const search = (req.query.search as string || '').trim();
    const department = req.query.department as string;
    const degree = req.query.degree as string;
    const batch = req.query.batch ? parseInt(req.query.batch as string, 10) : undefined;
    const batchFrom = req.query.batchFrom ? parseInt(req.query.batchFrom as string, 10) : undefined;
    const batchTo = req.query.batchTo ? parseInt(req.query.batchTo as string, 10) : undefined;
    const industry = req.query.industry as string;
    const company = req.query.company as string;
    const city = req.query.city as string;
    const country = req.query.country as string;
    const sortBy = (req.query.sortBy as string) || 'graduationYear_desc';

    const where: any = {
      isVerified: true,
      user: {
        status: 'APPROVED',
      },
    };

    if (search) {
      where.OR = [
        { fullName: { contains: search } },
        { currentCompany: { contains: search } },
        { currentDesignation: { contains: search } },
        { department: { contains: search } },
        { city: { contains: search } },
        { skills: { some: { name: { contains: search } } } },
      ];
    }

    if (department && department !== 'ALL') {
      where.department = department;
    }

    if (degree && degree !== 'ALL') {
      where.degree = degree;
    }

    if (batch) {
      where.graduationYear = batch;
    } else if (batchFrom || batchTo) {
      where.graduationYear = {};
      if (batchFrom) where.graduationYear.gte = batchFrom;
      if (batchTo) where.graduationYear.lte = batchTo;
    }

    if (industry && industry !== 'ALL') {
      where.industry = industry;
    }

    if (company) {
      where.currentCompany = { contains: company };
    }

    if (city) {
      where.city = { contains: city };
    }

    if (country && country !== 'ALL') {
      where.country = country;
    }

    let orderBy: any = { graduationYear: 'desc' };
    if (sortBy === 'name_asc') orderBy = { fullName: 'asc' };
    if (sortBy === 'name_desc') orderBy = { fullName: 'desc' };
    if (sortBy === 'graduationYear_asc') orderBy = { graduationYear: 'asc' };
    if (sortBy === 'graduationYear_desc') orderBy = { graduationYear: 'desc' };
    if (sortBy === 'recently_joined') orderBy = { createdAt: 'desc' };

    const total = await prisma.alumniProfile.count({ where });

    const alumni = await prisma.alumniProfile.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        skills: true,
        user: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
      },
    });

    const isAlumniOrAdmin = req.user && (req.user.role === 'ALUMNI' || req.user.role === 'ADMIN' || req.user.role === 'SUPER_ADMIN');

    // Apply privacy masking
    const sanitizedAlumni = alumni.map((a) => {
      const isOwner = req.user?.id === a.userId;
      const isAdmin = req.user?.role === 'SUPER_ADMIN' || req.user?.role === 'ADMIN';

      let showEmail = isAdmin || isOwner;
      let showPhone = isAdmin || isOwner;

      if (!showEmail) {
        if (a.emailPrivacy === 'PUBLIC') showEmail = true;
        if (a.emailPrivacy === 'ALUMNI_ONLY' && isAlumniOrAdmin) showEmail = true;
      }

      if (!showPhone) {
        if (a.phonePrivacy === 'PUBLIC') showPhone = true;
        if (a.phonePrivacy === 'ALUMNI_ONLY' && isAlumniOrAdmin) showPhone = true;
      }

      return {
        id: a.id,
        userId: a.userId,
        fullName: a.fullName,
        graduationYear: a.graduationYear,
        department: a.department,
        degree: a.degree,
        currentCompany: a.companyPrivacy === 'PRIVATE' && !isAdmin && !isOwner ? undefined : a.currentCompany,
        currentDesignation: a.companyPrivacy === 'PRIVATE' && !isAdmin && !isOwner ? undefined : a.currentDesignation,
        industry: a.industry,
        city: a.city,
        state: a.state,
        country: a.country,
        bio: a.bio,
        profilePhoto: a.profilePhoto,
        linkedIn: a.linkedIn,
        github: a.github,
        website: a.website,
        email: showEmail ? a.user.email : undefined,
        phone: showPhone ? a.phone : undefined,
        isFeatured: a.isFeatured,
        isVerified: a.isVerified,
        skills: a.skills.map((s) => s.name),
      };
    });

    return res.status(200).json({
      alumni: sanitizedAlumni,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('getAlumniList error:', error);
    return res.status(500).json({ message: 'Failed to retrieve alumni directory.' });
  }
};

export const getAlumniById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const alumni = await prisma.alumniProfile.findUnique({
      where: { id },
      include: {
        experiences: { orderBy: { startDate: 'desc' } },
        educations: { orderBy: { startYear: 'desc' } },
        skills: true,
        user: { select: { id: true, email: true, role: true, createdAt: true } },
      },
    });

    if (!alumni) {
      return res.status(404).json({ message: 'Alumni profile not found.' });
    }

    const isAlumniOrAdmin = req.user && (req.user.role === 'ALUMNI' || req.user.role === 'ADMIN' || req.user.role === 'SUPER_ADMIN');
    const isOwner = req.user?.id === alumni.userId;
    const isAdmin = req.user?.role === 'SUPER_ADMIN' || req.user?.role === 'ADMIN';

    let showEmail = isAdmin || isOwner;
    let showPhone = isAdmin || isOwner;

    if (!showEmail) {
      if (alumni.emailPrivacy === 'PUBLIC') showEmail = true;
      if (alumni.emailPrivacy === 'ALUMNI_ONLY' && isAlumniOrAdmin) showEmail = true;
    }

    if (!showPhone) {
      if (alumni.phonePrivacy === 'PUBLIC') showPhone = true;
      if (alumni.phonePrivacy === 'ALUMNI_ONLY' && isAlumniOrAdmin) showPhone = true;
    }

    return res.status(200).json({
      profile: {
        id: alumni.id,
        userId: alumni.userId,
        fullName: alumni.fullName,
        graduationYear: alumni.graduationYear,
        department: alumni.department,
        degree: alumni.degree,
        studentId: isOwner || isAdmin ? alumni.studentId : undefined,
        currentCompany: alumni.currentCompany,
        currentDesignation: alumni.currentDesignation,
        industry: alumni.industry,
        city: alumni.city,
        state: alumni.state,
        country: alumni.country,
        bio: alumni.bio,
        profilePhoto: alumni.profilePhoto,
        linkedIn: alumni.linkedIn,
        github: alumni.github,
        website: alumni.website,
        email: showEmail ? alumni.user.email : undefined,
        phone: showPhone ? alumni.phone : undefined,
        emailPrivacy: alumni.emailPrivacy,
        phonePrivacy: alumni.phonePrivacy,
        companyPrivacy: alumni.companyPrivacy,
        isFeatured: alumni.isFeatured,
        isVerified: alumni.isVerified,
        experiences: alumni.experiences,
        educations: alumni.educations,
        skills: alumni.skills.map((s) => s.name),
        memberSince: alumni.user.createdAt,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ message: 'Failed to retrieve alumni profile.' });
  }
};

export const getFeaturedAlumni = async (req: AuthRequest, res: Response) => {
  try {
    const featured = await prisma.alumniProfile.findMany({
      where: {
        isFeatured: true,
        isVerified: true,
        user: { status: 'APPROVED' },
      },
      take: 8,
      include: {
        skills: true,
      },
    });

    return res.status(200).json({ alumni: featured });
  } catch (error: any) {
    return res.status(500).json({ message: 'Failed to retrieve featured alumni.' });
  }
};

export const getAlumniGeoDistribution = async (req: AuthRequest, res: Response) => {
  try {
    const profiles = await prisma.alumniProfile.findMany({
      where: {
        isVerified: true,
        user: { status: 'APPROVED' },
      },
      select: {
        city: true,
        state: true,
        country: true,
        currentCompany: true,
        currentDesignation: true,
        fullName: true,
      },
    });

    const countryMap: { [country: string]: number } = {};
    const cityMap: { [city: string]: number } = {};

    profiles.forEach((p) => {
      const country = p.country || 'India';
      countryMap[country] = (countryMap[country] || 0) + 1;

      if (p.city) {
        cityMap[p.city] = (cityMap[p.city] || 0) + 1;
      }
    });

    const topCountries = Object.entries(countryMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    const topCities = Object.entries(cityMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return res.status(200).json({
      total: profiles.length,
      countries: topCountries,
      cities: topCities,
    });
  } catch (error: any) {
    return res.status(500).json({ message: 'Failed to retrieve geo distribution.' });
  }
};

export const getFilterOptions = async (req: AuthRequest, res: Response) => {
  try {
    const departments = await prisma.alumniProfile.findMany({
      distinct: ['department'],
      select: { department: true },
      where: { isVerified: true },
    });

    const degrees = await prisma.alumniProfile.findMany({
      distinct: ['degree'],
      select: { degree: true },
      where: { isVerified: true },
    });

    const industries = await prisma.alumniProfile.findMany({
      distinct: ['industry'],
      select: { industry: true },
      where: { isVerified: true, industry: { not: null } },
    });

    const batches = await prisma.alumniProfile.findMany({
      distinct: ['graduationYear'],
      select: { graduationYear: true },
      orderBy: { graduationYear: 'desc' },
    });

    return res.status(200).json({
      departments: departments.map((d) => d.department).filter(Boolean),
      degrees: degrees.map((d) => d.degree).filter(Boolean),
      industries: industries.map((i) => i.industry).filter(Boolean),
      batches: batches.map((b) => b.graduationYear),
    });
  } catch (error: any) {
    return res.status(500).json({ message: 'Failed to fetch filter options.' });
  }
};
