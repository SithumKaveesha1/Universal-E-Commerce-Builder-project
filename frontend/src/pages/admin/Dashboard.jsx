import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ShoppingBag, Users, DollarSign, Package } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axios.get('/dashboard/stats');
        setStats(data);
      } catch (error) {
        console.error('Error fetching dashboard stats', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div>Loading dashboard...</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm font-medium uppercase mb-1">Total Revenue</p>
            <h3 className="text-3xl font-bold text-gray-900">${stats?.totalRevenue.toFixed(2) || 0}</h3>
          </div>
          <div className="p-3 bg-green-100 text-green-600 rounded-full">
            <DollarSign size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm font-medium uppercase mb-1">Total Orders</p>
            <h3 className="text-3xl font-bold text-gray-900">{stats?.totalOrders || 0}</h3>
          </div>
          <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
            <ShoppingBag size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm font-medium uppercase mb-1">Products</p>
            <h3 className="text-3xl font-bold text-gray-900">{stats?.totalProducts || 0}</h3>
          </div>
          <div className="p-3 bg-purple-100 text-purple-600 rounded-full">
            <Package size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm font-medium uppercase mb-1">Customers</p>
            <h3 className="text-3xl font-bold text-gray-900">{stats?.totalCustomers || 0}</h3>
          </div>
          <div className="p-3 bg-orange-100 text-orange-600 rounded-full">
            <Users size={24} />
          </div>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-white p-6 rounded-lg shadow-sm border mb-8">
        <h3 className="text-lg font-bold mb-4 border-b pb-2">Revenue History</h3>
        {stats?.revenueChartData && stats.revenueChartData.length > 0 ? (
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={stats.revenueChartData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  activeDot={{ r: 8 }} 
                  name="Revenue"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-64 flex items-center justify-center text-gray-500">
            No revenue data available yet to display chart.
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
