import { Route, Routes } from "react-router";
import Layout from "./components/layout/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Tithes from "./pages/Tithes";
import RequestForm from "./pages/RequestForm";
import Voucher from "./pages/Voucher";
import Expense from "./pages/Expense";
import Reports from "./pages/Reports";
import Users from "./pages/Users";
import Categories from "./pages/Categories";

function App() {
  return (
    <Routes>
      <Route element={<Login />} />

      <Route element={<Layout />}>
        <Route path="/dashboard" element={<Dashboard />}/>
        <Route path="/tithes" element={<Tithes />} />
        <Route path="/request-form" element={<RequestForm />}/>
        <Route path="/voucher" element={<Voucher />} />
        <Route path="/expense" element={<Expense />}/>
        <Route path="/reports" element={<Reports />} />
        <Route path="/admin/users" element={<Users />}/>
        <Route path="/admin/categories" element={<Categories />} />
      </Route>
    </Routes>
  );
}

export default App;
