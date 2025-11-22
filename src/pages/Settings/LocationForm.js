import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const API = "http://localhost:5001/api";

function LocationForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    name: "",
    shortCode: "",
    warehouse: ""
  });
  const [warehouses, setWarehouses] = useState([]);

  useEffect(() => {
    axios.get(`${API}/warehouses`).then((res) => setWarehouses(res.data));
    
    if (isEdit) {
      axios.get(`${API}/locations/${id}`).then((res) => {
        setForm({
          name: res.data.name,
          shortCode: res.data.shortCode,
          warehouse: res.data.warehouse?._id || ""
        });
      });
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEdit) {
      await axios.put(`${API}/locations/${id}`, form);
    } else {
      await axios.post(`${API}/locations`, form);
    }
    navigate("/settings/location");
  };

  return (
    <div>
      <h2>{isEdit ? "Edit Location" : "Add Location"}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input type="text" name="name" value={form.name} onChange={handleChange} required />
        </div>
        <div>
          <label>Short Code:</label>
          <input type="text" name="shortCode" value={form.shortCode} onChange={handleChange} required />
        </div>
        <div>
          <label>Warehouse:</label>
          <select name="warehouse" value={form.warehouse} onChange={handleChange} required>
            <option value="">Select Warehouse</option>
            {warehouses.map((wh) => (
              <option key={wh._id} value={wh._id}>{wh.name}</option>
            ))}
          </select>
        </div>
        <p>This holds the multiple locations of warehouse, racks, etc.</p>
        <button type="submit">{isEdit ? "Update" : "Create"}</button>
        <button type="button" onClick={() => navigate("/settings/location")}>Cancel</button>
      </form>
    </div>
  );
}

export default LocationForm;