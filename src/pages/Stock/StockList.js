import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaFilter, FaPlus, FaExchangeAlt, FaAdjust } from "react-icons/fa";

const API = "http://localhost:5001/api";

function StockList() {
    const [stocks, setStocks] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetchStocks();
    }, []);

    const fetchStocks = async () => {
        try {
            const res = await axios.get(`${API}/stocks`);
            setStocks(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const filteredStocks = stocks.filter(stock =>
        stock.product?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stock.product?.sku.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <div className="header">
                <div>
                    <h1>Inventory</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Manage your stock across all locations.</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className="btn btn-outline" onClick={() => navigate("/operations/transfers/new")}>
                        <FaExchangeAlt /> Transfer
                    </button>
                    <button className="btn btn-outline" onClick={() => navigate("/operations/adjustments/new")}>
                        <FaAdjust /> Adjust
                    </button>
                </div>
            </div>

            <div className="card" style={{ marginBottom: '2rem', padding: '1rem' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div style={{ position: 'relative', flex: 1 }}>
                        <FaSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input
                            type="text"
                            className="input"
                            placeholder="Search products by name or SKU..."
                            style={{ paddingLeft: '2.5rem' }}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="btn btn-outline"><FaFilter /> Filter</button>
                </div>
            </div>

            <div className="card table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Product Name</th>
                            <th>SKU</th>
                            <th>Location</th>
                            <th>Quantity</th>
                            <th>Valuation</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredStocks.map((stock) => (
                            <tr key={stock._id}>
                                <td style={{ fontWeight: '500' }}>{stock.product?.name}</td>
                                <td style={{ fontFamily: 'monospace', color: 'var(--text-muted)' }}>{stock.product?.sku}</td>
                                <td>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <span>{stock.location?.name}</span>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{stock.location?.warehouse?.name}</span>
                                    </div>
                                </td>
                                <td style={{ fontWeight: '600' }}>{stock.quantity} <span style={{ fontSize: '0.75rem', fontWeight: '400', color: 'var(--text-muted)' }}>{stock.product?.unitOfMeasure}</span></td>
                                <td style={{ fontWeight: '500' }}>
                                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'INR' }).format(stock.quantity * (stock.product?.perUnitCost || 0))}
                                </td>
                                <td>
                                    <span className={`badge ${stock.quantity > 10 ? 'badge-success' : stock.quantity > 0 ? 'badge-warning' : 'badge-danger'}`}>
                                        {stock.quantity > 10 ? 'In Stock' : stock.quantity > 0 ? 'Low Stock' : 'Out of Stock'}
                                    </span>
                                </td>
                            </tr>
                        ))}
                        {filteredStocks.length === 0 && (
                            <tr>
                                <td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                                    No products found matching your search.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default StockList;
