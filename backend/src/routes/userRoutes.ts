import express from 'express';
import { userController } from '../controllers/userController';
import { validateUserRegistration } from '../middleware/validator';

const router = express.Router();

// Clean, readable routes
router.post('/register', validateUserRegistration, userController.register);
router.get('/:id', userController.getUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

export default router;
