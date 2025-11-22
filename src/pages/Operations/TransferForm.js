import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API = "http://localhost:5001/api";

function TransferForm() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [locations, setLocations] = useState([]);
  
  const [form, setForm] = useState({
    product: "",
    fromLocation: "",
    toLocation: "",
    quantity: ""
  });

  useEffect(() => {
    axios.get(`${API}/products`).then(res => setProducts(res.data));
    axios.get(`${API}/locations`).then(res => setLocations(res.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/transfers`, form);
      navigate("/stock");
    } catch (err) {
      alert(err.response?.data?.error || "Transfer failed");
    }
  };

  return (
    <div>
      <div className="header">
        <h1>Internal Transfer</h1>
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
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>From Location</label>
                <select className="input" value={form.fromLocation} onChange={e => setForm({...form, fromLocation: e.target.value})} required>
                <option value="">Select Source</option>
                {locations.map(l => <option key={l._id} value={l._id}>{l.name} ({l.warehouse?.name})</option>)}
                </select>
            </div>
            <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>To Location</label>
                <select className="input" value={form.toLocation} onChange={e => setForm({...form, toLocation: e.target.value})} required>
                <option value="">Select Destination</option>
                {locations.map(l => <option key={l._id} value={l._id}>{l.name} ({l.warehouse?.name})</option>)}
                </select>
            </div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Quantity</label>
            <input type="number" className="input" value={form.quantity} onChange={e => setForm({...form, quantity: e.target.value})} required />
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button type="submit" className="btn btn-primary">Confirm Transfer</button>
            <button type="button" className="btn btn-outline" onClick={() => navigate("/stock")}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TransferForm;
