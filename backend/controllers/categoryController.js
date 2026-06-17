import Category from '../models/Category.js';

// @desc    Get all categories for a store
// @route   GET /api/categories/:storeId
// @access  Public
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ storeId: req.params.storeId });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a category
// @route   POST /api/categories
// @access  Private (Admin)
export const createCategory = async (req, res) => {
  const { name, slug } = req.body;
  const storeId = req.user.storeId;

  if (!storeId) {
    return res.status(400).json({ message: 'User does not own a store' });
  }

  try {
    const categoryExists = await Category.findOne({ storeId, slug });

    if (categoryExists) {
      return res.status(400).json({ message: 'Category with this slug already exists in your store' });
    }

    const category = await Category.create({
      name,
      slug,
      storeId
    });

    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a category
// @route   PUT /api/categories/:id
// @access  Private (Admin)
export const updateCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (category && category.storeId.toString() === req.user.storeId.toString()) {
      category.name = req.body.name || category.name;
      category.slug = req.body.slug || category.slug;

      const updatedCategory = await category.save();
      res.json(updatedCategory);
    } else {
      res.status(404).json({ message: 'Category not found or unauthorized' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Private (Admin)
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (category && category.storeId.toString() === req.user.storeId.toString()) {
      await Category.deleteOne({ _id: req.params.id });
      res.json({ message: 'Category removed' });
    } else {
      res.status(404).json({ message: 'Category not found or unauthorized' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
