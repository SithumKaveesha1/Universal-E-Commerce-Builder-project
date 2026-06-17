import express from 'express';
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
} from '../controllers/categoryController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, admin, createCategory);

router.route('/:id')
  .put(protect, admin, updateCategory)
  .delete(protect, admin, deleteCategory);

router.get('/store/:storeId', getCategories);

export default router;
