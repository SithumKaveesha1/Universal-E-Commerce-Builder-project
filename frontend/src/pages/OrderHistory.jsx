import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import axios from 'axios';

const OrderHistory = () => {
  const { store } = useOutletContext();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get('/orders/myorders');
        // Filter by current store in frontend (or could modify backend to filter)
        const storeOrders = data.filter(order => order.storeId._id === store._id);
        setOrders(storeOrders);
      } catch (error) {
        console.error('Error fetching orders', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [store._id]);

  if (loading) return <div className="py-12 text-center text-gray-500">Loading orders...</div>;

  return (
    <div className="bg-white p-8 rounded-xl shadow-sm border">
      <h2 className="text-2xl font-bold mb-6">My Order History</h2>
      
      {orders.length === 0 ? (
        <p className="text-gray-500">You have no orders in this store yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-t text-sm uppercase text-gray-600">
                <th className="py-3 px-4 font-medium">Order ID</th>
                <th className="py-3 px-4 font-medium">Date</th>
                <th className="py-3 px-4 font-medium">Total</th>
                <th className="py-3 px-4 font-medium">Paid</th>
                <th className="py-3 px-4 font-medium">Delivered</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-b">
                  <td className="py-3 px-4 font-mono text-sm">{order._id.substring(0, 10)}...</td>
                  <td className="py-3 px-4 text-sm">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="py-3 px-4 text-sm font-medium">
                    {store.settings?.currency === 'USD' ? '$' : (store.settings?.currency === 'EUR' ? '€' : '')}
                    {order.totalPrice.toFixed(2)}
                  </td>
                  <td className="py-3 px-4">
                    {order.isPaid ? (
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">Yes</span>
                    ) : (
                      <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">No</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    {order.isDelivered ? (
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">Yes</span>
                    ) : (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">Pending</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
