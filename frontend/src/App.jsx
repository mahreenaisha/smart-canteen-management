import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./context/useAuth";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Menu from "./pages/Menu";
import Notifications from "./pages/Notifications";
import Orders from "./pages/Orders";
import Register from "./pages/Register";
import Wallet from "./pages/Wallet";

function HomeRedirect() {
  const { token } = useAuth();

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

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeRedirect />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
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
