import { Navigate, Route, Routes } from "react-router";
import Layout from "./components/layout/Layout";
import ProtectedRoute from "./routes/ProtectedRoute";
import Login from "./pages/Login";
import DevRolePicker from "./pages/DevRolePicker";
import Dashboard from "./pages/Dashboard";
import Tithes from "./pages/Tithes";
import RequestForm from "./pages/RequestForm";
import Voucher from "./pages/Voucher";
import Expense from "./pages/Expense";
import Reports from "./pages/Reports";
import Notifications from "./pages/Notifications";
import Users from "./pages/Users";
import Categories from "./pages/Categories";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route path="/dev-login" element={<DevRolePicker />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tithes" element={<Tithes />} />
          <Route path="/request-form" element={<RequestForm />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/notifications" element={<Notifications />} />

          <Route element={<ProtectedRoute allowedRoles={["admin", "do", "validator", "auditor"]} />}>
            <Route path="/voucher" element={<Voucher />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["admin", "auditor"]} />}>
            <Route path="/expense" element={<Expense />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route path="/admin/users" element={<Users />} />
            <Route path="/admin/categories" element={<Categories />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;
