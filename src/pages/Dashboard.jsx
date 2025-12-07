import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import PinMatcher from '../components/citizen/PinMatcher';
import { User, LogOut, FileText } from 'lucide-react';
import ComplaintForm from '../components/citizen/ComplaintForm';
import { getGrievances, getStats } from '../services/api';

import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.jpg';

const Dashboard = () => {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();
    const [constituency, setConstituency] = useState(null);
    const [stats, setStats] = useState({ active: 0, resolved: 0 });
    const [loadingStats, setLoadingStats] = useState(false);

    // Redirect if not logged in
    React.useEffect(() => {
        if (!currentUser) {
            navigate('/');
        }
    }, [currentUser, navigate]);

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/');
        } catch (error) {
            console.error("Failed to log out", error);
        }
    };

    const fetchStats = async () => {
        if (!constituency || !constituency.pincode) return;

        if (stats.active === 0 && stats.resolved === 0) setLoadingStats(true);

        try {
            console.log("Fetching stats for pincode:", constituency.pincode);
            const data = await getStats(constituency.pincode);
            setStats({ active: data.active, resolved: data.resolved });
        } catch (e) {
            console.error("Stats error", e);
        } finally {
            setLoadingStats(false);
        }
    };

    React.useEffect(() => {
        fetchStats();
    }, [constituency]);

    return (
        <div className="container" style={{ padding: '2rem 1rem' }}>
            <header style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '2rem',
                paddingBottom: '1rem',
                borderBottom: '1px solid var(--border)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <img src={logo} alt="Jansamvaad" style={{ height: '120px', borderRadius: '4px' }} />
                    <div>
                        <h1 style={{ fontSize: '1.5rem' }}>Namaste, Citizen</h1>
                        <p style={{ color: 'var(--text-muted)' }}>{currentUser?.email}</p>
                    </div>
                </div>
                <button onClick={handleLogout} className="btn btn-outline" style={{ fontSize: '0.875rem' }}>
                    <LogOut size={16} /> Logout
                </button>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>

                {/* Left Column: Info & Stats */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                    {/* Constituency Card */}
                    {!constituency ? (
                        <PinMatcher onMatch={setConstituency} />
                    ) : (
                        <div className="card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <h3 style={{ marginBottom: '1rem' }}>Your Representatives</h3>
                                <button onClick={() => setConstituency(null)} style={{ color: 'var(--primary)', fontSize: '0.75rem' }}>Change</button>
                            </div>
                            <div style={{ marginBottom: '1rem' }}>
                                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Constituency</p>
                                <p style={{ fontWeight: 600 }}>{constituency.area}</p>
                            </div>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <div>
                                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>MLA</p>
                                    <p style={{ fontWeight: 600 }}>{constituency.mla}</p>
                                </div>
                                <div>
                                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>MP</p>
                                    <p style={{ fontWeight: 600 }}>{constituency.mp}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Stats */}
                    <div className="card">
                        <h3>Your Constituency Activity</h3>
                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                            <div style={{ textAlign: 'center', flex: 1 }}>
                                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary)' }}>
                                    {loadingStats ? '-' : stats.active}
                                </div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Active</div>
                            </div>
                            <div style={{ textAlign: 'center', flex: 1 }}>
                                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--success)' }}>
                                    {loadingStats ? '-' : stats.resolved}
                                </div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Resolved</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Complaint Form */}
                <div>
                    <ComplaintForm
                        constituency={constituency}
                        onGrievanceSubmitted={fetchStats}
                    />
                    {!constituency && (
                        <div className="card" style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px', borderStyle: 'dashed' }}>
                            <p style={{ color: 'var(--text-muted)' }}>
                                Please locate your constituency to file a grievance.
                            </p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default Dashboard;
