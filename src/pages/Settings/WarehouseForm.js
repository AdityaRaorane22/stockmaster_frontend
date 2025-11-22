import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API = "http://localhost:5001/api";

function WarehouseList() {
  const [warehouses, setWarehouses] = useState([]);
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

  return (
    <div>
      <h2>Warehouse</h2>
      <button onClick={() => navigate("/settings/warehouse/new")}>+ Add Warehouse</button>
      
      <table border="1" cellPadding="10" style={{ marginTop: "20px", width: "100%" }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Short Code</th>
            <th>Address</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {warehouses.map((wh) => (
            <tr key={wh._id}>
              <td>{wh.name}</td>
              <td>{wh.shortCode}</td>
              <td>{wh.address}</td>
              <td>
                <button onClick={() => navigate(`/settings/warehouse/edit/${wh._id}`)}>Edit</button>
                <button onClick={() => handleDelete(wh._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default WarehouseList;