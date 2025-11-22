import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaKey } from 'react-icons/fa';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5001/api/auth/forgot-password', { email });
            alert('OTP sent to your email (Check console for demo)');
            navigate('/reset-password', { state: { email } });
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to send OTP');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-left">
                <div style={{ textAlign: 'center', color: 'white', zIndex: 1 }}>
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <FaKey size={64} style={{ marginBottom: '1.5rem' }} />
                        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Recovery</h1>
                        <p style={{ fontSize: '1.25rem', opacity: 0.9 }}>Reset your password securely.</p>
                    </motion.div>
                </div>
            </div>
            <div className="auth-right">
                <motion.div
                    className="auth-card"
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <h2 style={{ marginBottom: '0.5rem', fontSize: '2rem' }}>Forgot Password</h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Enter your email to receive an OTP.</p>

                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>Email Address</label>
                            <input
                                type="email"
                                className="input"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.875rem' }}>Send OTP</button>
                    </form>

                    <p style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                        Remember your password? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '600' }}>Sign in</Link>
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default ForgotPassword;
