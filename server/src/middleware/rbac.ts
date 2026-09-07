import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth';

export const requireRole = (allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const { role_name } = req.user;

    // Admin has access to everything
    if (role_name === 'ADMIN') {
      return next();
    }

    if (!allowedRoles.includes(role_name)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Role '${role_name}' does not have sufficient permissions for this action`
      });
    }

    next();
  };
};
