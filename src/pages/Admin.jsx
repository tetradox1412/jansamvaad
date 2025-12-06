import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getGrievances } from '../services/api';
import { LayoutDashboard, CheckCircle2, Clock, MessageSquare, ExternalLink } from 'lucide-react';
import { generateDraftResponse } from '../services/openai';

const Admin = () => {
    const { logout } = useAuth();
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

    return (
        <div className="container" style={{ padding: '2rem', display: 'grid', gridTemplateColumns: '300px 1fr', gap: '2rem', height: '100vh', overflow: 'hidden' }}>
            {/* Sidebar List */}
            <div style={{ borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column' }}>
                <header style={{ paddingBottom: '1rem', borderBottom: '1px solid var(--border)', marginBottom: '1rem' }}>
                    <h2>Admin Panel</h2>
                    <br />
                    <button onClick={logout} className="btn btn-outline" style={{ width: '100%' }}>Logout</button>
                </header>
                <div style={{ overflowY: 'auto', flex: 1, paddingRight: '1rem' }}>
                    {grievances.map(g => (
                        <div
                            key={g.id}
                            onClick={() => setSelectedGrievance(g)}
                            style={{
                                padding: '1rem',
                                border: '1px solid var(--border)',
                                borderRadius: 'var(--radius-md)',
                                marginBottom: '1rem',
                                cursor: 'pointer',
                                backgroundColor: selectedGrievance?.id === g.id ? 'var(--background)' : 'transparent',
                                borderColor: selectedGrievance?.id === g.id ? 'var(--primary)' : 'var(--border)'
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--primary)' }}>{g.category}</span>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                    {g.createdAt?.toDate().toLocaleDateString()}
                                </span>
                            </div>
                            <p style={{ fontSize: '0.875rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{g.description}</p>
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
                                <span className="btn" style={{ backgroundColor: '#e2e8f0', fontSize: '0.75rem' }}>{selectedGrievance.status}</span>
                                <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>ID: {selectedGrievance.id}</span>
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

// Simple icon wrapper if needed, or import form lucide directly
import { Sparkles } from 'lucide-react';

export default Admin;
