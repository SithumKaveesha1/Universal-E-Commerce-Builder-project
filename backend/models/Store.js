import mongoose from 'mongoose';

const storeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a store name'],
    unique: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  settings: {
    themeColor: {
      type: String,
      default: '#3b82f6' // Default tailwind blue-500
    },
    logo: {
      type: String,
      default: '' // URL to logo
    },
    banner: {
      type: String,
      default: '' // URL to banner
    },
    currency: {
      type: String,
      default: 'USD'
    }
  }
}, {
  timestamps: true
});

const Store = mongoose.model('Store', storeSchema);
export default Store;
