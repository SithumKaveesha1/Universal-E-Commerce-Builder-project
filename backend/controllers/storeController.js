import Store from '../models/Store.js';
import User from '../models/User.js';

// @desc    Create a new store
// @route   POST /api/stores
// @access  Private (Admin/Super Admin)
export const createStore = async (req, res) => {
  const { name, slug, settings } = req.body;

  try {
    const storeExists = await Store.findOne({ slug });

    if (storeExists) {
      return res.status(400).json({ message: 'Store with this slug already exists' });
    }

    const store = await Store.create({
      name,
      slug,
      owner: req.user._id,
      settings: settings || {}
    });

    // Update user to have this storeId
    await User.findByIdAndUpdate(req.user._id, { storeId: store._id, role: 'Admin' });

    res.status(201).json(store);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get store by Slug
// @route   GET /api/stores/:slug
// @access  Public
export const getStoreBySlug = async (req, res) => {
  try {
    const store = await Store.findOne({ slug: req.params.slug });

    if (store) {
      res.json(store);
    } else {
      res.status(404).json({ message: 'Store not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get store details (Admin)
// @route   GET /api/stores/my-store
// @access  Private (Admin)
export const getMyStore = async (req, res) => {
  try {
    const store = await Store.findOne({ owner: req.user._id });

    if (store) {
      res.json(store);
    } else {
      res.status(404).json({ message: 'Store not found for this user' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update store settings
// @route   PUT /api/stores/my-store
// @access  Private (Admin)
export const updateStore = async (req, res) => {
  try {
    const store = await Store.findOne({ owner: req.user._id });

    if (store) {
      store.name = req.body.name || store.name;
      
      if (req.body.settings) {
        store.settings.themeColor = req.body.settings.themeColor || store.settings.themeColor;
        store.settings.logo = req.body.settings.logo || store.settings.logo;
        store.settings.banner = req.body.settings.banner || store.settings.banner;
        store.settings.currency = req.body.settings.currency || store.settings.currency;
      }

      const updatedStore = await store.save();
      res.json(updatedStore);
    } else {
      res.status(404).json({ message: 'Store not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
