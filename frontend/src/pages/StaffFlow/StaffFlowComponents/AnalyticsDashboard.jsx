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
import {
    ArrowUpRight,
    ShoppingCart,
    Wallet,
    Package,
    Ticket,
    Gift,
    ClipboardList,
    Users,
    Clock,
    LineChartIcon,
    BarChart2,
    AreaChartIcon
} from 'lucide-react';

const chartTypes = ['line', 'area', 'bar'];
const chartIcons = {
    line: <LineChartIcon size={18} />,
    area: <AreaChartIcon size={18} />,
    bar: <BarChart2 size={18} />
};

const AnalyticsDashboard = () => {
    const [activeTab, setActiveTab] = useState('orders');
    const [timeRange, setTimeRange] = useState('7d');
    const [cartData, setCartData] = useState([]);
    const [orderData, setOrderData] = useState([]);
    const [supportData, setSupportData] = useState([]);
    const [subscriptionData, setSubscriptionData] = useState([]);
    const [rewardData, setRewardData] = useState([]);
    const [loading, setLoading] = useState(true);

    // Chart type states
    const [cartChartType, setCartChartType] = useState('line');
    const [orderChartType, setOrderChartType] = useState('line');
    const [supportChartType, setSupportChartType] = useState('line');
    const [subscriptionChartType, setSubscriptionChartType] = useState('line');
    const [rewardChartType, setRewardChartType] = useState('line');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const requestConfig = { headers: { Authorization: '' } };
                const [
                    cartRes,
                    orderRes,
                    supportRes,
                    subscriptionRes,
                    rewardRes
                ] = await Promise.all([
                    api.get(`/api/analytics/cart-activity?timeframe=${timeRange}`, requestConfig),
                    api.get(`/api/analytics/order-activity?timeframe=${timeRange}`, requestConfig),
                    api.get(`/api/analytics/support-activity?timeframe=${timeRange}`, requestConfig),
                    api.get(`/api/analytics/subscription-activity?timeframe=${timeRange}`, requestConfig),
                    api.get(`/api/analytics/reward-redemption-activity?timeframe=${timeRange}`, requestConfig)
                ]);

                const formatData = (data) =>
                    data.map(item => ({
                        ...item,
                        date: new Date(item.date).toISOString()
                    }));

                setCartData(formatData(cartRes.data));
                setOrderData(formatData(orderRes.data));
                setSupportData(formatData(supportRes.data));
                setSubscriptionData(formatData(subscriptionRes.data));
                setRewardData(formatData(rewardRes.data));
                setLoading(false);
            } catch (err) {
                console.error('Error fetching analytics:', err);
                setLoading(false);
            }
        };
        fetchData();
    }, [timeRange]);

    // Use camelCase keys matching the backend data
    const calculateOrderInsights = () => ({
        totalOrders: orderData.reduce((sum, d) => sum + d.orderCount, 0),
        totalRevenue: orderData.reduce((sum, d) => sum + d.totalRevenue, 0),
        totalCartAdds: cartData.reduce((sum, d) => sum + d.addToCartCount, 0),
        totalItems: cartData.reduce((sum, d) => sum + d.totalQuantity, 0)
    });

    const calculateEngagementInsights = () => ({
        totalSubscriptions: subscriptionData.reduce((sum, d) => sum + d.subscriptionEventCount, 0),
        totalTickets: supportData.reduce((sum, d) => sum + d.supportTicketEventCount, 0),
        totalRedemptions: rewardData.reduce((sum, d) => sum + d.redemptionEventCount, 0),
        resolvedTickets: supportData.reduce((sum, d) => sum + (d.resolvedTickets || 0), 0),
        cancelledSubscriptions: subscriptionData.reduce((sum, d) => sum + (d.cancellations || 0), 0),
        renewedSubscriptions: subscriptionData.reduce((sum, d) => sum + (d.renewals || 0), 0)
    });

    const ChartTypeToggle = ({ currentType, setType }) => (
        <div className="flex gap-1 p-1 bg-gray-700 rounded-lg">
            {chartTypes.map(type => (
                <button
                    key={type}
                    onClick={() => setType(type)}
                    className={`p-2 rounded-md ${currentType === type ? 'bg-gray-600' : 'hover:bg-gray-600'}`}
                >
                    {chartIcons[type]}
                </button>
            ))}
        </div>
    );

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });
    };

    const renderCartChart = () => {
        switch (cartChartType) {
            case 'line':
                return (
                    <LineChart data={cartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="date" stroke="#9CA3AF" tickFormatter={formatDate} />
                        <YAxis stroke="#9CA3AF" />
                        <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none' }} labelFormatter={formatDate} />
                        <Line type="monotone" dataKey="addToCartCount" stroke="#8B5CF6" strokeWidth={2} dot={false} />
                    </LineChart>
                );
            case 'area':
                return (
                    <AreaChart data={cartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="date" stroke="#9CA3AF" tickFormatter={formatDate} />
                        <YAxis stroke="#9CA3AF" />
                        <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none' }} labelFormatter={formatDate} />
                        <Area type="monotone" dataKey="addToCartCount" stroke="#8B5CF6" fill="#8B5CF6" />
                    </AreaChart>
                );
            case 'bar':
                return (
                    <BarChart data={cartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="date" stroke="#9CA3AF" tickFormatter={formatDate} />
                        <YAxis stroke="#9CA3AF" />
                        <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none' }} labelFormatter={formatDate} />
                        <Bar dataKey="addToCartCount" fill="#8B5CF6" />
                    </BarChart>
                );
            default:
                return null;
        }
    };

    const renderOrderChart = () => {
        switch (orderChartType) {
            case 'line':
                return (
                    <LineChart data={orderData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="date" stroke="#9CA3AF" tickFormatter={formatDate} />
                        <YAxis stroke="#9CA3AF" />
                        <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none' }} labelFormatter={formatDate} />
                        <Line type="monotone" dataKey="totalRevenue" stroke="#10B981" strokeWidth={2} dot={false} />
                    </LineChart>
                );
            case 'area':
                return (
                    <AreaChart data={orderData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="date" stroke="#9CA3AF" tickFormatter={formatDate} />
                        <YAxis stroke="#9CA3AF" />
                        <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none' }} labelFormatter={formatDate} />
                        <Area type="monotone" dataKey="totalRevenue" stroke="#10B981" fill="#10B981" />
                    </AreaChart>
                );
            case 'bar':
                return (
                    <BarChart data={orderData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="date" stroke="#9CA3AF" tickFormatter={formatDate} />
                        <YAxis stroke="#9CA3AF" />
                        <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none' }} labelFormatter={formatDate} />
                        <Bar dataKey="totalRevenue" fill="#10B981" />
                    </BarChart>
                );
            default:
                return null;
        }
    };

    const renderSupportChart = () => {
        switch (supportChartType) {
            case 'line':
                return (
                    <LineChart data={supportData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="date" stroke="#9CA3AF" tickFormatter={formatDate} />
                        <YAxis stroke="#9CA3AF" />
                        <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none' }} labelFormatter={formatDate} />
                        <Line type="monotone" dataKey="supportTicketEventCount" stroke="#F59E0B" strokeWidth={2} dot={false} />
                    </LineChart>
                );
            case 'area':
                return (
                    <AreaChart data={supportData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="date" stroke="#9CA3AF" tickFormatter={formatDate} />
                        <YAxis stroke="#9CA3AF" />
                        <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none' }} labelFormatter={formatDate} />
                        <Area type="monotone" dataKey="supportTicketEventCount" stroke="#F59E0B" fill="#F59E0B" />
                    </AreaChart>
                );
            case 'bar':
                return (
                    <BarChart data={supportData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="date" stroke="#9CA3AF" tickFormatter={formatDate} />
                        <YAxis stroke="#9CA3AF" />
                        <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none' }} labelFormatter={formatDate} />
                        <Bar dataKey="supportTicketEventCount" fill="#F59E0B" />
                    </BarChart>
                );
            default:
                return null;
        }
    };

    const renderSubscriptionChart = () => {
        switch (subscriptionChartType) {
            case 'line':
                return (
                    <LineChart data={subscriptionData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="date" stroke="#9CA3AF" tickFormatter={formatDate} />
                        <YAxis stroke="#9CA3AF" />
                        <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none' }} labelFormatter={formatDate} />
                        <Line type="monotone" dataKey="subscriptionEventCount" stroke="#3B82F6" strokeWidth={2} dot={false} />
                    </LineChart>
                );
            case 'area':
                return (
                    <AreaChart data={subscriptionData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="date" stroke="#9CA3AF" tickFormatter={formatDate} />
                        <YAxis stroke="#9CA3AF" />
                        <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none' }} labelFormatter={formatDate} />
                        <Area type="monotone" dataKey="subscriptionEventCount" stroke="#3B82F6" fill="#3B82F6" />
                    </AreaChart>
                );
            case 'bar':
                return (
                    <BarChart data={subscriptionData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="date" stroke="#9CA3AF" tickFormatter={formatDate} />
                        <YAxis stroke="#9CA3AF" />
                        <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none' }} labelFormatter={formatDate} />
                        <Bar dataKey="subscriptionEventCount" fill="#3B82F6" />
                    </BarChart>
                );
            default:
                return null;
        }
    };

    const renderRewardChart = () => {
        switch (rewardChartType) {
            case 'line':
                return (
                    <LineChart data={rewardData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="date" stroke="#9CA3AF" tickFormatter={formatDate} />
                        <YAxis stroke="#9CA3AF" />
                        <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none' }} labelFormatter={formatDate} />
                        <Line type="monotone" dataKey="redemptionEventCount" stroke="#EF4444" strokeWidth={2} dot={false} />
                    </LineChart>
                );
            case 'area':
                return (
                    <AreaChart data={rewardData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="date" stroke="#9CA3AF" tickFormatter={formatDate} />
                        <YAxis stroke="#9CA3AF" />
                        <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none' }} labelFormatter={formatDate} />
                        <Area type="monotone" dataKey="redemptionEventCount" stroke="#EF4444" fill="#EF4444" />
                    </AreaChart>
                );
            case 'bar':
                return (
                    <BarChart data={rewardData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="date" stroke="#9CA3AF" tickFormatter={formatDate} />
                        <YAxis stroke="#9CA3AF" />
                        <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none' }} labelFormatter={formatDate} />
                        <Bar dataKey="redemptionEventCount" fill="#EF4444" />
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
                        Analytics Dashboard
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

                <div className="flex gap-4 mb-8">
                    <button
                        onClick={() => setActiveTab('orders')}
                        className={`px-6 py-2 rounded-xl ${activeTab === 'orders'
                            ? 'bg-purple-600 hover:bg-purple-700'
                            : 'bg-gray-700 hover:bg-gray-600'
                            }`}
                    >
                        Orders & Carts
                    </button>
                    <button
                        onClick={() => setActiveTab('engagement')}
                        className={`px-6 py-2 rounded-xl ${activeTab === 'engagement'
                            ? 'bg-blue-600 hover:bg-blue-700'
                            : 'bg-gray-700 hover:bg-gray-600'
                            }`}
                    >
                        Engagement
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-96">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
                    </div>
                ) : (
                    <>
                        {activeTab === 'orders' ? (
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
                                                <p className="text-2xl font-bold">{calculateOrderInsights().totalCartAdds}</p>
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
                                                <p className="text-2xl font-bold">{calculateOrderInsights().totalItems}</p>
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
                                                <p className="text-2xl font-bold">${calculateOrderInsights().totalRevenue.toFixed(2)}</p>
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
                                                <p className="text-2xl font-bold">{calculateOrderInsights().totalOrders}</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700">
                                        <h3 className="text-xl font-semibold mb-4">Cart Activity</h3>
                                        <ChartTypeToggle currentType={cartChartType} setType={setCartChartType} />
                                        <div className="h-64">
                                            <ResponsiveContainer width="100%" height="100%">
                                                {renderCartChart()}
                                            </ResponsiveContainer>
                                        </div>
                                    </div>

                                    <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700">
                                        <h3 className="text-xl font-semibold mb-4">Revenue Trend</h3>
                                        <ChartTypeToggle currentType={orderChartType} setType={setOrderChartType} />
                                        <div className="h-64">
                                            <ResponsiveContainer width="100%" height="100%">
                                                {renderOrderChart()}
                                            </ResponsiveContainer>
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="grid grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-blue-500/20 rounded-lg">
                                                <ClipboardList className="w-6 h-6 text-blue-400" />
                                            </div>
                                            <div>
                                                <p className="text-gray-400">New Subs</p>
                                                <p className="text-2xl font-bold">{calculateEngagementInsights().totalSubscriptions}</p>
                                            </div>
                                        </div>
                                    </motion.div>

                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-yellow-500/20 rounded-lg">
                                                <Ticket className="w-6 h-6 text-yellow-400" />
                                            </div>
                                            <div>
                                                <p className="text-gray-400">Total Tickets</p>
                                                <p className="text-2xl font-bold">{calculateEngagementInsights().totalTickets}</p>
                                            </div>
                                        </div>
                                    </motion.div>

                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-red-500/20 rounded-lg">
                                                <Gift className="w-6 h-6 text-red-400" />
                                            </div>
                                            <div>
                                                <p className="text-gray-400">Rewards Redeemed</p>
                                                <p className="text-2xl font-bold">{calculateEngagementInsights().totalRedemptions}</p>
                                            </div>
                                        </div>
                                    </motion.div>

                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-green-500/20 rounded-lg">
                                                <Users className="w-6 h-6 text-green-400" />
                                            </div>
                                            <div>
                                                <p className="text-gray-400">Resolved Tickets</p>
                                                <p className="text-2xl font-bold">{calculateEngagementInsights().resolvedTickets}</p>
                                            </div>
                                        </div>
                                    </motion.div>

                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-orange-500/20 rounded-lg">
                                                <Wallet className="w-6 h-6 text-orange-400" />
                                            </div>
                                            <div>
                                                <p className="text-gray-400">Subs Renewed</p>
                                                <p className="text-2xl font-bold">{calculateEngagementInsights().renewedSubscriptions}</p>
                                            </div>
                                        </div>
                                    </motion.div>

                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-red-500/20 rounded-lg">
                                                <ArrowUpRight className="w-6 h-6 text-red-400" />
                                            </div>
                                            <div>
                                                <p className="text-gray-400">Subs Cancelled</p>
                                                <p className="text-2xl font-bold">{calculateEngagementInsights().cancelledSubscriptions}</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                    <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700">
                                        <h3 className="text-xl font-semibold mb-4">Subscriptions</h3>
                                        <ChartTypeToggle currentType={subscriptionChartType} setType={setSubscriptionChartType} />
                                        <div className="h-64">
                                            <ResponsiveContainer width="100%" height="100%">
                                                {renderSubscriptionChart()}
                                            </ResponsiveContainer>
                                        </div>
                                    </div>

                                    <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700">
                                        <h3 className="text-xl font-semibold mb-4">Support Tickets</h3>
                                        <ChartTypeToggle currentType={supportChartType} setType={setSupportChartType} />
                                        <div className="h-64">
                                            <ResponsiveContainer width="100%" height="100%">
                                                {renderSupportChart()}
                                            </ResponsiveContainer>
                                        </div>
                                    </div>

                                    <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700">
                                        <h3 className="text-xl font-semibold mb-4">Reward Redemptions</h3>
                                        <ChartTypeToggle currentType={rewardChartType} setType={setRewardChartType} />
                                        <div className="h-64">
                                            <ResponsiveContainer width="100%" height="100%">
                                                {renderRewardChart()}
                                            </ResponsiveContainer>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default AnalyticsDashboard;
