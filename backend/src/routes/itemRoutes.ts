import express from 'express';
import { itemController } from '../controllers/itemController';
import { validateItemCreation } from '../middleware/validator';

const router = express.Router();

router.post('/', validateItemCreation, itemController.createItem);
router.get('/', itemController.getAllItems);
router.get('/:id', itemController.getItem);
router.put('/:id', itemController.updateItem);
router.delete('/:id', itemController.deleteItem);

export default router;
