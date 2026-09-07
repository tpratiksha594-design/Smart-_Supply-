import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: {
    user_id: number;
    email: string;
    role_id: number;
    role_name: string;
  };
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    // If no token is provided in headers, check for demo mock bypass or return 401
    return res.status(401).json({ success: false, message: 'Access token required' });
  }

  const secret = process.env.JWT_SECRET || 'supplysync_jwt_super_secret_key_2026_production';

  jwt.verify(token, secret, (err, decoded: any) => {
    if (err) {
      return res.status(403).json({ success: false, message: 'Invalid or expired token' });
    }

    req.user = decoded;
    next();
  });
};
