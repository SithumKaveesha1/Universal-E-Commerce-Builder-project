import Stripe from 'stripe';
import Order from '../models/Order.js';

// User needs to set STRIPE_SECRET_KEY in their .env
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder');

// @desc    Create Stripe Checkout Session
// @route   POST /api/stripe/create-checkout-session
// @access  Private
export const createCheckoutSession = async (req, res) => {
  try {
    const { orderId, storeSlug, domain } = req.body;
    
    const order = await Order.findById(orderId).populate('storeId');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const lineItems = order.orderItems.map((item) => ({
      price_data: {
        currency: order.storeId.settings?.currency?.toLowerCase() || 'usd',
        product_data: {
          name: item.name,
          images: item.image ? [item.image] : [],
        },
        unit_amount: Math.round(item.price * 100), // Stripe expects amounts in cents
      },
      quantity: item.qty,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${domain}/${storeSlug}/checkout-success?order_id=${order._id}`,
      cancel_url: `${domain}/${storeSlug}/checkout`,
      client_reference_id: order._id.toString(),
      metadata: {
        orderId: order._id.toString(),
        storeId: order.storeId._id.toString()
      }
    });

    res.json({ id: session.id, url: session.url });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
