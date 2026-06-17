import React, { useEffect } from 'react';
import { useOutletContext, useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle } from 'lucide-react';

const CheckoutSuccess = () => {
  const { store } = useOutletContext();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('order_id');

  useEffect(() => {
    // In a real app, you would use a Stripe Webhook to mark order as paid.
    // For simplicity, if we hit the success page, we'll mark it paid here.
    if (orderId) {
      axios.put(`/orders/${orderId}/pay`).catch(console.error);
    }
  }, [orderId]);

  return (
    <div className="bg-white p-12 text-center rounded-xl shadow-sm border max-w-lg mx-auto mt-12">
      <div className="flex justify-center mb-6 text-green-500">
        <CheckCircle size={64} />
      </div>
      <h2 className="text-3xl font-bold mb-4 text-gray-800">Payment Successful!</h2>
      <p className="text-gray-600 mb-8">
        Thank you for your purchase. Your order <span className="font-mono bg-gray-100 px-2 py-1 rounded">{orderId?.substring(0, 8)}...</span> has been confirmed.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link 
          to={`/${store.slug}/orders`}
          className="px-6 py-3 text-white font-medium rounded-md transition"
          style={{ backgroundColor: store.settings?.themeColor || '#3b82f6' }}
        >
          View Order History
        </Link>
        <Link 
          to={`/${store.slug}`}
          className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 transition"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default CheckoutSuccess;
