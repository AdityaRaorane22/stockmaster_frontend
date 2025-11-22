import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API = "http://localhost:5001/api";

function AdjustmentForm() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [locations, setLocations] = useState([]);
  
  const [form, setForm] = useState({
    product: "",
    location: "",
    quantity: "",
    type: "Set" // or Add
  });

  useEffect(() => {
    axios.get(`${API}/products`).then(res => setProducts(res.data));
    axios.get(`${API}/locations`).then(res => setLocations(res.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/adjustments`, form);
      navigate("/stock");
    } catch (err) {
      alert(err.response?.data?.error || "Adjustment failed");
    }
  };

  return (
    <div>
      <div className="header">
        <h1>Stock Adjustment</h1>
      </div>
      <div className="card" style={{ maxWidth: '600px' }}>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Product</label>
            <select className="input" value={form.product} onChange={e => setForm({...form, product: e.target.value})} required>
              <option value="">Select Product</option>
              {products.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
            </select>
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Location</label>
            <select className="input" value={form.location} onChange={e => setForm({...form, location: e.target.value})} required>
            <option value="">Select Location</option>
            {locations.map(l => <option key={l._id} value={l._id}>{l.name} ({l.warehouse?.name})</option>)}
            </select>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Adjustment Type</label>
            <select className="input" value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
                <option value="Set">Set New Quantity</option>
                <option value="Add">Add/Remove Quantity</option>
            </select>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Quantity</label>
            <input type="number" className="input" value={form.quantity} onChange={e => setForm({...form, quantity: e.target.value})} required />
            <small style={{color: 'var(--text-secondary)'}}>For 'Set', enter the physical count. For 'Add', enter positive to add or negative to remove.</small>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button type="submit" className="btn btn-primary">Confirm Adjustment</button>
            <button type="button" className="btn btn-outline" onClick={() => navigate("/stock")}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdjustmentForm;
