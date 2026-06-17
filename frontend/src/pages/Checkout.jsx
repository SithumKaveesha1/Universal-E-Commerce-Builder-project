import React, { useState, useContext } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../context/CartContext';

const Checkout = () => {
  const { store } = useOutletContext();
  const { cart, cartTotal } = useContext(CartContext);
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState({
    address: '',
    city: '',
    postalCode: '',
    country: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('PayPal');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const currencySymbol = store.settings?.currency === 'USD' ? '$' : (store.settings?.currency === 'EUR' ? '€' : '');

  const handleChange = (e) => {
    setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
  };

  const placeOrder = async (e) => {
    e.preventDefault();
    if (!cart.items || cart.items.length === 0) {
      setError('Your cart is empty');
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        storeId: store._id,
        orderItems: cart.items.map(item => ({
          name: item.product.name,
          qty: item.quantity,
          image: item.product.images[0] || '',
          price: item.product.price,
          product: item.product._id
        })),
        shippingAddress,
        paymentMethod,
        itemsPrice: cartTotal,
        shippingPrice: 0, // Free shipping for now
        totalPrice: cartTotal
      };

      const { data: orderResponse } = await axios.post('/orders', orderData);
      
      if (paymentMethod === 'Stripe') {
        // Call Stripe checkout session
        const { data: stripeSession } = await axios.post('/stripe/create-checkout-session', {
          orderId: orderResponse._id,
          storeSlug: store.slug,
          domain: window.location.origin
        });
        
        // Redirect to Stripe Hosted Checkout
        window.location.href = stripeSession.url;
      } else {
        // Redirect to order history or success page
        navigate(`/${store.slug}/orders`);
        // CartContext needs to be refreshed (cart is empty now)
        window.location.reload(); 
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error placing order');
      setLoading(false);
    }
  };

  if (!cart.items || cart.items.length === 0) {
    return <div className="text-center py-12">Your cart is empty.</div>;
  }

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Checkout Form */}
      <div className="md:w-2/3 bg-white p-8 rounded-xl shadow-sm border">
        <h2 className="text-2xl font-bold mb-6">Checkout</h2>
        
        {error && <p className="text-red-500 mb-4 bg-red-50 p-3 rounded border border-red-200">{error}</p>}

        <form onSubmit={placeOrder}>
          <h3 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">Shipping Address</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Address</label>
              <input type="text" name="address" required onChange={handleChange} className="w-full px-4 py-2 border rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">City</label>
              <input type="text" name="city" required onChange={handleChange} className="w-full px-4 py-2 border rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Postal Code</label>
              <input type="text" name="postalCode" required onChange={handleChange} className="w-full px-4 py-2 border rounded-md" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Country</label>
              <input type="text" name="country" required onChange={handleChange} className="w-full px-4 py-2 border rounded-md" />
            </div>
          </div>

          <h3 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2 mt-8">Payment Method</h3>
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-2">
              <input 
                type="radio" 
                id="paypal" 
                name="paymentMethod" 
                value="PayPal" 
                checked={paymentMethod === 'PayPal'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-4 h-4"
              />
              <label htmlFor="paypal" className="font-medium">PayPal or Credit Card</label>
            </div>
            <div className="flex items-center space-x-3">
              <input 
                type="radio" 
                id="stripe" 
                name="paymentMethod" 
                value="Stripe" 
                checked={paymentMethod === 'Stripe'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-4 h-4"
              />
              <label htmlFor="stripe" className="font-medium">Stripe</label>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3 text-white font-bold rounded-md hover:opacity-90 transition shadow-sm"
            style={{ backgroundColor: store.settings?.themeColor || '#3b82f6' }}
          >
            {loading ? 'Placing Order...' : 'Place Order'}
          </button>
        </form>
      </div>

      {/* Order Summary Sidebar */}
      <div className="md:w-1/3">
        <div className="bg-gray-50 p-6 rounded-xl border">
          <h3 className="text-xl font-bold mb-4">Order Summary</h3>
          <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
            {cart.items.map(item => (
              <div key={item._id} className="flex justify-between items-center text-sm">
                <div className="flex items-center space-x-3 truncate flex-1 pr-2">
                  <img src={item.product?.images[0]} alt="" className="w-10 h-10 object-cover rounded" />
                  <span className="truncate">{item.product?.name} x {item.quantity}</span>
                </div>
                <span className="font-medium">{currencySymbol}{(item.product?.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between text-gray-600">
              <span>Items Total</span>
              <span>{currencySymbol}{cartTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span>{currencySymbol}0.00</span>
            </div>
            <div className="flex justify-between font-bold text-lg pt-2 border-t mt-2">
              <span>Total</span>
              <span>{currencySymbol}{cartTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
