import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaSearch, FaPlus, FaEdit, FaTrash } from "react-icons/fa";

const API = "http://localhost:5001/api";

function DeliveryList() {
  const [deliveries, setDeliveries] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const fetchDeliveries = async () => {
    const res = await axios.get(`${API}/deliveries`);
    setDeliveries(res.data);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this delivery?")) {
      await axios.delete(`${API}/deliveries/${id}`);
      fetchDeliveries();
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
  };

  const filteredDeliveries = deliveries.filter(d =>
    d.reference.toLowerCase().includes(search.toLowerCase()) ||
    d.contact.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusBadge = (status) => {
      switch(status) {
          case 'Done': return 'badge-success';
          case 'Ready': return 'badge-warning';
          case 'Cancelled': return 'badge-danger';
          default: return 'badge-neutral';
      }
  };

  return (
    <div>
      <div className="header">
        <div>
            <h1>Deliveries</h1>
            <p style={{ color: 'var(--text-muted)' }}>Manage outgoing shipments to customers.</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate("/operations/deliveries/new")}>
            <FaPlus /> New Delivery
        </button>
      </div>

      <div className="card" style={{ marginBottom: '1.5rem', padding: '1rem' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{ position: 'relative', flex: 1 }}>
                <FaSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                    type="text" 
                    className="input" 
                    placeholder="Search by reference or contact..." 
                    style={{ paddingLeft: '2.5rem' }}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Reference</th>
              <th>From</th>
              <th>To</th>
              <th>Contact</th>
              <th>Scheduled Date</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDeliveries.map((delivery) => (
              <tr key={delivery._id}>
                <td style={{ fontWeight: '500' }}>{delivery.reference}</td>
                <td>{delivery.from?.name || "WH/Stock"}</td>
                <td>{delivery.to}</td>
                <td>{delivery.contact}</td>
                <td>{formatDate(delivery.scheduledDate)}</td>
                <td>
                    <span className={`badge ${getStatusBadge(delivery.status)}`}>
                        {delivery.status}
                    </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                    <button className="btn btn-outline btn-sm" onClick={() => navigate(`/operations/deliveries/edit/${delivery._id}`)}>
                        <FaEdit />
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(delivery._id)}>
                        <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredDeliveries.length === 0 && (
                <tr>
                    <td colSpan="7" style={{textAlign: 'center', padding: '3rem', color: 'var(--text-muted)'}}>
                        No deliveries found.
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DeliveryList;