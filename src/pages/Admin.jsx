import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getGrievances, resolveGrievance } from '../services/api';
import { LayoutDashboard, CheckCircle2, Clock, MessageSquare, ExternalLink, Sparkles } from 'lucide-react';
import { generateDraftResponse } from '../services/openai';

import logo from '../assets/logo.jpg';

const Admin = () => {
    const navigate = useNavigate();
    const logout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        navigate('/admin/login');
    };
    const [grievances, setGrievances] = useState([]);
    const [selectedGrievance, setSelectedGrievance] = useState(null);
    const [draftRequest, setDraftRequest] = useState(false);
    const [draftResponse, setDraftResponse] = useState('');

    useEffect(() => {
        const fetchGrievances = async () => {
            try {
                const data = await getGrievances();
                setGrievances(data);
            } catch (error) {
                console.error("Failed to load grievances", error);
            }
        };
        fetchGrievances();
    }, []);

    const handleGenerateDraft = async () => {
        if (!selectedGrievance) return;
        setDraftRequest(true);
        try {
            const draft = await generateDraftResponse(selectedGrievance.description, selectedGrievance.category);
            setDraftResponse(draft);
        } catch (error) {
            console.error(error);
        } finally {
            setDraftRequest(false);
        }
    };

    const handleResolve = async () => {
        if (!selectedGrievance) return;
        try {
            const updatedGrievance = await resolveGrievance(selectedGrievance._id || selectedGrievance.id);
            setGrievances(prev => prev.map(g => g._id === updatedGrievance._id ? updatedGrievance : g));
            setSelectedGrievance(updatedGrievance);
        } catch (error) {
            console.error("Failed to resolve grievance", error);
            alert("Failed to resolve grievance");
        }
    };
    return (
        <div className="container" style={{ padding: '2rem', display: 'grid', gridTemplateColumns: '300px 1fr', gap: '2rem', height: '100vh', overflow: 'hidden' }}>
            {/* Sidebar List */}
            <div style={{ borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
                <header style={{ paddingBottom: '1rem', borderBottom: '1px solid var(--border)', marginBottom: '1rem', textAlign: 'center' }}>
                    <img src={logo} alt="Jansamvaad" style={{ height: '120px', marginBottom: '0.5rem', borderRadius: '4px' }} />
                    <h2>Admin Panel</h2>
                    <br />
                    <button onClick={logout} className="btn btn-outline" style={{ width: '100%' }}>Logout</button>
                </header>
                <div className="custom-scrollbar" style={{ overflowY: 'auto', flex: 1, paddingRight: '1rem' }}>
                    {grievances
                        .sort((a, b) => {
                            if (a.status === 'Resolved' && b.status !== 'Resolved') return 1;
                            if (a.status !== 'Resolved' && b.status === 'Resolved') return -1;
                            return new Date(b.createdAt) - new Date(a.createdAt);
                        })
                        .map(g => (
                            <div
                                key={g.id || g._id}
                                onClick={() => setSelectedGrievance(g)}
                                style={{
                                    padding: '1rem',
                                    border: '1px solid var(--border)',
                                    borderRadius: 'var(--radius-md)',
                                    marginBottom: '1rem',
                                    cursor: 'pointer',
                                    backgroundColor: (selectedGrievance?.id === g.id || selectedGrievance?._id === g._id)
                                        ? 'var(--background)'
                                        : (g.status === 'Resolved' ? '#f0fdf4' : 'transparent'), // Light green for resolved
                                    borderColor: (selectedGrievance?.id === g.id || selectedGrievance?._id === g._id)
                                        ? 'var(--primary)'
                                        : (g.status === 'Resolved' ? '#bbf7d0' : 'var(--border)'),
                                    opacity: g.status === 'Resolved' ? 0.8 : 1
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: g.status === 'Resolved' ? '#166534' : 'var(--primary)' }}>{g.category}</span>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                        {g.createdAt ? new Date(g.createdAt).toLocaleDateString() : 'N/A'}
                                    </span>
                                </div>
                                <p style={{ fontSize: '0.875rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textDecoration: g.status === 'Resolved' ? 'line-through' : 'none', color: g.status === 'Resolved' ? 'var(--text-muted)' : 'inherit' }}>{g.description}</p>
                            </div>
                        ))}
                </div>
            </div>

            {/* Main Content */}
            <div style={{ overflowY: 'auto', padding: '1rem' }}>
                {!selectedGrievance ? (
                    <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                        Select a grievance to view details
                    </div>
                ) : (
                    <div>
                        <header style={{ marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                <span className="btn" style={{ backgroundColor: selectedGrievance.status === 'Resolved' ? '#dcfce7' : '#e2e8f0', color: selectedGrievance.status === 'Resolved' ? '#166534' : 'inherit', fontSize: '0.75rem' }}>{selectedGrievance.status}</span>
                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                    <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>ID: {selectedGrievance.id || selectedGrievance._id}</span>
                                    {selectedGrievance.status !== 'Resolved' && (
                                        <button onClick={handleResolve} className="btn btn-primary" style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem' }}>
                                            <CheckCircle2 size={14} style={{ marginRight: '0.25rem' }} /> Mark Resolved
                                        </button>
                                    )}
                                </div>
                            </div>
                            <h3>{selectedGrievance.category}</h3>
                            <p style={{ marginTop: '1rem', lineHeight: 1.6 }}>{selectedGrievance.description}</p>

                            <div style={{ marginTop: '2rem', display: 'flex', gap: '2rem' }}>
                                <div>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Constituency</p>
                                    <p>{selectedGrievance.constituency?.area}</p>
                                </div>
                                {/* Attachments if any */}
                            </div>
                        </header>

                        <div>
                            <h4>Response</h4>
                            <div style={{ marginTop: '1rem' }}>
                                {draftResponse ? (
                                    <textarea
                                        rows={6}
                                        className="textarea"
                                        value={draftResponse}
                                        onChange={(e) => setDraftResponse(e.target.value)}
                                        style={{ width: '100%', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}
                                    />
                                ) : (
                                    <div style={{ padding: '2rem', border: '1px dashed var(--border)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                                        <p style={{ marginBottom: '1rem', color: 'var(--text-muted)' }}>No response drafted yet.</p>
                                        <button className="btn btn-primary" onClick={handleGenerateDraft} disabled={draftRequest}>
                                            {draftRequest ? 'Generating...' : <><Sparkles size={16} /> Generate AI Draft</>}
                                        </button>
                                    </div>
                                )}
                            </div>

                            {draftResponse && (
                                <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
                                    <button className="btn btn-primary">Send Response</button>
                                    <button className="btn btn-outline" onClick={() => setDraftResponse('')}>Discard</button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Admin;
