import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaUserCircle, FaEnvelope, FaIdBadge } from "react-icons/fa";

const API = "http://localhost:5001/api";

function Profile() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem("token");
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            const { data } = await axios.get(`${API}/auth/profile`, config);
            setUser(data);
        } catch (err) {
            console.error(err);
            // If token is invalid, maybe redirect to login?
        }
    };

    if (!user) return <div>Loading...</div>;

    return (
        <div>
            <div className="header">
                <h1>My Profile</h1>
            </div>
            <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2rem' }}>
                    <FaUserCircle size={100} color="var(--text-muted)" />
                    <h2 style={{ marginTop: '1rem' }}>{user.name}</h2>
                    <span className="badge badge-primary" style={{ marginTop: '0.5rem' }}>{user.role}</span>
                </div>

                <div style={{ display: 'grid', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', padding: '1rem', background: 'var(--bg-surface)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                        <FaEnvelope size={20} color="var(--text-muted)" style={{ marginRight: '1rem' }} />
                        <div>
                            <small style={{ display: 'block', color: 'var(--text-muted)' }}>Email Address</small>
                            <span style={{ fontWeight: '500' }}>{user.email}</span>
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', padding: '1rem', background: 'var(--bg-surface)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                        <FaIdBadge size={20} color="var(--text-muted)" style={{ marginRight: '1rem' }} />
                        <div>
                            <small style={{ display: 'block', color: 'var(--text-muted)' }}>User ID</small>
                            <span style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}>{user._id}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;
