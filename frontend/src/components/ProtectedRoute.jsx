import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

export default function ProtectedRoute({ children }) {
  const { loading, token } = useAuth();

  if (loading) {
    return <div className="auth-shell"><div className="auth-card panel">Loading...</div></div>;
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
