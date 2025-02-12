import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import api from "../../../api";
import { motion } from 'framer-motion';
import { ArrowUpRight, ShoppingCart, Wallet, Package } from 'lucide-react';

const AnalyticsDashboard = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [cartData, setCartData] = useState([]);
  const [orderData, setOrderData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // New state for chart type selection
  const [cartChartType, setCartChartType] = useState('line');
  const [orderChartType, setOrderChartType] = useState('line');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cartRes, orderRes] = await Promise.all([
          api.get(`/api/analytics/cart-activity?timeframe=${timeRange}`),
          api.get(`/api/analytics/order-activity?timeframe=${timeRange}`)
        ]);
        console.log(cartRes.data); // Check the format of the dates in cartRes.data
        console.log(orderRes.data); // Check the format of the dates in orderRes.data
        setCartData(cartRes.data);
        setOrderData(orderRes.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching analytics:', err);
        setLoading(false);
      }
    };
    fetchData();
  }, [timeRange]);

  const calculateTotals = () => {
    return {
      totalOrders: orderData.reduce((sum, d) => sum + d.orderCount, 0),
      totalRevenue: orderData.reduce((sum, d) => sum + d.totalRevenue, 0),
      totalCartAdds: cartData.reduce((sum, d) => sum + d.addToCartCount, 0),
      totalItems: cartData.reduce((sum, d) => sum + d.totalQuantity, 0)
    };
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(); // e.g. "MM/DD/YYYY"
  };

  const totals = calculateTotals();

  // Render function for Cart Activity chart based on chart type
  const renderCartChart = () => {
    switch(cartChartType) {
      case 'line':
        return (
          <LineChart data={cartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="date"
              stroke="#9CA3AF"
              tickFormatter={formatDate}
            />
            <YAxis stroke="#9CA3AF" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
              labelFormatter={formatDate}
            />
            <Line 
              type="monotone" 
              dataKey="addToCartCount" 
              stroke="#8B5CF6" 
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        );
      case 'area':
        return (
          <AreaChart data={cartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="date"
              stroke="#9CA3AF"
              tickFormatter={formatDate}
            />
            <YAxis stroke="#9CA3AF" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
              labelFormatter={formatDate}
            />
            <Area 
              type="monotone" 
              dataKey="addToCartCount" 
              stroke="#8B5CF6" 
              fill="#8B5CF6" 
            />
          </AreaChart>
        );
      case 'bar':
        return (
          <BarChart data={cartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="date"
              stroke="#9CA3AF"
              tickFormatter={formatDate}
            />
            <YAxis stroke="#9CA3AF" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
              labelFormatter={formatDate}
            />
            <Bar 
              dataKey="addToCartCount" 
              fill="#8B5CF6" 
            />
          </BarChart>
        );
      default:
        return null;
    }
  };

  // Render function for Revenue Trend chart based on chart type
  const renderOrderChart = () => {
    switch(orderChartType) {
      case 'line':
        return (
          <LineChart data={orderData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="date"
              stroke="#9CA3AF"
              tickFormatter={formatDate}
            />
            <YAxis stroke="#9CA3AF" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
              labelFormatter={formatDate}
            />
            <Line 
              type="monotone" 
              dataKey="totalRevenue" 
              stroke="#10B981" 
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        );
      case 'area':
        return (
          <AreaChart data={orderData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="date"
              stroke="#9CA3AF"
              tickFormatter={formatDate}
            />
            <YAxis stroke="#9CA3AF" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
              labelFormatter={formatDate}
            />
            <Area 
              type="monotone" 
              dataKey="totalRevenue" 
              stroke="#10B981" 
              fill="#10B981" 
            />
          </AreaChart>
        );
      case 'bar':
        return (
          <BarChart data={orderData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="date"
              stroke="#9CA3AF"
              tickFormatter={formatDate}
            />
            <YAxis stroke="#9CA3AF" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
              labelFormatter={formatDate}
            />
            <Bar 
              dataKey="totalRevenue" 
              fill="#10B981" 
            />
          </BarChart>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-8 text-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Business Analytics
          </h1>
          <select 
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-gray-700 rounded-lg px-4 py-2 border border-gray-600"
          >
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
          </select>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-500/20 rounded-lg">
                    <ShoppingCart className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-gray-400">Cart Adds</p>
                    <p className="text-2xl font-bold">{totals.totalCartAdds}</p>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-cyan-500/20 rounded-lg">
                    <Package className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div>
                    <p className="text-gray-400">Items Added</p>
                    <p className="text-2xl font-bold">{totals.totalItems}</p>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-500/20 rounded-lg">
                    <Wallet className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <p className="text-gray-400">Total Revenue</p>
                    <p className="text-2xl font-bold">${totals.totalRevenue.toFixed(2)}</p>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-pink-500/20 rounded-lg">
                    <ArrowUpRight className="w-6 h-6 text-pink-400" />
                  </div>
                  <div>
                    <p className="text-gray-400">Total Orders</p>
                    <p className="text-2xl font-bold">{totals.totalOrders}</p>
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Cart Activity Chart Panel */}
              <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700">
                <h3 className="text-xl font-semibold mb-4">Cart Activity</h3>
                {/* Chart Tabs */}
                <div className="flex space-x-2 mb-4">
                  <button
                    className={`px-3 py-1 rounded ${
                      cartChartType === 'line' ? 'bg-purple-600' : 'bg-gray-700'
                    }`}
                    onClick={() => setCartChartType('line')}
                  >
                    Line
                  </button>
                  <button
                    className={`px-3 py-1 rounded ${
                      cartChartType === 'area' ? 'bg-purple-600' : 'bg-gray-700'
                    }`}
                    onClick={() => setCartChartType('area')}
                  >
                    Area
                  </button>
                  <button
                    className={`px-3 py-1 rounded ${
                      cartChartType === 'bar' ? 'bg-purple-600' : 'bg-gray-700'
                    }`}
                    onClick={() => setCartChartType('bar')}
                  >
                    Bar
                  </button>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    {renderCartChart()}
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Revenue Trend Chart Panel */}
              <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700">
                <h3 className="text-xl font-semibold mb-4">Revenue Trend</h3>
                {/* Chart Tabs */}
                <div className="flex space-x-2 mb-4">
                  <button
                    className={`px-3 py-1 rounded ${
                      orderChartType === 'line' ? 'bg-green-600' : 'bg-gray-700'
                    }`}
                    onClick={() => setOrderChartType('line')}
                  >
                    Line
                  </button>
                  <button
                    className={`px-3 py-1 rounded ${
                      orderChartType === 'area' ? 'bg-green-600' : 'bg-gray-700'
                    }`}
                    onClick={() => setOrderChartType('area')}
                  >
                    Area
                  </button>
                  <button
                    className={`px-3 py-1 rounded ${
                      orderChartType === 'bar' ? 'bg-green-600' : 'bg-gray-700'
                    }`}
                    onClick={() => setOrderChartType('bar')}
                  >
                    Bar
                  </button>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    {renderOrderChart()}
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
