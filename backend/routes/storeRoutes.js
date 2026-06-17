import express from 'express';
import {
  createStore,
  getStoreBySlug,
  getMyStore,
  updateStore
} from '../controllers/storeController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/:slug', getStoreBySlug);

// Protected Admin routes
router.route('/my-store')
  .get(protect, admin, getMyStore)
  .put(protect, admin, updateStore);

router.post('/', protect, createStore); // Any user can create a store, which makes them an Admin

export default router;
