import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaSearch, FaPlus, FaEdit, FaTrash } from "react-icons/fa";

const API = "http://localhost:5001/api";

function ReceiptList() {
  const [receipts, setReceipts] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchReceipts();
  }, []);

  const fetchReceipts = async () => {
    const res = await axios.get(`${API}/receipts`);
    setReceipts(res.data);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this receipt?")) {
      await axios.delete(`${API}/receipts/${id}`);
      fetchReceipts();
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
  };

  const filteredReceipts = receipts.filter(r => 
    r.reference.toLowerCase().includes(search.toLowerCase()) ||
    r.contact.toLowerCase().includes(search.toLowerCase())
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
            <h1>Receipts</h1>
            <p style={{ color: 'var(--text-muted)' }}>Manage incoming stock from vendors.</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate("/operations/receipts/new")}>
            <FaPlus /> New Receipt
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
            {filteredReceipts.map((receipt) => (
              <tr key={receipt._id}>
                <td style={{ fontWeight: '500' }}>{receipt.reference}</td>
                <td>{receipt.from}</td>
                <td>{receipt.to?.name || "WH/Stock"}</td>
                <td>{receipt.contact}</td>
                <td>{formatDate(receipt.scheduledDate)}</td>
                <td>
                    <span className={`badge ${getStatusBadge(receipt.status)}`}>
                        {receipt.status}
                    </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                    <button className="btn btn-outline btn-sm" onClick={() => navigate(`/operations/receipts/edit/${receipt._id}`)}>
                        <FaEdit />
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(receipt._id)}>
                        <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredReceipts.length === 0 && (
                <tr>
                    <td colSpan="7" style={{textAlign: 'center', padding: '3rem', color: 'var(--text-muted)'}}>
                        No receipts found.
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ReceiptList;