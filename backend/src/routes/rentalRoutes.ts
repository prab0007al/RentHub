import express from 'express';
import { rentalController } from '../controllers/rentalController';

const router = express.Router();

router.post('/', rentalController.createRental);
router.get('/user/:userId', rentalController.getUserRentals);
router.get('/:id', rentalController.getRental);
router.put('/:id', rentalController.updateRental);

export default router;
