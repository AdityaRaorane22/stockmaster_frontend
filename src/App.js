import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";

// Auth
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import ResetPassword from "./pages/Auth/ResetPassword";

// Dashboard
import Dashboard from "./pages/Dashboard";

// Stock
import StockList from "./pages/Stock/StockList";
import ProductList from "./pages/Stock/ProductList";
import ProductForm from "./pages/Stock/ProductForm";

// Settings
import WarehouseList from "./pages/Settings/WarehouseList";
import WarehouseForm from "./pages/Settings/WarehouseForm";
import LocationList from "./pages/Settings/LocationList";
import LocationForm from "./pages/Settings/LocationForm";
import Profile from "./pages/Settings/Profile";

// Operations
import ReceiptList from "./pages/Operations/ReceiptList";
import ReceiptForm from "./pages/Operations/ReceiptForm";
import DeliveryList from "./pages/Operations/DeliveryList";
import DeliveryForm from "./pages/Operations/DeliveryForm";
import TransferForm from "./pages/Operations/TransferForm";
import AdjustmentForm from "./pages/Operations/AdjustmentForm";
import MoveHistory from "./pages/Operations/MoveHistory";
import OperationsKanban from "./pages/Operations/OperationsKanban";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Protected Routes */}
        <Route path="/*" element={
          <Layout>
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />

              {/* Stock Routes */}
              <Route path="/stock" element={<StockList />} />
              <Route path="/products" element={<ProductList />} />
              <Route path="/products/new" element={<ProductForm />} />
              <Route path="/products/edit/:id" element={<ProductForm />} />

              {/* Settings Routes */}
              <Route path="/settings/warehouse" element={<WarehouseList />} />
              <Route path="/settings/warehouse/new" element={<WarehouseForm />} />
              <Route path="/settings/warehouse/edit/:id" element={<WarehouseForm />} />
              <Route path="/settings/location" element={<LocationList />} />
              <Route path="/settings/location/new" element={<LocationForm />} />
              <Route path="/settings/location/edit/:id" element={<LocationForm />} />
              <Route path="/profile" element={<Profile />} />

              {/* Operations - Kanban */}
              <Route path="/operations/kanban" element={<OperationsKanban />} />

              {/* Operations - Receipts */}
              <Route path="/operations/receipts" element={<ReceiptList />} />
              <Route path="/operations/receipts/new" element={<ReceiptForm />} />
              <Route path="/operations/receipts/edit/:id" element={<ReceiptForm />} />

              {/* Operations - Deliveries */}
              <Route path="/operations/deliveries" element={<DeliveryList />} />
              <Route path="/operations/deliveries/new" element={<DeliveryForm />} />
              <Route path="/operations/deliveries/edit/:id" element={<DeliveryForm />} />

              {/* Operations - Transfers */}
              <Route path="/operations/transfers/new" element={<TransferForm />} />

              {/* Operations - Other */}
              <Route path="/operations/adjustments/new" element={<AdjustmentForm />} />
              <Route path="/operations/moves" element={<MoveHistory />} />
            </Routes>
          </Layout>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;