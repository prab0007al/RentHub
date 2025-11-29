import { Request, Response, NextFunction } from 'express';

export const validateUserRegistration = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required' });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  next();
};

export const validateItemCreation = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { title, description, pricePerDay, deposit, ownerId, location } = req.body;

  if (!title || !description || !pricePerDay || !deposit || !ownerId || !location) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  if (pricePerDay < 0 || deposit < 0) {
    return res.status(400).json({ message: 'Price and deposit must be positive' });
  }

  next();
};
