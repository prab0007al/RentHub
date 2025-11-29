import { Request, Response } from 'express';
import Rental from '../models/Rental';
import Item from '../models/Item';

export const rentalController = {
  // Create rental booking
  createRental: async (req: Request, res: Response) => {
    try {
      const { itemId, renterId, startDate, endDate } = req.body;
      
      // Check item availability
      const item = await Item.findById(itemId);
      if (!item || !item.availability) {
        return res.status(400).json({ message: 'Item not available' });
      }
      
      // Check for conflicting rentals
      const conflict = await Rental.findOne({
        itemId,
        status: { $in: ['pending', 'active'] },
        $or: [
          { startDate: { $lte: endDate }, endDate: { $gte: startDate } }
        ]
      });
      
      if (conflict) {
        return res.status(400).json({ message: 'Item already booked for these dates' });
      }
      
      // Calculate pricing
      const days = Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24));
      const totalPrice = days * item.pricePerDay;
      
      const rental = new Rental({
        itemId,
        renterId,
        ownerId: item.ownerId,
        startDate,
        endDate,
        totalPrice,
        depositAmount: item.deposit
      });
      
      await rental.save();
      res.status(201).json({ message: 'Rental created successfully', rental });
    } catch (error: any) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  // Get all rentals for a user
  getUserRentals: async (req: Request, res: Response) => {
    try {
      const rentals = await Rental.find({
        $or: [{ renterId: req.params.userId }, { ownerId: req.params.userId }]
      }).populate('itemId').populate('renterId', 'name email').populate('ownerId', 'name email');
      
      res.json(rentals);
    } catch (error: any) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  // Get rental by ID
  getRental: async (req: Request, res: Response) => {
    try {
      const rental = await Rental.findById(req.params.id)
        .populate('itemId')
        .populate('renterId', 'name email phone')
        .populate('ownerId', 'name email phone');
      
      if (!rental) {
        return res.status(404).json({ message: 'Rental not found' });
      }
      res.json(rental);
    } catch (error: any) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  // Update rental status
  updateRental: async (req: Request, res: Response) => {
    try {
      const { status, paymentStatus } = req.body;
      const rental = await Rental.findByIdAndUpdate(
        req.params.id,
        { status, paymentStatus },
        { new: true }
      );
      
      if (!rental) {
        return res.status(404).json({ message: 'Rental not found' });
      }
      
      res.json({ message: 'Rental updated successfully', rental });
    } catch (error: any) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },
};
