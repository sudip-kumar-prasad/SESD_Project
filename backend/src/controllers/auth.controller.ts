import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';
import { AuthRequest } from '../middlewares/auth.middleware';

class AuthController {
  private generateToken(user: IUser): string {
    return jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'kiranaquick_secret',
      { expiresIn: '7d' }
    );
  }

  public register = async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, email, password, phone, role, address } = req.body;
      const existing = await User.findOne({ email });
      if (existing) {
        res.status(400).json({ message: 'User already exists with this email' });
        return;
      }
      const hashed = await bcrypt.hash(password, 10);
      const user = await User.create({ name, email, password: hashed, phone, role, address });
      const token = this.generateToken(user);
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        address: user.address,
        token,
      });
    } catch (error: any) {
      console.error('Registration Error:', error);
      if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map((err: any) => err.message);
        res.status(400).json({ message: messages.join(', ') });
        return;
      }
      res.status(500).json({ message: error.message || 'Internal server error during registration' });
    }
  };

  public login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        res.status(401).json({ message: 'Invalid credentials' });
        return;
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        res.status(401).json({ message: 'Invalid credentials' });
        return;
      }
      const token = this.generateToken(user);
      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        address: user.address,
        token,
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  public getMe = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'Not authorized' });
        return;
      }
      const user = await User.findById(req.user.id).select('-password');
      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }
      res.status(200).json(user);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  public updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'Not authorized' });
        return;
      }
      const user = await User.findByIdAndUpdate(
        req.user.id,
        { name: req.body.name, phone: req.body.phone, address: req.body.address },
        { new: true, runValidators: true }
      ).select('-password');
      res.status(200).json(user);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };
}

export const authController = new AuthController();
