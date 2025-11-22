import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaPlus, FaEdit, FaTrash, FaSearch, FaBuilding } from "react-icons/fa";

const API = "http://localhost:5001/api";

function WarehouseList() {
  const [warehouses, setWarehouses] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchWarehouses();
  }, []);

  const fetchWarehouses = async () => {
    const res = await axios.get(`${API}/warehouses`);
    setWarehouses(res.data);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this warehouse?")) {
      await axios.delete(`${API}/warehouses/${id}`);
      fetchWarehouses();
    }
  };

  const filteredWarehouses = warehouses.filter(wh => 
    wh.name.toLowerCase().includes(search.toLowerCase()) ||
    wh.shortCode.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="header">
        <div>
            <h1>Warehouses</h1>
            <p style={{ color: 'var(--text-muted)' }}>Manage your physical storage locations.</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate("/settings/warehouse/new")}>
            <FaPlus /> Add Warehouse
        </button>
      </div>

      <div className="card" style={{ marginBottom: '1.5rem', padding: '1rem' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{ position: 'relative', flex: 1 }}>
                <FaSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                    type="text" 
                    className="input" 
                    placeholder="Search warehouses..." 
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
              <th>Name</th>
              <th>Short Code</th>
              <th>Address</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredWarehouses.map((wh) => (
              <tr key={wh._id}>
                <td style={{ fontWeight: '500', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ padding: '8px', background: 'var(--bg-surface)', borderRadius: '6px', color: 'var(--primary)' }}>
                        <FaBuilding />
                    </div>
                    {wh.name}
                </td>
                <td><span style={{ fontFamily: 'monospace', background: 'var(--bg-surface)', padding: '2px 6px', borderRadius: '4px' }}>{wh.shortCode}</span></td>
                <td style={{ color: 'var(--text-muted)' }}>{wh.address}</td>
                <td style={{ textAlign: 'right' }}>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                    <button className="btn btn-outline btn-sm" onClick={() => navigate(`/settings/warehouse/edit/${wh._id}`)}>
                        <FaEdit />
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(wh._id)}>
                        <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredWarehouses.length === 0 && (
                <tr>
                    <td colSpan="4" style={{textAlign: 'center', padding: '3rem', color: 'var(--text-muted)'}}>
                        No warehouses found.
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default WarehouseList;