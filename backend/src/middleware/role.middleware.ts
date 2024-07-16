import { Request, Response, NextFunction } from 'express';
import { Role } from '../interfaces/user.interfaces';

interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: Role;
  };
}

export const authorizeRole = (requiredRole: Role) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (req.user && req.user.role === requiredRole) {
      next();
    } else {
      res.status(403).json({ error: 'Access denied: Not enough permissions' });
    }
  };
};