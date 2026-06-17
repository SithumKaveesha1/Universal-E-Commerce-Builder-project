import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get('/orders/store');
      setOrders(data);
    } catch (error) {
      console.error('Error fetching admin orders', error);
    } finally {
      setLoading(false);
    }
  };

  const deliverOrder = async (id) => {
    try {
      await axios.put(`/orders/${id}/deliver`);
      fetchOrders(); // Refresh list
    } catch (error) {
      console.error('Error updating order', error);
    }
  };

  if (loading) return <div>Loading orders...</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h2 className="text-2xl font-bold mb-6">Manage Orders</h2>

      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50 border-b border-t text-sm uppercase text-gray-600">
            <th className="py-3 px-4">ID</th>
            <th className="py-3 px-4">User</th>
            <th className="py-3 px-4">Date</th>
            <th className="py-3 px-4">Total</th>
            <th className="py-3 px-4">Paid</th>
            <th className="py-3 px-4">Delivered</th>
            <th className="py-3 px-4">Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id} className="border-b text-sm">
              <td className="py-3 px-4 font-mono">{order._id.substring(0, 8)}...</td>
              <td className="py-3 px-4">{order.user?.name}</td>
              <td className="py-3 px-4">{new Date(order.createdAt).toLocaleDateString()}</td>
              <td className="py-3 px-4">${order.totalPrice.toFixed(2)}</td>
              <td className="py-3 px-4">
                {order.isPaid ? (
                  <span className="text-green-600 font-medium">Yes</span>
                ) : (
                  <span className="text-red-600">No</span>
                )}
              </td>
              <td className="py-3 px-4">
                {order.isDelivered ? (
                  <span className="text-green-600 font-medium">Yes</span>
                ) : (
                  <span className="text-red-600">No</span>
                )}
              </td>
              <td className="py-3 px-4">
                {!order.isDelivered && (
                  <button 
                    onClick={() => deliverOrder(order._id)}
                    className="px-3 py-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
                  >
                    Mark Delivered
                  </button>
                )}
              </td>
            </tr>
          ))}
          {orders.length === 0 && (
            <tr>
              <td colSpan="7" className="py-4 text-center text-gray-500">No orders found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Orders;
