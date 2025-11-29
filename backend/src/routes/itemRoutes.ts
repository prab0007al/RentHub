import express from 'express';
import Item from '../models/Item';

const router = express.Router();

// CREATE - List new item
router.post('/', async (req, res) => {
  try {
    const item = new Item(req.body);
    await item.save();
    res.status(201).json({ message: 'Item listed successfully', item });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// READ - Get all items (with filters)
router.get('/', async (req, res) => {
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
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// READ - Get item by ID
router.get('/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate('ownerId', 'name email phone rating');
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// UPDATE - Update item
router.put('/:id', async (req, res) => {
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
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// DELETE - Delete item
router.delete('/:id', async (req, res) => {
  try {
    const item = await Item.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

export default router;
