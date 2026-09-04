import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/prisma';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
    status: string;
    profileId?: string;
  };
}

const JWT_SECRET = process.env.JWT_SECRET || 'gcrjy_alumni_super_secret_jwt_key_2026_production';

export const generateToken = (payload: { id: string; email: string; role: string; status: string }) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
};

export const requireAuth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authentication required. Please log in.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string; role: string; status: string };

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      include: { profile: { select: { id: true } } },
    });

    if (!user) {
      return res.status(401).json({ message: 'User account no longer exists.' });
    }

    if (user.status === 'SUSPENDED') {
      return res.status(403).json({ message: 'Account is suspended. Please contact college administration.' });
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      status: user.status,
      profileId: user.profile?.id,
    };

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired authentication session.' });
  }
};

export const optionalAuth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string; role: string; status: string };

      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        include: { profile: { select: { id: true } } },
      });

      if (user && user.status !== 'SUSPENDED') {
        req.user = {
          id: user.id,
          email: user.email,
          role: user.role,
          status: user.status,
          profileId: user.profile?.id,
        };
      }
    }
  } catch (error) {
    // Ignore invalid token in optionalAuth
  }
  next();
};

export const requireRole = (allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required.' });
    }

    // SUPER_ADMIN has access to everything
    if (req.user.role === 'SUPER_ADMIN') {
      return next();
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied: insufficient administrative permissions.' });
    }

    next();
  };
};
