import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { mockStore } from '../services/mockDataStore';
import { getDbPool, checkIsMySQLConnected } from '../config/db';
import { AuthRequest } from '../middleware/auth';

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role_id } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email and password are required' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const assignedRoleId = role_id || 2; // Default to WAREHOUSE_MANAGER

    if (checkIsMySQLConnected() && getDbPool()) {
      const pool = getDbPool()!;
      const [existing]: any = await pool.query('SELECT user_id FROM users WHERE email = ?', [email]);
      if (existing.length > 0) {
        return res.status(400).json({ success: false, message: 'Email address already registered' });
      }

      const [result]: any = await pool.query(
        'INSERT INTO users (name, email, password_hash, role_id, status) VALUES (?, ?, ?, ?, ?)',
        [name, email, hashedPassword, assignedRoleId, 'ACTIVE']
      );

      const userId = result.insertId;
      const roleMap: Record<number, string> = { 1: 'ADMIN', 2: 'WAREHOUSE_MANAGER', 3: 'PROCUREMENT_MANAGER', 4: 'SALES_MANAGER', 5: 'VIEWER' };
      const roleName = roleMap[assignedRoleId] || 'WAREHOUSE_MANAGER';

      const token = jwt.sign(
        { user_id: userId, email, role_id: assignedRoleId, role_name: roleName },
        process.env.JWT_SECRET || 'supplysync_jwt_super_secret_key_2026_production',
        { expiresIn: '7d' }
      );

      return res.status(201).json({
        success: true,
        token,
        user: { user_id: userId, name, email, role_id: assignedRoleId, role_name: roleName, status: 'ACTIVE' }
      });
    }

    // Fallback Mock Store
    const existing = mockStore.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return res.status(400).json({ success: false, message: 'Email address already registered' });
    }

    const newUserId = mockStore.users.length + 1;
    const roleObj = mockStore.roles.find(r => r.role_id === assignedRoleId);
    const roleName = roleObj ? roleObj.name : 'WAREHOUSE_MANAGER';

    const newUser = {
      user_id: newUserId,
      name,
      email,
      password_hash: hashedPassword,
      role_id: assignedRoleId,
      role_name: roleName,
      status: 'ACTIVE' as const
    };

    mockStore.users.push(newUser);

    const token = jwt.sign(
      { user_id: newUserId, email, role_id: assignedRoleId, role_name: roleName },
      process.env.JWT_SECRET || 'supplysync_jwt_super_secret_key_2026_production',
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      success: true,
      token,
      user: { user_id: newUserId, name, email, role_id: assignedRoleId, role_name: roleName, status: 'ACTIVE' }
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    if (checkIsMySQLConnected() && getDbPool()) {
      const pool = getDbPool()!;
      const [rows]: any = await pool.query(
        'SELECT u.*, r.name as role_name FROM users u JOIN roles r ON u.role_id = r.role_id WHERE u.email = ?',
        [email]
      );

      if (rows.length === 0) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }

      const user = rows[0];
      const valid = await bcrypt.compare(password, user.password_hash);
      if (!valid) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { user_id: user.user_id, email: user.email, role_id: user.role_id, role_name: user.role_name },
        process.env.JWT_SECRET || 'supplysync_jwt_super_secret_key_2026_production',
        { expiresIn: '7d' }
      );

      return res.json({
        success: true,
        token,
        user: {
          user_id: user.user_id,
          name: user.name,
          email: user.email,
          role_id: user.role_id,
          role_name: user.role_name,
          status: user.status
        }
      });
    }

    // Mock Store Fallback
    const user = mockStore.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      // Demo helper: allow quick login for any demo email
      const demoUser = mockStore.users[0];
      const token = jwt.sign(
        { user_id: demoUser.user_id, email: demoUser.email, role_id: demoUser.role_id, role_name: demoUser.role_name },
        process.env.JWT_SECRET || 'supplysync_jwt_super_secret_key_2026_production',
        { expiresIn: '7d' }
      );
      return res.json({
        success: true,
        token,
        user: {
          user_id: demoUser.user_id,
          name: demoUser.name,
          email: demoUser.email,
          role_id: demoUser.role_id,
          role_name: demoUser.role_name,
          status: demoUser.status
        }
      });
    }

    const token = jwt.sign(
      { user_id: user.user_id, email: user.email, role_id: user.role_id, role_name: user.role_name || 'ADMIN' },
      process.env.JWT_SECRET || 'supplysync_jwt_super_secret_key_2026_production',
      { expiresIn: '7d' }
    );

    return res.json({
      success: true,
      token,
      user: {
        user_id: user.user_id,
        name: user.name,
        email: user.email,
        role_id: user.role_id,
        role_name: user.role_name || 'ADMIN',
        status: user.status
      }
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const user = mockStore.users.find(u => u.user_id === req.user?.user_id) || {
      user_id: req.user.user_id,
      name: 'SupplySync User',
      email: req.user.email,
      role_id: req.user.role_id,
      role_name: req.user.role_name,
      status: 'ACTIVE'
    };

    return res.json({ success: true, user });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
