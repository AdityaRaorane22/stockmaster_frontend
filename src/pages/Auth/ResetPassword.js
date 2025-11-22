import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaLock } from 'react-icons/fa';

const ResetPassword = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');

    useEffect(() => {
        if (location.state?.email) {
            setEmail(location.state.email);
        }
    }, [location]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(newPassword)) {
            alert("Password must be at least 8 characters long and include 1 uppercase, 1 lowercase, 1 number, and 1 special character.");
            return;
        }

        try {
            await axios.post('http://localhost:5001/api/auth/reset-password', { email, otp, newPassword });
            alert('Password reset successful! Please login.');
            navigate('/login');
        } catch (error) {
            alert(error.response?.data?.message || 'Reset failed');
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
                        <FaLock size={64} style={{ marginBottom: '1.5rem' }} />
                        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Secure</h1>
                        <p style={{ fontSize: '1.25rem', opacity: 0.9 }}>Set a new strong password.</p>
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
                    <h2 style={{ marginBottom: '0.5rem', fontSize: '2rem' }}>Reset Password</h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Enter the OTP sent to your email.</p>

                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>Email Address</label>
                            <input
                                type="email"
                                className="input"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>OTP Code</label>
                            <input
                                type="text"
                                className="input"
                                placeholder="Enter 6-digit OTP"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                required
                            />
                        </div>
                        <div style={{ marginBottom: '2rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>New Password</label>
                            <input
                                type="password"
                                className="input"
                                placeholder="New strong password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.875rem' }}>Reset Password</button>
                    </form>

                    <p style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                        <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '600' }}>Back to Login</Link>
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default ResetPassword;
