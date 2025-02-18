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

    // Additional states for reward redemption counts
    const [redemptionCounts, setRedemptionCounts] = useState([]);
    const [rewardList, setRewardList] = useState([]);

    // Chart type states
    const [cartChartType, setCartChartType] = useState('line');
    const [orderChartType, setOrderChartType] = useState('line');
    const [supportChartType, setSupportChartType] = useState('line');
    // Removed subscription chart type state
    const [rewardChartType, setRewardChartType] = useState('line');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const requestConfig = { headers: { Authorization: '' } };
                // Fetch all analytics plus the new redemption-counts & reward list
                const [
                    cartRes,
                    orderRes,
                    supportRes,
                    subscriptionRes,
                    rewardRes,
                    redemptionCountsRes,
                    rewardsListRes
                ] = await Promise.all([
                    api.get(`/api/analytics/cart-activity?timeframe=${timeRange}`, requestConfig),
                    api.get(`/api/analytics/order-activity?timeframe=${timeRange}`, requestConfig),
                    api.get(`/api/analytics/support-activity?timeframe=${timeRange}`, requestConfig),
                    api.get(`/api/analytics/subscription-activity?timeframe=${timeRange}`, requestConfig),
                    api.get(`/api/analytics/reward-redemption-activity?timeframe=${timeRange}`, requestConfig),
                    api.get('/api/Rewards/redemption-counts'),
                    api.get('/api/Rewards')
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

                // Save redemption counts and reward info
                setRedemptionCounts(redemptionCountsRes.data);
                setRewardList(rewardsListRes.data);

                setLoading(false);
            } catch (err) {
                console.error('Error fetching analytics:', err);
                setLoading(false);
            }
        };
        fetchData();
    }, [timeRange]);

    // Basic calculations for Orders & Carts
    const calculateOrderInsights = () => ({
        totalOrders: orderData.reduce((sum, d) => sum + d.orderCount, 0),
        totalRevenue: orderData.reduce((sum, d) => sum + d.totalRevenue, 0),
        totalCartAdds: cartData.reduce((sum, d) => sum + d.addToCartCount, 0),
        totalItems: cartData.reduce((sum, d) => sum + d.totalQuantity, 0)
    });

    // Basic calculations for Engagement
    const calculateEngagementInsights = () => ({
        totalSubscriptions: subscriptionData.reduce((sum, d) => sum + d.subscriptionEventCount, 0),
        totalTickets: supportData.reduce((sum, d) => sum + d.supportTicketEventCount, 0),
        totalRedemptions: rewardData.reduce((sum, d) => sum + d.redemptionEventCount, 0),
        resolvedTickets: supportData.reduce((sum, d) => sum + (d.resolvedTickets || 0), 0),
        cancelledSubscriptions: subscriptionData.reduce((sum, d) => sum + (d.cancellations || 0), 0),
        renewedSubscriptions: subscriptionData.reduce((sum, d) => sum + (d.renewals || 0), 0)
    });

    // Identify the top redeemed reward from redemptionCounts
    const getTopRedeemedReward = () => {
        if (!redemptionCounts.length || !rewardList.length) return null;

        // Find the highest redemptionCount
        let maxItem = redemptionCounts[0];
        redemptionCounts.forEach(item => {
            if (item.redemptionCount > maxItem.redemptionCount) {
                maxItem = item;
            }
        });

        // Match it to the reward info by comparing RewardId (capital "R")
        const topReward = rewardList.find(r => r.rewardId === maxItem.rewardId);

        if (!topReward) return null;

        // Use 'Name' instead of 'rewardName' to match your C# model's property
        return {
            name: topReward.name || topReward.Name || "Unknown Reward",
            count: maxItem.redemptionCount
        };
    };


    // Chart type toggle component
    const ChartTypeToggle = ({ currentType, setType }) => (
        <div className="flex gap-1 p-1 bg-[#355e3b] rounded-lg">
            {chartTypes.map(type => (
                <button
                    key={type}
                    onClick={() => setType(type)}
                    className={`p-2 rounded-md ${currentType === type ? 'bg-[#355e3b] text-white' : 'hover:bg-[#355e3b] hover:text-white'
                        }`}
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

    // Renders for the various chart types
    const renderCartChart = () => {
        switch (cartChartType) {
            case 'line':
                return (
                    <LineChart data={cartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e0" />
                        <XAxis dataKey="date" stroke="#355e3b" tickFormatter={formatDate} />
                        <YAxis stroke="#355e3b" />
                        <Tooltip contentStyle={{ backgroundColor: '#fff', border: 'none' }} labelFormatter={formatDate} />
                        <Line type="monotone" dataKey="addToCartCount" stroke="#8B5CF6" strokeWidth={2} dot={false} />
                    </LineChart>
                );
            case 'area':
                return (
                    <AreaChart data={cartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e0" />
                        <XAxis dataKey="date" stroke="#355e3b" tickFormatter={formatDate} />
                        <YAxis stroke="#355e3b" />
                        <Tooltip contentStyle={{ backgroundColor: '#fff', border: 'none' }} labelFormatter={formatDate} />
                        <Area type="monotone" dataKey="addToCartCount" stroke="#8B5CF6" fill="#8B5CF6" />
                    </AreaChart>
                );
            case 'bar':
                return (
                    <BarChart data={cartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e0" />
                        <XAxis dataKey="date" stroke="#355e3b" tickFormatter={formatDate} />
                        <YAxis stroke="#355e3b" />
                        <Tooltip contentStyle={{ backgroundColor: '#fff', border: 'none' }} labelFormatter={formatDate} />
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
                        <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e0" />
                        <XAxis dataKey="date" stroke="#355e3b" tickFormatter={formatDate} />
                        <YAxis stroke="#355e3b" />
                        <Tooltip contentStyle={{ backgroundColor: '#fff', border: 'none' }} labelFormatter={formatDate} />
                        <Line type="monotone" dataKey="totalRevenue" stroke="#10B981" strokeWidth={2} dot={false} />
                    </LineChart>
                );
            case 'area':
                return (
                    <AreaChart data={orderData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e0" />
                        <XAxis dataKey="date" stroke="#355e3b" tickFormatter={formatDate} />
                        <YAxis stroke="#355e3b" />
                        <Tooltip contentStyle={{ backgroundColor: '#fff', border: 'none' }} labelFormatter={formatDate} />
                        <Area type="monotone" dataKey="totalRevenue" stroke="#10B981" fill="#10B981" />
                    </AreaChart>
                );
            case 'bar':
                return (
                    <BarChart data={orderData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e0" />
                        <XAxis dataKey="date" stroke="#355e3b" tickFormatter={formatDate} />
                        <YAxis stroke="#355e3b" />
                        <Tooltip contentStyle={{ backgroundColor: '#fff', border: 'none' }} labelFormatter={formatDate} />
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
                        <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e0" />
                        <XAxis dataKey="date" stroke="#355e3b" tickFormatter={formatDate} />
                        <YAxis stroke="#355e3b" />
                        <Tooltip contentStyle={{ backgroundColor: '#fff', border: 'none' }} labelFormatter={formatDate} />
                        <Line type="monotone" dataKey="supportTicketEventCount" stroke="#F59E0B" strokeWidth={2} dot={false} />
                    </LineChart>
                );
            case 'area':
                return (
                    <AreaChart data={supportData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e0" />
                        <XAxis dataKey="date" stroke="#355e3b" tickFormatter={formatDate} />
                        <YAxis stroke="#355e3b" />
                        <Tooltip contentStyle={{ backgroundColor: '#fff', border: 'none' }} labelFormatter={formatDate} />
                        <Area type="monotone" dataKey="supportTicketEventCount" stroke="#F59E0B" fill="#F59E0B" />
                    </AreaChart>
                );
            case 'bar':
                return (
                    <BarChart data={supportData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e0" />
                        <XAxis dataKey="date" stroke="#355e3b" tickFormatter={formatDate} />
                        <YAxis stroke="#355e3b" />
                        <Tooltip contentStyle={{ backgroundColor: '#fff', border: 'none' }} labelFormatter={formatDate} />
                        <Bar dataKey="supportTicketEventCount" fill="#F59E0B" />
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
                        <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e0" />
                        <XAxis dataKey="date" stroke="#355e3b" tickFormatter={formatDate} />
                        <YAxis stroke="#355e3b" />
                        <Tooltip contentStyle={{ backgroundColor: '#fff', border: 'none' }} labelFormatter={formatDate} />
                        <Line type="monotone" dataKey="redemptionEventCount" stroke="#EF4444" strokeWidth={2} dot={false} />
                    </LineChart>
                );
            case 'area':
                return (
                    <AreaChart data={rewardData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e0" />
                        <XAxis dataKey="date" stroke="#355e3b" tickFormatter={formatDate} />
                        <YAxis stroke="#355e3b" />
                        <Tooltip contentStyle={{ backgroundColor: '#fff', border: 'none' }} labelFormatter={formatDate} />
                        <Area type="monotone" dataKey="redemptionEventCount" stroke="#EF4444" fill="#EF4444" />
                    </AreaChart>
                );
            case 'bar':
                return (
                    <BarChart data={rewardData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e0" />
                        <XAxis dataKey="date" stroke="#355e3b" tickFormatter={formatDate} />
                        <YAxis stroke="#355e3b" />
                        <Tooltip contentStyle={{ backgroundColor: '#fff', border: 'none' }} labelFormatter={formatDate} />
                        <Bar dataKey="redemptionEventCount" fill="#EF4444" />
                    </BarChart>
                );
            default:
                return null;
        }
    };

    return (
        <div style={{ backgroundColor: '#F5F5DC' }} className="min-h-screen p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-[#355e3b] to-[#3A5F0B] bg-clip-text text-transparent mb-4 md:mb-0">
                        Analytics Dashboard
                    </h1>
                    <select
                        value={timeRange}
                        onChange={(e) => setTimeRange(e.target.value)}
                        className="bg-white rounded-lg px-4 py-2 border border-gray-300 text-gray-900"
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
                                ? 'bg-[#355e3b] text-white'
                                : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                            }`}
                    >
                        Orders & Carts
                    </button>
                    <button
                        onClick={() => setActiveTab('engagement')}
                        className={`px-6 py-2 rounded-xl ${activeTab === 'engagement'
                                ? 'bg-[#355e3b] text-white'
                                : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                            }`}
                    >
                        Engagement
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-96">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#355e3b]"></div>
                    </div>
                ) : (
                    <>
                        {activeTab === 'orders' ? (
                            <>
                                {/* Orders & Carts Insights */}
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        className="bg-white p-6 rounded-xl shadow border border-gray-300"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-[#355e3b]/20 rounded-lg">
                                                <ShoppingCart className="w-6 h-6 text-[#355e3b]" />
                                            </div>
                                            <div>
                                                <p className="text-gray-800">Cart Adds</p>
                                                <p className="text-2xl font-bold text-indigo-600">
                                                    {calculateOrderInsights().totalCartAdds}
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>

                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        className="bg-white p-6 rounded-xl shadow border border-gray-300"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-[#355e3b]/20 rounded-lg">
                                                <Package className="w-6 h-6 text-[#355e3b]" />
                                            </div>
                                            <div>
                                                <p className="text-gray-800">Items Added</p>
                                                <p className="text-2xl font-bold text-teal-600">
                                                    {calculateOrderInsights().totalItems}
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>

                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        className="bg-white p-6 rounded-xl shadow border border-gray-300"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-[#355e3b]/20 rounded-lg">
                                                <Wallet className="w-6 h-6 text-[#355e3b]" />
                                            </div>
                                            <div>
                                                <p className="text-gray-800">Total Revenue</p>
                                                <p className="text-2xl font-bold text-green-700">
                                                    ${calculateOrderInsights().totalRevenue.toFixed(2)}
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>

                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        className="bg-white p-6 rounded-xl shadow border border-gray-300"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-[#355e3b]/20 rounded-lg">
                                                <ArrowUpRight className="w-6 h-6 text-[#355e3b]" />
                                            </div>
                                            <div>
                                                <p className="text-gray-800">Total Orders</p>
                                                <p className="text-2xl font-bold text-red-700">
                                                    {calculateOrderInsights().totalOrders}
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    <div className="bg-white p-6 rounded-xl shadow border border-gray-300">
                                        <h3 className="text-xl font-semibold text-gray-800 mb-4">
                                            Cart Activity
                                        </h3>
                                        <ChartTypeToggle
                                            currentType={cartChartType}
                                            setType={setCartChartType}
                                        />
                                        <div className="h-64 mt-4">
                                            <ResponsiveContainer width="100%" height="100%">
                                                {renderCartChart()}
                                            </ResponsiveContainer>
                                        </div>
                                    </div>

                                    <div className="bg-white p-6 rounded-xl shadow border border-gray-300">
                                        <h3 className="text-xl font-semibold text-gray-800 mb-4">
                                            Revenue Trend
                                        </h3>
                                        <ChartTypeToggle
                                            currentType={orderChartType}
                                            setType={setOrderChartType}
                                        />
                                        <div className="h-64 mt-4">
                                            <ResponsiveContainer width="100%" height="100%">
                                                {renderOrderChart()}
                                            </ResponsiveContainer>
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                {/* Engagement Insights */}
                                <div className="grid grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        className="bg-white p-6 rounded-xl shadow border border-gray-300"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-[#355e3b]/20 rounded-lg">
                                                <ClipboardList className="w-6 h-6 text-[#355e3b]" />
                                            </div>
                                            <div>
                                                <p className="text-gray-800">New Subs</p>
                                                <p className="text-2xl font-bold text-blue-600">
                                                    {calculateEngagementInsights().totalSubscriptions}
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>

                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        className="bg-white p-6 rounded-xl shadow border border-gray-300"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-[#355e3b]/20 rounded-lg">
                                                <Ticket className="w-6 h-6 text-[#355e3b]" />
                                            </div>
                                            <div>
                                                <p className="text-gray-800">Total Tickets</p>
                                                <p className="text-2xl font-bold text-yellow-600">
                                                    {calculateEngagementInsights().totalTickets}
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>

                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        className="bg-white p-6 rounded-xl shadow border border-gray-300"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-[#355e3b]/20 rounded-lg">
                                                <Gift className="w-6 h-6 text-[#355e3b]" />
                                            </div>
                                            <div>
                                                <p className="text-gray-800">Rewards Redeemed</p>
                                                <p className="text-2xl font-bold text-purple-600">
                                                    {calculateEngagementInsights().totalRedemptions}
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>

                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        className="bg-white p-6 rounded-xl shadow border border-gray-300"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-[#355e3b]/20 rounded-lg">
                                                <Users className="w-6 h-6 text-[#355e3b]" />
                                            </div>
                                            <div>
                                                <p className="text-gray-800">Resolved Tickets</p>
                                                <p className="text-2xl font-bold text-green-600">
                                                    {calculateEngagementInsights().resolvedTickets}
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>

                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        className="bg-white p-6 rounded-xl shadow border border-gray-300"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-[#355e3b]/20 rounded-lg">
                                                <Wallet className="w-6 h-6 text-[#355e3b]" />
                                            </div>
                                            <div>
                                                <p className="text-gray-800">Subs Renewed</p>
                                                <p className="text-2xl font-bold text-teal-600">
                                                    {calculateEngagementInsights().renewedSubscriptions}
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>

                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        className="bg-white p-6 rounded-xl shadow border border-gray-300"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-[#355e3b]/20 rounded-lg">
                                                <ArrowUpRight className="w-6 h-6 text-[#355e3b]" />
                                            </div>
                                            <div>
                                                <p className="text-gray-800">Subs Cancelled</p>
                                                <p className="text-2xl font-bold text-red-600">
                                                    {calculateEngagementInsights().cancelledSubscriptions}
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    <div className="bg-white p-6 rounded-xl shadow border border-gray-300">
                                        <h3 className="text-xl font-semibold text-gray-800 mb-4">
                                            Support Tickets
                                        </h3>
                                        <ChartTypeToggle
                                            currentType={supportChartType}
                                            setType={setSupportChartType}
                                        />
                                        <div className="h-64 mt-4">
                                            <ResponsiveContainer width="100%" height="100%">
                                                {renderSupportChart()}
                                            </ResponsiveContainer>
                                        </div>
                                    </div>

                                    <div className="bg-white p-6 rounded-xl shadow border border-gray-300">
                                        <h3 className="text-xl font-semibold text-gray-800 mb-4">
                                            Reward Redemptions
                                        </h3>
                                        <ChartTypeToggle
                                            currentType={rewardChartType}
                                            setType={setRewardChartType}
                                        />
                                        <div className="h-64 mt-4">
                                            <ResponsiveContainer width="100%" height="100%">
                                                {renderRewardChart()}
                                            </ResponsiveContainer>
                                        </div>
                                    </div>
                                </div>

                                {/* Reward Insights Section */}
                                <div className="mt-8">
                                    <div className="bg-white p-6 rounded-xl shadow border border-gray-300">
                                        <h3 className="text-xl font-semibold text-gray-800 mb-4">
                                            Reward Insights
                                        </h3>
                                        {getTopRedeemedReward() ? (
                                            <p className="text-gray-800">
                                                {`${getTopRedeemedReward().count} people redeemed the ${getTopRedeemedReward().name
                                                    } in the last ${timeRange}`}
                                            </p>
                                        ) : (
                                            <p className="text-gray-800">
                                                No redemption data available.
                                            </p>
                                        )}
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
