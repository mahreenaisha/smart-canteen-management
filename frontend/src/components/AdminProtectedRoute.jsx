import { Navigate } from "react-router-dom";
import { STORAGE_KEYS } from "../config";

export default function AdminProtectedRoute({ children }) {
  const adminToken = localStorage.getItem(STORAGE_KEYS.ADMIN_TOKEN);

  if (!adminToken) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}
