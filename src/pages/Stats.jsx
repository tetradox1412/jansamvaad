import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, PieChart, TrendingUp, ArrowLeft } from 'lucide-react';

const Stats = () => {
    // Mock Data for visualization
    const stats = [
        { label: 'Total Grievances', value: 1240, color: '#2563eb' },
        { label: 'Resolved', value: 856, color: '#10b981' },
        { label: 'Pending', value: 384, color: '#f59e0b' },
    ];

    const categories = [
        { name: 'Infrastructure', count: 450, percent: '36%' },
        { name: 'Water', count: 320, percent: '25%' },
        { name: 'Electricity', count: 210, percent: '17%' },
        { name: 'Sanitation', count: 180, percent: '14%' },
        { name: 'Other', count: 80, percent: '8%' },
    ];

    return (
        <div className="container" style={{ padding: '2rem' }}>
            <header style={{ marginBottom: '3rem' }}>
                <Link to="/" className="btn btn-outline" style={{ marginBottom: '1rem', display: 'inline-flex' }}>
                    <ArrowLeft size={16} /> Back to Home
                </Link>
                <h1>Public Transparency Dashboard</h1>
                <p style={{ color: 'var(--text-muted)' }}>Real-time insights into civic issues and resolution rates.</p>
            </header>

            {/* Top Stats Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                {stats.map(stat => (
                    <div key={stat.label} className="card" style={{ padding: '1.5rem', textAlign: 'center' }}>
                        <div style={{ fontSize: '2.5rem', fontWeight: 700, color: stat.color, marginBottom: '0.5rem' }}>
                            {stat.value}
                        </div>
                        <div style={{ color: 'var(--text-muted)', fontWeight: 500 }}>{stat.label}</div>
                    </div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>

                {/* Category Breakdown */}
                <div className="card">
                    <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <PieChart size={20} /> Issues by Category
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {categories.map(cat => (
                            <div key={cat.name}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem', fontSize: '0.875rem' }}>
                                    <span>{cat.name}</span>
                                    <span style={{ fontWeight: 600 }}>{cat.count}</span>
                                </div>
                                <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--background)', borderRadius: '4px', overflow: 'hidden' }}>
                                    <div style={{ width: cat.percent, height: '100%', backgroundColor: 'var(--primary)', borderRadius: '4px' }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Trend Mockup */}
                <div className="card">
                    <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <TrendingUp size={20} /> Resolution Trend (Last 7 Days)
                    </h3>
                    <div style={{ height: '200px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '10px', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
                        {[40, 60, 45, 80, 70, 90, 85].map((h, i) => (
                            <div key={i} style={{ width: '100%', height: `${h}%`, backgroundColor: 'var(--success)', opacity: 0.7, borderRadius: '4px 4px 0 0' }}></div>
                        ))}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                        <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Stats;
