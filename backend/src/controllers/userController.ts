import { Request, Response } from 'express';
import User from '../models/User';

export const userController = {
  // Register new user
  register: async (req: Request, res: Response) => {
    try {
      const { name, email, password, phone, address } = req.body;
      
      // Check if user exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }

      const user = new User({ name, email, password, phone, address });
      await user.save();
      
      res.status(201).json({ 
        message: 'User created successfully',
        user: { id: user._id, name: user.name, email: user.email }
      });
    } catch (error: any) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  // Get user by ID
  getUser: async (req: Request, res: Response) => {
    try {
      const user = await User.findById(req.params.id).select('-password');
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
    } catch (error: any) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  // Update user profile
  updateUser: async (req: Request, res: Response) => {
    try {
      const { name, phone, address, avatar } = req.body;
      const user = await User.findByIdAndUpdate(
        req.params.id,
        { name, phone, address, avatar },
        { new: true, runValidators: true }
      ).select('-password');
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      res.json({ message: 'User updated successfully', user });
    } catch (error: any) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  // Delete user
  deleteUser: async (req: Request, res: Response) => {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json({ message: 'User deleted successfully' });
    } catch (error: any) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },
};
