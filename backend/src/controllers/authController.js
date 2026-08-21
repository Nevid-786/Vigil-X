import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'nexttrack_secret_jwt_key_2026_super_secure';

import mongoose from 'mongoose';

/**
 * Initial seed for default admin if no users exist
 */
export const ensureAdminUser = async () => {
  try {
    if (mongoose.connection.readyState !== 1) {
      console.warn('Database connection not ready. Skipping admin user seed for now.');
      return;
    }
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      const defaultEmail = 'admin@nexttrack.io';
      const defaultPassword = 'Admin@123456';
      const passwordHash = await bcrypt.hash(defaultPassword, 10);

      await User.create({
        email: defaultEmail,
        passwordHash,
        role: 'admin',
      });

      console.log(`[SEED] Created default admin user: ${defaultEmail} / ${defaultPassword}`);
    }
  } catch (err) {
    console.error('Error seeding admin user:', err.message);
  }
};


/**
 * POST /api/auth/register
 */
export const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: { message: 'Email and password are required.' } });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ error: { message: 'User with this email already exists.' } });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      email: email.toLowerCase(),
      passwordHash,
      role: 'admin',
    });

    const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, JWT_SECRET, {
      expiresIn: '7d',
    });

    return res.status(201).json({
      token,
      user: { id: user._id, email: user.email, role: user.role },
    });
  } catch (err) {
    return res.status(500).json({ error: { message: err.message } });
  }
};

/**
 * POST /api/auth/login
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: { message: 'Email and password are required.' } });
    }

    // Auto-seed admin if database is empty
    await ensureAdminUser();

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ error: { message: 'Invalid credentials.' } });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: { message: 'Invalid credentials.' } });
    }

    const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, JWT_SECRET, {
      expiresIn: '7d',
    });

    return res.json({
      token,
      user: { id: user._id, email: user.email, role: user.role },
    });
  } catch (err) {
    return res.status(500).json({ error: { message: err.message } });
  }
};
