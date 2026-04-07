import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AdminNavbar from "./components/AdminNavbar";
import AdminProtectedRoute from "./components/AdminProtectedRoute";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./context/useAuth";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminMenu from "./pages/admin/AdminMenu";
import AdminOrders from "./pages/admin/AdminOrders";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Menu from "./pages/Menu";
import Notifications from "./pages/Notifications";
import Orders from "./pages/Orders";
import Register from "./pages/Register";
import Wallet from "./pages/Wallet";
import { STORAGE_KEYS } from "./config";

function HomeRedirect() {
  const { token } = useAuth();
  const adminToken = localStorage.getItem(STORAGE_KEYS.ADMIN_TOKEN);

  if (adminToken) {
    return <Navigate to="/admin/menu" replace />;
  }

  return <Navigate to={token ? "/menu" : "/login"} replace />;
}

function AppShell({ children }) {
  return (
    <>
      <Navbar />
      <main className="page-shell">{children}</main>
    </>
  );
}

function AdminShell({ children }) {
  return (
    <>
      <AdminNavbar />
      <main className="page-shell">{children}</main>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeRedirect />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin/login" element={<Login initialRole="admin" />} />
        <Route
          path="/admin/menu"
          element={
            <AdminProtectedRoute>
              <AdminShell>
                <AdminMenu />
              </AdminShell>
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <AdminProtectedRoute>
              <AdminShell>
                <AdminOrders />
              </AdminShell>
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/menu"
          element={
            <ProtectedRoute>
              <AppShell>
                <Menu />
              </AppShell>
            </ProtectedRoute>
          }
        />
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <AppShell>
                <Cart />
              </AppShell>
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <AppShell>
                <Orders />
              </AppShell>
            </ProtectedRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <AppShell>
                <Notifications />
              </AppShell>
            </ProtectedRoute>
          }
        />
        <Route
          path="/wallet"
          element={
            <ProtectedRoute>
              <AppShell>
                <Wallet />
              </AppShell>
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
