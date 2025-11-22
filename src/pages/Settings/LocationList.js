import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaPlus, FaEdit, FaTrash, FaSearch, FaMapMarkerAlt, FaFilter } from "react-icons/fa";

const API = "http://localhost:5001/api";

function LocationList() {
  const [locations, setLocations] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [filterWarehouse, setFilterWarehouse] = useState("");
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${API}/warehouses`).then((res) => setWarehouses(res.data));
  }, []);

  useEffect(() => {
    fetchLocations();
  }, [filterWarehouse]);

  const fetchLocations = async () => {
    const url = filterWarehouse ? `${API}/locations?warehouse=${filterWarehouse}` : `${API}/locations`;
    const res = await axios.get(url);
    setLocations(res.data);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this location?")) {
      await axios.delete(`${API}/locations/${id}`);
      fetchLocations();
    }
  };

  const filteredLocations = locations.filter(loc => 
    loc.name.toLowerCase().includes(search.toLowerCase()) ||
    loc.shortCode.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="header">
        <div>
            <h1>Locations</h1>
            <p style={{ color: 'var(--text-muted)' }}>Manage racks, shelves, and zones within warehouses.</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate("/settings/location/new")}>
            <FaPlus /> Add Location
        </button>
      </div>

      <div className="card" style={{ marginBottom: '1.5rem', padding: '1rem' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{ position: 'relative', flex: 1 }}>
                <FaSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                    type="text" 
                    className="input" 
                    placeholder="Search locations..." 
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
                    value={filterWarehouse} 
                    onChange={(e) => setFilterWarehouse(e.target.value)}
                >
                    <option value="">All Warehouses</option>
                    {warehouses.map((wh) => (
                        <option key={wh._id} value={wh._id}>{wh.name}</option>
                    ))}
                </select>
            </div>
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Short Code</th>
              <th>Warehouse</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredLocations.map((loc) => (
              <tr key={loc._id}>
                <td style={{ fontWeight: '500', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ padding: '8px', background: 'var(--bg-surface)', borderRadius: '6px', color: 'var(--secondary)' }}>
                        <FaMapMarkerAlt />
                    </div>
                    {loc.name}
                </td>
                <td><span style={{ fontFamily: 'monospace', background: 'var(--bg-surface)', padding: '2px 6px', borderRadius: '4px' }}>{loc.shortCode}</span></td>
                <td>
                    <span className="badge badge-neutral">
                        {loc.warehouse?.name}
                    </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                    <button className="btn btn-outline btn-sm" onClick={() => navigate(`/settings/location/edit/${loc._id}`)}>
                        <FaEdit />
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(loc._id)}>
                        <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredLocations.length === 0 && (
                <tr>
                    <td colSpan="4" style={{textAlign: 'center', padding: '3rem', color: 'var(--text-muted)'}}>
                        No locations found.
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default LocationList;