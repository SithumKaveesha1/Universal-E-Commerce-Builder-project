import express from 'express';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart
} from '../controllers/cartController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All cart routes require user to be logged in
router.route('/:storeId')
  .get(protect, getCart)
  .post(protect, addToCart);

router.route('/:storeId/:itemId')
  .put(protect, updateCartItem)
  .delete(protect, removeFromCart);

export default router;
