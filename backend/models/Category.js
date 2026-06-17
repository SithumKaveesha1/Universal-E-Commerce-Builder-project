import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a category name'],
    trim: true
  },
  slug: {
    type: String,
    required: true,
    lowercase: true
  },
  storeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Store',
    required: true
  }
}, {
  timestamps: true
});

// Compound index to ensure category slugs are unique per store
categorySchema.index({ storeId: 1, slug: 1 }, { unique: true });

const Category = mongoose.model('Category', categorySchema);
export default Category;
