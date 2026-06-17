import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

// @desc    Get user cart for a specific store
// @route   GET /api/carts/:storeId
// @access  Private
export const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id, storeId: req.params.storeId }).populate('items.product', 'name price images countInStock');
    
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, storeId: req.params.storeId, items: [] });
    }
    
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add item to cart
// @route   POST /api/carts/:storeId
// @access  Private
export const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  const storeId = req.params.storeId;

  try {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    let cart = await Cart.findOne({ user: req.user._id, storeId });

    if (!cart) {
      cart = await Cart.create({ user: req.user._id, storeId, items: [] });
    }

    const existingItemIndex = cart.items.findIndex(item => item.product.toString() === productId);

    if (existingItemIndex >= 0) {
      cart.items[existingItemIndex].quantity += Number(quantity);
    } else {
      cart.items.push({ product: productId, quantity: Number(quantity) });
    }

    await cart.save();
    
    // Return populated cart
    cart = await Cart.findById(cart._id).populate('items.product', 'name price images countInStock');
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/carts/:storeId/:itemId
// @access  Private
export const updateCartItem = async (req, res) => {
  const { quantity } = req.body;

  try {
    let cart = await Cart.findOne({ user: req.user._id, storeId: req.params.storeId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const item = cart.items.id(req.params.itemId);
    if (item) {
      item.quantity = Number(quantity);
      await cart.save();
      cart = await Cart.findById(cart._id).populate('items.product', 'name price images countInStock');
      res.json(cart);
    } else {
      res.status(404).json({ message: 'Item not found in cart' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/carts/:storeId/:itemId
// @access  Private
export const removeFromCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id, storeId: req.params.storeId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.items.pull({ _id: req.params.itemId });
    await cart.save();
    
    cart = await Cart.findById(cart._id).populate('items.product', 'name price images countInStock');
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
