import React, { useState } from 'react';
import { MapPin, CheckCircle, Search } from 'lucide-react';

import { getConstituencyDetails } from '../../services/openai';

const PinMatcher = ({ onMatch }) => {
    const [pin, setPin] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSearch = async (e) => {
        e.preventDefault();
        if (pin.length !== 6) {
            setError('Please enter a valid 6-digit PIN code.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const data = await getConstituencyDetails(pin);

            if (data.error) {
                setError(data.error); // Show the specific API error
            } else if (data.area === "Unknown" || data.mla === "Unknown") {
                setError('Could not find constituency details for this PIN.');
            } else {
                onMatch({ ...data, pincode: pin });
            }
        } catch (err) {
            console.error(err);
            setError('Failed to fetch details. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card">
            <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin size={20} className="text-primary" />
                Locate Your Constituency
            </h3>
            <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                    type="text"
                    placeholder="Enter PIN Code"
                    value={pin}
                    onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    style={{
                        flex: 1,
                        padding: '0.5rem',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border)'
                    }}
                />
                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? '...' : <Search size={18} />}
                </button>
            </form>
            {error && <p style={{ color: 'var(--error)', fontSize: '0.875rem', marginTop: '0.5rem' }}>{error}</p>}
        </div>
    );
};

export default PinMatcher;
