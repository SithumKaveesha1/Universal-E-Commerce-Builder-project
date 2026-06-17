import React, { useContext } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { Trash2 } from 'lucide-react';

const Cart = () => {
  const { store } = useOutletContext();
  const { cart, updateQuantity, removeFromCart, cartTotal } = useContext(CartContext);

  const currencySymbol = store.settings?.currency === 'USD' ? '$' : (store.settings?.currency === 'EUR' ? '€' : '');

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="bg-white p-12 text-center rounded-xl shadow-sm border">
        <h2 className="text-2xl font-bold mb-4">Your Cart is Empty</h2>
        <p className="text-gray-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
        <Link 
          to={`/${store.slug}`}
          className="px-6 py-3 text-white font-medium rounded-md transition inline-block"
          style={{ backgroundColor: store.settings?.themeColor || '#3b82f6' }}
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Cart Items */}
      <div className="lg:w-2/3 bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold">Shopping Cart ({cart.items.length} items)</h2>
        </div>
        
        <ul className="divide-y">
          {cart.items.map((item) => (
            <li key={item._id} className="p-6 flex flex-col sm:flex-row items-center sm:items-start gap-4">
              <img 
                src={item.product?.images[0] || 'https://via.placeholder.com/150'} 
                alt={item.product?.name}
                className="w-24 h-24 object-cover rounded border"
              />
              
              <div className="flex-1 text-center sm:text-left">
                <Link to={`/${store.slug}/product/${item.product?._id}`} className="font-medium text-lg hover:underline text-gray-900">
                  {item.product?.name}
                </Link>
                <p className="text-gray-500 text-sm mt-1">{currencySymbol}{item.product?.price}</p>
              </div>

              <div className="flex items-center space-x-4 mt-4 sm:mt-0">
                <div className="flex items-center border rounded">
                  <button 
                    onClick={() => updateQuantity(item._id, Math.max(1, item.quantity - 1))}
                    className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                  >-</button>
                  <span className="w-10 text-center font-medium">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item._id, Math.min(item.product?.countInStock || 1, item.quantity + 1))}
                    className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                  >+</button>
                </div>
                
                <p className="font-bold w-20 text-right">
                  {currencySymbol}{(item.product?.price * item.quantity).toFixed(2)}
                </p>

                <button 
                  onClick={() => removeFromCart(item._id)}
                  className="text-red-500 hover:text-red-700 p-2"
                  title="Remove item"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Order Summary */}
      <div className="lg:w-1/3">
        <div className="bg-white p-6 rounded-xl shadow-sm border sticky top-24">
          <h2 className="text-xl font-bold mb-6">Order Summary</h2>
          
          <div className="space-y-4 mb-6">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>{currencySymbol}{cartTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span>Calculated at checkout</span>
            </div>
            <div className="border-t pt-4 flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>{currencySymbol}{cartTotal.toFixed(2)}</span>
            </div>
          </div>

          <button 
            className="w-full py-3 text-white font-bold rounded-md hover:opacity-90 transition shadow-sm"
            style={{ backgroundColor: store.settings?.themeColor || '#3b82f6' }}
            onClick={() => alert("Checkout coming in Phase 5!")}
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
