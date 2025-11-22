import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { FaPrint, FaCheck, FaTimes, FaPlus, FaTrash, FaArrowRight } from "react-icons/fa";

const API = "http://localhost:5001/api";

function ReceiptForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    contact: "",
    scheduledDate: "",
    sourceDoc: "",
    responsiblePerson: "",
    to: "",
    status: "Draft",
    products: []
  });

  const [warehouses, setWarehouses] = useState([]);
  const [products, setProducts] = useState([]);
  const [reference, setReference] = useState("");

  const fetchReceipt = async () => {
    if (!id) return;
    try {
      const res = await axios.get(`${API}/receipts/${id}`);
      const data = res.data;
      setReference(data.reference);
      setForm({
        contact: data.contact,
        scheduledDate: data.scheduledDate?.split("T")[0] || "",
        sourceDoc: data.sourceDoc || "",
        responsiblePerson: data.responsiblePerson || "",
        to: data.to?._id || "",
        status: data.status,
        products: data.products.map(p => ({
          product: p.product?._id || "",
          quantity: p.quantity
        }))
      });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    axios.get(`${API}/warehouses`).then(res => setWarehouses(res.data));
    axios.get(`${API}/products`).then(res => setProducts(res.data));

    if (isEdit) {
      fetchReceipt();
    } else {
      // Auto-fill responsible person for new receipts
      const userInfo = localStorage.getItem("userInfo");
      if (userInfo) {
        try {
          const user = JSON.parse(userInfo);
          setForm(prev => ({ ...prev, responsiblePerson: user.name }));
        } catch (e) {
          console.error("Error parsing user info", e);
        }
      }
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleProductChange = (index, field, value) => {
    const updated = [...form.products];
    updated[index][field] = field === "quantity" ? Number(value) : value;
    setForm({ ...form, products: updated });
  };

  const addProduct = () => {
    setForm({ ...form, products: [...form.products, { product: "", quantity: 0 }] });
  };

  const removeProduct = (index) => {
    const updated = form.products.filter((_, i) => i !== index);
    setForm({ ...form, products: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await axios.put(`${API}/receipts/${id}`, form);
      } else {
        await axios.post(`${API}/receipts`, form);
      }
      navigate("/operations/receipts");
    } catch (err) {
      alert("Error saving receipt");
    }
  };

  const handleToDo = async () => {
    try {
      await axios.put(`${API}/receipts/${id}`, { ...form, status: "Ready" });
      setForm(prev => ({ ...prev, status: "Ready" }));
      alert("Receipt moved to Ready!");
      fetchReceipt();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to update status");
    }
  };

  const handleValidate = async () => {
    try {
      await axios.post(`${API}/receipts/${id}/validate`);
      setForm(prev => ({ ...prev, status: "Done" }));
      fetchReceipt();
      alert("Receipt Validated Successfully!");
      navigate("/operations/receipts");
    } catch (err) {
      alert(err.response?.data?.error || "Validation failed");
    }
  };

  const getStatusStep = (status) => {
    const steps = ["Draft", "Waiting", "Ready", "Done"];
    const currentIndex = steps.indexOf(status);
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {steps.map((step, index) => (
          <React.Fragment key={step}>
            <div style={{
              padding: '0.25rem 0.75rem',
              borderRadius: '999px',
              fontSize: '0.75rem',
              fontWeight: '600',
              background: index <= currentIndex ? 'var(--primary)' : 'var(--bg-surface)',
              color: index <= currentIndex ? 'white' : 'var(--text-muted)',
              border: index <= currentIndex ? 'none' : '1px solid var(--border)'
            }}>
              {step}
            </div>
            {index < steps.length - 1 && <FaArrowRight size={10} color="var(--text-muted)" />}
          </React.Fragment>
        ))}
      </div>
    );
  };

  return (
    <div>
      <div className="header">
        <div>
          <h1>{isEdit ? reference : "New Receipt"}</h1>
          <p style={{ color: 'var(--text-muted)' }}>Incoming shipment from vendor.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          {isEdit && form.status === "Draft" && (
            <button className="btn btn-primary" onClick={handleToDo}>
              <FaCheck /> To DO
            </button>
          )}
          {isEdit && form.status === "Ready" && (
            <button className="btn btn-primary" onClick={handleValidate}>
              <FaCheck /> Validate
            </button>
          )}
          <button className="btn btn-outline" onClick={() => window.print()}>
            <FaPrint /> Print
          </button>
          <button className="btn btn-outline" onClick={() => navigate("/operations/receipts")}>
            <FaTimes /> Cancel
          </button>
        </div>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        {getStatusStep(form.status)}
      </div>

      <form onSubmit={handleSubmit}>
        <div className="card" style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>Receive From</label>
                <input type="text" className="input" value="Vendor" disabled style={{ background: 'var(--bg-surface)' }} />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>Contact (Vendor)</label>
                <input type="text" name="contact" className="input" value={form.contact} onChange={handleChange} required placeholder="e.g. IKEA Supply Co." />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>Destination Warehouse</label>
                <select name="to" className="input" value={form.to} onChange={handleChange} required>
                  <option value="">Select Warehouse</option>
                  {warehouses.map(wh => (
                    <option key={wh._id} value={wh._id}>{wh.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>Scheduled Date</label>
                <input type="date" name="scheduledDate" className="input" value={form.scheduledDate} onChange={handleChange} required />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>Source Document</label>
                <input type="text" name="sourceDoc" className="input" value={form.sourceDoc} onChange={handleChange} placeholder="e.g. PO001" />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>Responsible Person</label>
                <input type="text" name="responsiblePerson" className="input" value={form.responsiblePerson} onChange={handleChange} />
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: '1rem' }}>Products</h3>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th style={{ width: '150px' }}>Quantity</th>
                  <th style={{ width: '100px', textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {form.products.map((item, index) => (
                  <tr key={index}>
                    <td>
                      <select
                        className="input"
                        value={item.product}
                        onChange={(e) => handleProductChange(index, "product", e.target.value)}
                        required
                        disabled={form.status === "Done"}
                      >
                        <option value="">Select Product</option>
                        {products.map(p => (
                          <option key={p._id} value={p._id}>{p.name} ({p.sku})</option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <input
                        type="number"
                        className="input"
                        value={item.quantity}
                        onChange={(e) => handleProductChange(index, "quantity", e.target.value)}
                        required
                        min="1"
                        disabled={form.status === "Done"}
                      />
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      {form.status !== "Done" && (
                        <button type="button" className="btn btn-danger btn-sm" onClick={() => removeProduct(index)}>
                          <FaTrash />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {form.status !== "Done" && (
            <button type="button" className="btn btn-outline" onClick={addProduct} style={{ marginTop: '1rem' }}>
              <FaPlus /> Add Product
            </button>
          )}
        </div>

        <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
          <button type="submit" className="btn btn-primary" disabled={form.status === "Done"}>
            {isEdit ? "Save Changes" : "Create Receipt"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ReceiptForm;
