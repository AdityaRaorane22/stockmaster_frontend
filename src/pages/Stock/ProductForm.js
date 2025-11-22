import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const API = "http://localhost:5001/api";

function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    name: "",
    sku: "",
    category: "",
    unitOfMeasure: "",
    perUnitCost: ""
  });

  useEffect(() => {
    if (isEdit) {
      axios.get(`${API}/products/${id}`).then((res) => setForm(res.data));
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await axios.put(`${API}/products/${id}`, form);
      } else {
        await axios.post(`${API}/products`, form);
      }
      navigate("/products");
    } catch (err) {
      alert(err.response?.data?.error || "Error saving product");
    }
  };

  return (
    <div>
      <div className="header">
        <h1>{isEdit ? "Edit Product" : "New Product"}</h1>
      </div>
      <div className="card" style={{ maxWidth: '600px' }}>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Product Name</label>
            <input type="text" name="name" className="input" value={form.name} onChange={handleChange} required />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>SKU / Code</label>
              <input type="text" name="sku" className="input" value={form.sku} onChange={handleChange} required />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Category</label>
              <input type="text" name="category" className="input" placeholder="e.g. Electronics" value={form.category} onChange={handleChange} required />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Unit of Measure</label>
              <input type="text" name="unitOfMeasure" className="input" placeholder="e.g. pcs, kg, box" value={form.unitOfMeasure} onChange={handleChange} required />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Cost per Unit (₹)</label>
              <input type="number" name="perUnitCost" className="input" value={form.perUnitCost} onChange={handleChange} required />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button type="submit" className="btn btn-primary">{isEdit ? "Update Product" : "Create Product"}</button>
            <button type="button" className="btn btn-outline" onClick={() => navigate("/products")}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProductForm;
