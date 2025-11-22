import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { FaPrint, FaCheck, FaTimes, FaPlus, FaTrash, FaArrowRight, FaSync } from "react-icons/fa";

const API = "http://localhost:5001/api";

function DeliveryForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    contact: "",
    scheduledDate: "",
    deliveryAddress: "",
    responsiblePerson: "",
    from: "",
    status: "Draft",
    products: []
  });

  const [warehouses, setWarehouses] = useState([]);
  const [products, setProducts] = useState([]);
  const [stocks, setStocks] = useState([]);
  const [reference, setReference] = useState("");

  const fetchDelivery = async () => {
    if (!id) return;
    try {
      const res = await axios.get(`${API}/deliveries/${id}`);
      const data = res.data;
      setReference(data.reference);
      setForm({
        contact: data.contact,
        scheduledDate: data.scheduledDate?.split("T")[0] || "",
        deliveryAddress: data.deliveryAddress || "",
        responsiblePerson: data.responsiblePerson || "",
        from: data.from?._id || "",
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
    fetchStocks();

    if (isEdit) {
      fetchDelivery();
    } else {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isEdit]);

  const fetchStocks = async () => {
    try {
      const res = await axios.get(`${API}/stocks`);
      setStocks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const getStockQuantity = (productId, warehouseId) => {
    if (!productId || !warehouseId) return 0;
    const relevantStock = stocks.find(s =>
      s.product?._id === productId &&
      (s.location?.warehouse?._id === warehouseId || s.location?.warehouse === warehouseId)
    );
    return relevantStock ? relevantStock.quantity : 0;
  };

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
        await axios.put(`${API}/deliveries/${id}`, form);
      } else {
        await axios.post(`${API}/deliveries`, form);
      }
      navigate("/operations/deliveries");
    } catch (err) {
      alert("Error saving delivery");
    }
  };

  const handleToDo = async () => {
    try {
      // Check if all products have sufficient stock
      let hasInsufficientStock = false;
      for (const item of form.products) {
        const availableStock = getStockQuantity(item.product, form.from);
        if (availableStock < item.quantity) {
          hasInsufficientStock = true;
          break;
        }
      }

      const newStatus = hasInsufficientStock ? "Waiting" : "Ready";
      await axios.put(`${API}/deliveries/${id}`, { ...form, status: newStatus });
      setForm(prev => ({ ...prev, status: newStatus }));

      if (hasInsufficientStock) {
        alert("Delivery moved to Waiting due to insufficient stock!");
      } else {
        alert("Delivery moved to Ready!");
      }

      fetchDelivery();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to update status");
    }
  };

  const handleRecheckStock = async () => {
    try {
      // Refresh stock data
      await fetchStocks();

      // Check if all products now have sufficient stock
      let hasInsufficientStock = false;
      for (const item of form.products) {
        const availableStock = getStockQuantity(item.product, form.from);
        if (availableStock < item.quantity) {
          hasInsufficientStock = true;
          break;
        }
      }

      if (!hasInsufficientStock) {
        // Stock is now sufficient, move to Ready
        const newStatus = "Ready";
        await axios.put(`${API}/deliveries/${id}`, { ...form, status: newStatus });
        setForm(prev => ({ ...prev, status: newStatus }));
        alert("Stock is now available! Delivery moved to Ready.");
        fetchDelivery();
      } else {
        alert("Stock is still insufficient. Delivery remains in Waiting status.");
      }
    } catch (err) {
      alert(err.response?.data?.error || "Failed to recheck stock");
    }
  };

  const handleValidate = async () => {
    try {
      const res = await axios.post(`${API}/deliveries/${id}/validate`);
      setForm({ ...form, status: res.data.status });
      if (res.data.status === "Waiting") {
        alert("Delivery is waiting for stock availability");
      } else {
        alert("Delivery Validated Successfully!");
        navigate("/operations/deliveries");
      }
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
          <h1>{isEdit ? reference : "New Delivery"}</h1>
          <p style={{ color: 'var(--text-muted)' }}>Outgoing shipment to customer.</p>
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
          {isEdit && form.status === "Waiting" && (
            <button className="btn btn-warning" onClick={handleRecheckStock} style={{ background: 'var(--warning)', color: 'white', border: 'none' }}>
              <FaSync /> Recheck Stock
            </button>
          )}
          <button className="btn btn-outline" onClick={() => window.print()}>
            <FaPrint /> Print
          </button>
          <button className="btn btn-outline" onClick={() => navigate("/operations/deliveries")}>
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
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>Deliver To</label>
                <input type="text" className="input" value="Customer" disabled style={{ background: 'var(--bg-surface)' }} />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>Contact (Customer)</label>
                <input type="text" name="contact" className="input" value={form.contact} onChange={handleChange} required placeholder="e.g. Furniture City" />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>Source Warehouse</label>
                <select name="from" className="input" value={form.from} onChange={handleChange} required>
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
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>Delivery Address</label>
                <input type="text" name="deliveryAddress" className="input" value={form.deliveryAddress} onChange={handleChange} placeholder="e.g. 123 Main St" />
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
                {form.products.map((item, index) => {
                  const availableStock = getStockQuantity(item.product, form.from);

                  return (
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
                        {form.from && item.product && (
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                            Available: {availableStock}
                          </div>
                        )}
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
                  )
                })}
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
            {isEdit ? "Save Changes" : "Create Delivery"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default DeliveryForm;