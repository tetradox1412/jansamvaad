import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Loader2, KeyRound } from 'lucide-react';
import styles from './Login.module.css'; // Reusing Login styles for consistency

const AdminLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isRegister, setIsRegister] = useState(false); // Toggle for initial setup
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');

    const navigate = useNavigate();

    const API_URL = import.meta.env.DEV ? 'http://localhost:5000/api' : '/api';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        const endpoint = isRegister ? '/admin/register' : '/admin/login';

        try {
            const response = await fetch(`${API_URL}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Authentication failed');
            }

            if (isRegister) {
                setSuccess('Admin registered successfully! Please login.');
                setIsRegister(false);
            } else {
                // Login successful
                localStorage.setItem('adminToken', 'true'); // Simple flag for demo
                localStorage.setItem('adminUser', data.username);
                navigate('/admin');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container} style={{ background: '#f0f9ff' }}>
            <div className={styles.authCard}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Admin Portal</h1>
                    <p className={styles.subtitle}>
                        {isRegister ? 'Register new administrator.' : 'Secure access for officials only.'}
                    </p>
                </div>

                {error && <div className={styles.error}>{error}</div>}
                {success && <div className="alert alert-success" style={{ color: 'green', textAlign: 'center', marginBottom: '1rem' }}>{success}</div>}

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label>Username</label>
                        <div className={styles.inputWrapper}>
                            <KeyRound size={18} className={styles.icon} />
                            <input
                                type="text"
                                placeholder="admin_user"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Password</label>
                        <div className={styles.inputWrapper}>
                            <Lock size={18} className={styles.icon} />
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className={styles.submitBtn} disabled={loading} style={{ backgroundColor: '#0f172a' }}>
                        {loading ? <Loader2 className="animate-spin" /> : (isRegister ? 'Register Admin' : 'Login as Admin')}
                    </button>
                </form>

                <div className={styles.footer}>
                    <p>
                        <button
                            type="button"
                            className={styles.toggleBtn}
                            onClick={() => setIsRegister(!isRegister)}
                        >
                            {isRegister ? 'Back to Login' : 'Register New Admin'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
