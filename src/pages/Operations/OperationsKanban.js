import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaBox, FaTruck, FaExclamationTriangle, FaCalendarAlt, FaUser } from "react-icons/fa";

const API = "http://localhost:5001/api";

const priorityColors = {
    late: "#ef4444",
    today: "#f59e0b",
    upcoming: "#10b981",
};

export default function OperationsKanban() {
    const navigate = useNavigate();
    const [receipts, setReceipts] = useState([]);
    const [deliveries, setDeliveries] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [receiptsRes, deliveriesRes] = await Promise.all([
                axios.get(`${API}/receipts`),
                axios.get(`${API}/deliveries`),
            ]);
            setReceipts(receiptsRes.data);
            setDeliveries(deliveriesRes.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const getPriority = (scheduledDate) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const scheduled = new Date(scheduledDate);
        scheduled.setHours(0, 0, 0, 0);

        if (scheduled < today) return "late";
        if (scheduled.getTime() === today.getTime()) return "today";
        return "upcoming";
    };

    const moveToStatus = async (operation, type, newStatus) => {
        try {
            const endpoint = type === "receipt" ? "receipts" : "deliveries";
            await axios.put(`${API}/${endpoint}/${operation._id}`, {
                ...operation,
                status: newStatus,
            });
            fetchData();
        } catch (err) {
            alert("Failed to update status");
        }
    };

    const handleValidate = async (operation, type) => {
        try {
            const endpoint = type === "receipt" ? "receipts" : "deliveries";
            await axios.post(`${API}/${endpoint}/${operation._id}/validate`);
            fetchData();
            alert(`${type === "receipt" ? "Receipt" : "Delivery"} validated successfully!`);
        } catch (err) {
            alert(err.response?.data?.error || "Validation failed");
        }
    };

    const OperationCard = ({ operation, type }) => {
        const priority = getPriority(operation.scheduledDate);
        const isReceipt = type === "receipt";

        return (
            <div
                style={{
                    padding: "14px",
                    background: "var(--bg-card)",
                    borderRadius: "12px",
                    border: "1px solid var(--border)",
                    marginBottom: "12px",
                    cursor: "pointer",
                    transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                }}
                onClick={() => navigate(`/operations/${isReceipt ? "receipts" : "deliveries"}/edit/${operation._id}`)}
            >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "10px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        {isReceipt ? <FaBox color="var(--primary)" /> : <FaTruck color="var(--secondary)" />}
                        <strong style={{ fontSize: "0.95rem" }}>{operation.reference}</strong>
                    </div>
                    <div
                        style={{
                            width: 10,
                            height: 10,
                            borderRadius: "50%",
                            background: priorityColors[priority],
                        }}
                        title={priority}
                    ></div>
                </div>

                <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "8px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                        <FaUser size={12} />
                        <span>{operation.contact}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <FaCalendarAlt size={12} />
                        <span>{new Date(operation.scheduledDate).toLocaleDateString()}</span>
                    </div>
                </div>

                {priority === "late" && (
                    <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "var(--danger)", fontSize: "0.75rem", marginTop: "6px" }}>
                        <FaExclamationTriangle size={12} />
                        <span>Overdue</span>
                    </div>
                )}

                <div style={{ display: "flex", gap: "6px", marginTop: "12px", flexWrap: "wrap" }} onClick={(e) => e.stopPropagation()}>
                    {operation.status === "Draft" && (
                        <button
                            className="btn btn-sm btn-primary"
                            onClick={() => moveToStatus(operation, type, "Ready")}
                            style={{ fontSize: "0.75rem", padding: "4px 10px" }}
                        >
                            To DO
                        </button>
                    )}
                    {operation.status === "Ready" && (
                        <button
                            className="btn btn-sm btn-primary"
                            onClick={() => handleValidate(operation, type)}
                            style={{ fontSize: "0.75rem", padding: "4px 10px" }}
                        >
                            Validate
                        </button>
                    )}
                </div>
            </div>
        );
    };

    const Column = ({ title, status, color }) => {
        const filteredReceipts = receipts.filter((r) => r.status === status);
        const filteredDeliveries = deliveries.filter((d) => d.status === status);
        const total = filteredReceipts.length + filteredDeliveries.length;

        return (
            <div style={{ flex: 1, minWidth: "280px", padding: "0 10px" }}>
                <div
                    style={{
                        background: color,
                        padding: "12px",
                        borderRadius: "10px 10px 0 0",
                        marginBottom: "12px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <h3 style={{ margin: 0, color: "white", fontSize: "1rem" }}>{title}</h3>
                    <span
                        style={{
                            background: "rgba(255,255,255,0.3)",
                            padding: "4px 10px",
                            borderRadius: "12px",
                            color: "white",
                            fontSize: "0.85rem",
                            fontWeight: "600",
                        }}
                    >
                        {total}
                    </span>
                </div>

                <div style={{ maxHeight: "calc(100vh - 250px)", overflowY: "auto", paddingRight: "4px" }}>
                    {filteredReceipts.map((receipt) => (
                        <OperationCard key={`receipt-${receipt._id}`} operation={receipt} type="receipt" />
                    ))}
                    {filteredDeliveries.map((delivery) => (
                        <OperationCard key={`delivery-${delivery._id}`} operation={delivery} type="delivery" />
                    ))}
                    {total === 0 && (
                        <div style={{ textAlign: "center", padding: "40px 20px", color: "var(--text-muted)", fontSize: "0.9rem" }}>
                            No operations
                        </div>
                    )}
                </div>
            </div>
        );
    };

    if (loading) {
        return <div style={{ padding: "20px", textAlign: "center" }}>Loading...</div>;
    }

    return (
        <div>
            <div className="header">
                <div>
                    <h1>Operations Kanban</h1>
                    <p style={{ color: "var(--text-muted)" }}>Visual overview of all receipts and deliveries.</p>
                </div>
                <div style={{ display: "flex", gap: "1rem" }}>
                    <button className="btn btn-outline" onClick={() => navigate("/operations/receipts/new")}>
                        <FaBox /> New Receipt
                    </button>
                    <button className="btn btn-outline" onClick={() => navigate("/operations/deliveries/new")}>
                        <FaTruck /> New Delivery
                    </button>
                </div>
            </div>

            <div style={{ display: "flex", gap: "20px", overflowX: "auto", paddingBottom: "20px" }}>
                <Column title="Draft" status="Draft" color="var(--text-muted)" />
                <Column title="Ready" status="Ready" color="var(--primary)" />
                <Column title="Waiting" status="Waiting" color="var(--warning)" />
                <Column title="Done" status="Done" color="var(--success)" />
            </div>
        </div>
    );
}
