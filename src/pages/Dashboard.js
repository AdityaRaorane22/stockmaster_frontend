import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { FaArrowUp, FaArrowDown, FaBoxOpen, FaExclamationTriangle } from 'react-icons/fa';
import axios from 'axios';

const StatCard = ({ title, value, subtext, icon, color }) => (
    <div className="card" style={{ position: 'relative', overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
            <div>
                <h3 style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>{title}</h3>
                <p style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--text-main)' }}>{value}</p>
                <p style={{ fontSize: '0.875rem', color: color, display: 'flex', alignItems: 'center', gap: '4px', marginTop: '0.5rem' }}>
                    {subtext}
                </p>
            </div>
            <div style={{
                background: `${color}20`,
                padding: '12px',
                borderRadius: '12px',
                color: color
            }}>
                {icon}
            </div>
        </div>
    </div>
);

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalStockValue: 0,
        lowStockCount: 0,
        pendingReceipts: 0,
        pendingDeliveries: 0,
        recentActivity: [],
        chartData: []
    });

    useEffect(() => {
        fetchStats();
    }, []);


    const fetchStats = async () => {
        try {
            const res = await axios.get('http://localhost:5001/api/dashboard/stats');
            setStats(res.data);
        } catch (err) {
            console.error("Error fetching stats:", err);
        }
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'INR' }).format(value);
    };

    return (
        <div>
            <div className="header">
                <div>
                    <h1>Dashboard</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Overview of your inventory performance.</p>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <StatCard
                    title="Total Stock Value"
                    value={formatCurrency(stats.totalStockValue)}
                    subtext={<><FaArrowUp /> Real-time valuation</>}
                    icon={<FaBoxOpen size={24} />}
                    color="var(--primary)"
                />
                <StatCard
                    title="Total Products"
                    value={stats.totalProducts || 0}
                    subtext="Unique items in stock"
                    icon={<FaBoxOpen size={24} />}
                    color="var(--primary)"
                />
                <StatCard
                    title="Low Stock Items"
                    value={stats.lowStockCount}
                    subtext={<><FaExclamationTriangle /> Requires attention</>}
                    icon={<FaExclamationTriangle size={24} />}
                    color="var(--warning)"
                />
                <StatCard
                    title="Late Operations"
                    value={stats.lateOps || 0}
                    subtext={<><FaExclamationTriangle /> Overdue items</>}
                    icon={<FaExclamationTriangle size={24} />}
                    color="var(--danger)"
                />
                <StatCard
                    title="Waiting Operations"
                    value={stats.waitingOps || 0}
                    subtext="Blocked by stock"
                    icon={<FaExclamationTriangle size={24} />}
                    color="var(--warning)"
                />
                <StatCard
                    title="Active Operations"
                    value={(stats.pendingReceipts + stats.pendingDeliveries) || 0}
                    subtext="Receipts & Deliveries"
                    icon={<FaArrowUp size={24} />}
                    color="var(--secondary)"
                />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
                <div className="card" style={{ height: '400px' }}>
                    <h3 style={{ marginBottom: '1.5rem' }}>Stock Movement 2025</h3>
                    {stats.chartData && stats.chartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={stats.chartData}>
                                <defs>
                                    <linearGradient id="colorIn" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                                <XAxis dataKey="name" stroke="var(--text-muted)" />
                                <YAxis stroke="var(--text-muted)" />
                                <Tooltip
                                    contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px' }}
                                    itemStyle={{ color: 'var(--text-main)' }}
                                />
                                <Area type="monotone" dataKey="in" stroke="var(--primary)" fillOpacity={1} fill="url(#colorIn)" name="Inbound" />
                                <Area type="monotone" dataKey="out" stroke="var(--secondary)" fillOpacity={0.3} fill="var(--secondary)" name="Outbound" />
                            </AreaChart>
                        </ResponsiveContainer>
                    ) : (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)' }}>
                            No stock movement data available
                        </div>
                    )}
                </div>

                <div className="card">
                    <h3 style={{ marginBottom: '1.5rem' }}>Recent Activity</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {stats.recentActivity.length === 0 ? (
                            <p style={{ color: 'var(--text-muted)' }}>No recent activity.</p>
                        ) : (
                            stats.recentActivity.map((move) => (
                                <div key={move._id} style={{ display: 'flex', gap: '1rem', alignItems: 'center', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: move.quantity > 0 ? 'var(--success)' : 'var(--danger)' }}></div>
                                    <div>
                                        <p style={{ fontSize: '0.9rem', fontWeight: '500' }}>
                                            {move.quantity > 0 ? 'Received' : 'Shipped'} {Math.abs(move.quantity)} {move.product?.name}
                                        </p>
                                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                            {new Date(move.date).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
