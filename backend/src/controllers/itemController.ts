import { Request, Response } from 'express';
import Item from '../models/Item';

export const itemController = {
  // Create item listing
  createItem: async (req: Request, res: Response) => {
    try {
      const item = new Item(req.body);
      await item.save();
      res.status(201).json({ message: 'Item listed successfully', item });
    } catch (error: any) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  // Get all items with filters
  getAllItems: async (req: Request, res: Response) => {
    try {
      const { category, city, minPrice, maxPrice, search } = req.query;
      const filter: any = { availability: true };
      
      if (category) filter.category = category;
      if (city) filter['location.city'] = city;
      if (minPrice || maxPrice) {
        filter.pricePerDay = {};
        if (minPrice) filter.pricePerDay.$gte = Number(minPrice);
        if (maxPrice) filter.pricePerDay.$lte = Number(maxPrice);
      }
      if (search) {
        filter.$text = { $search: search as string };
      }
      
      const items = await Item.find(filter).populate('ownerId', 'name rating');
      res.json(items);
    } catch (error: any) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  // Get item by ID
  getItem: async (req: Request, res: Response) => {
    try {
      const item = await Item.findById(req.params.id).populate('ownerId', 'name email phone rating');
      if (!item) {
        return res.status(404).json({ message: 'Item not found' });
      }
      res.json(item);
    } catch (error: any) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  // Update item
  updateItem: async (req: Request, res: Response) => {
    try {
      const item = await Item.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
      if (!item) {
        return res.status(404).json({ message: 'Item not found' });
      }
      res.json({ message: 'Item updated successfully', item });
    } catch (error: any) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  // Delete item
  deleteItem: async (req: Request, res: Response) => {
    try {
      const item = await Item.findByIdAndDelete(req.params.id);
      if (!item) {
        return res.status(404).json({ message: 'Item not found' });
      }
      res.json({ message: 'Item deleted successfully' });
    } catch (error: any) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },
};
