import express from 'express';
import Rental from '../models/Rental';
import Item from '../models/Item';

const router = express.Router();

// CREATE - Create rental booking
router.post('/', async (req, res) => {
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
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// READ - Get all rentals for a user
router.get('/user/:userId', async (req, res) => {
  try {
    const rentals = await Rental.find({
      $or: [{ renterId: req.params.userId }, { ownerId: req.params.userId }]
    }).populate('itemId').populate('renterId', 'name email').populate('ownerId', 'name email');
    
    res.json(rentals);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// READ - Get rental by ID
router.get('/:id', async (req, res) => {
  try {
    const rental = await Rental.findById(req.params.id)
      .populate('itemId')
      .populate('renterId', 'name email phone')
      .populate('ownerId', 'name email phone');
    
    if (!rental) {
      return res.status(404).json({ message: 'Rental not found' });
    }
    res.json(rental);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// UPDATE - Update rental status
router.put('/:id', async (req, res) => {
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
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

export default router;
