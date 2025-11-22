import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaSearch, FaArrowRight, FaHistory, FaFilter } from "react-icons/fa";

const API = "http://localhost:5001/api";

function MoveHistory() {
  const [moves, setMoves] = useState([]);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("");

  useEffect(() => {
    fetchMoves();
  }, []);

  const fetchMoves = async () => {
    try {
      const res = await axios.get(`${API}/moves`);
      setMoves(res.data);
    } catch (err) {
      console.error("Error fetching moves:", err);
    }
  };

  const filteredMoves = moves.filter(move => {
    const matchesSearch = 
      move.reference?.toLowerCase().includes(search.toLowerCase()) ||
      move.product?.name.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType ? move.type === filterType : true;
    return matchesSearch && matchesType;
  });

  const getMoveColor = (quantity) => {
    return quantity > 0 ? "var(--success)" : "var(--danger)";
  };

  const getMoveBadge = (type) => {
    switch(type) {
      case 'Receipt': return 'badge-success';
      case 'Delivery': return 'badge-danger';
      case 'Internal': return 'badge-warning';
      case 'Adjustment': return 'badge-neutral';
      default: return 'badge-neutral';
    }
  };

  return (
    <div>
      <div className="header">
        <div>
            <h1>Stock Ledger</h1>
            <p style={{ color: 'var(--text-muted)' }}>Complete history of all inventory movements.</p>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '1.5rem', padding: '1rem' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{ position: 'relative', flex: 1 }}>
                <FaSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                    type="text" 
                    className="input" 
                    placeholder="Search by reference or product..." 
                    style={{ paddingLeft: '2.5rem' }}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
            <div style={{ position: 'relative', minWidth: '200px' }}>
                <FaFilter style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <select 
                    className="input" 
                    style={{ paddingLeft: '2.5rem' }}
                    value={filterType} 
                    onChange={(e) => setFilterType(e.target.value)}
                >
                    <option value="">All Operations</option>
                    <option value="Receipt">Receipts (In)</option>
                    <option value="Delivery">Deliveries (Out)</option>
                    <option value="Internal">Internal Transfers</option>
                    <option value="Adjustment">Adjustments</option>
                </select>
            </div>
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Reference</th>
              <th>Product</th>
              <th>From</th>
              <th>To</th>
              <th>Quantity</th>
              <th>Type</th>
            </tr>
          </thead>
          <tbody>
            {filteredMoves.map((move) => (
              <tr key={move._id}>
                <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    {new Date(move.date).toLocaleString()}
                </td>
                <td style={{ fontFamily: 'monospace', fontWeight: '500' }}>{move.reference}</td>
                <td style={{ fontWeight: '500' }}>{move.product?.name}</td>
                <td style={{ color: 'var(--text-muted)' }}>
                    {move.fromLocation?.name || "-"}
                </td>
                <td style={{ color: 'var(--text-muted)' }}>
                    {move.toLocation?.name || "-"}
                </td>
                <td style={{ fontWeight: '600', color: getMoveColor(move.quantity) }}>
                    {move.quantity > 0 ? "+" : ""}{move.quantity}
                </td>
                <td>
                    <span className={`badge ${getMoveBadge(move.type)}`}>
                        {move.type}
                    </span>
                </td>
              </tr>
            ))}
            {filteredMoves.length === 0 && (
                <tr>
                    <td colSpan="7" style={{textAlign: 'center', padding: '3rem', color: 'var(--text-muted)'}}>
                        No movements found.
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default MoveHistory;
