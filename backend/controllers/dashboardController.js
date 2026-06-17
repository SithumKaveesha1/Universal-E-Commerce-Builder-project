import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';

// @desc    Get dashboard statistics for a store
// @route   GET /api/dashboard/stats
// @access  Private (Admin)
export const getDashboardStats = async (req, res) => {
  try {
    const storeId = req.user.storeId;

    // Total Orders for this store
    const totalOrders = await Order.countDocuments({ storeId });

    // Total Products in this store
    const totalProducts = await Product.countDocuments({ storeId });

    // Total Revenue (only paid orders)
    const paidOrders = await Order.find({ storeId, isPaid: true });
    const totalRevenue = paidOrders.reduce((acc, order) => acc + order.totalPrice, 0);

    // Total Users (customers who have placed an order in this store)
    const distinctUsers = await Order.distinct('user', { storeId });
    const totalCustomers = distinctUsers.length;

    // Monthly Revenue for chart (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const recentOrders = await Order.find({ 
      storeId, 
      isPaid: true,
      createdAt: { $gte: sixMonthsAgo } 
    }).sort('createdAt');

    // Group by month
    const monthlyRevenueMap = {};
    recentOrders.forEach(order => {
      const month = order.createdAt.toLocaleString('default', { month: 'short' });
      monthlyRevenueMap[month] = (monthlyRevenueMap[month] || 0) + order.totalPrice;
    });

    const revenueChartData = Object.keys(monthlyRevenueMap).map(month => ({
      name: month,
      revenue: monthlyRevenueMap[month]
    }));

    res.json({
      totalOrders,
      totalProducts,
      totalRevenue,
      totalCustomers,
      revenueChartData
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
