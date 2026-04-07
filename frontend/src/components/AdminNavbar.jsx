import { NavLink, useNavigate } from "react-router-dom";
import { STORAGE_KEYS } from "../config";

export default function AdminNavbar() {
  const navigate = useNavigate();

  return (
    <header className="topbar">
      <div className="brand-wrap">
        <div className="brand-kicker">Admin Console</div>
        <div className="brand">Smart Canteen Control</div>
        <div className="mini-text muted">Manage menu items and order status updates</div>
      </div>
      <nav className="nav-links">
        <NavLink to="/admin/menu">Menu Control</NavLink>
        <NavLink to="/admin/orders">Order Control</NavLink>
        <button
          type="button"
          onClick={() => {
            localStorage.removeItem(STORAGE_KEYS.ADMIN_TOKEN);
            navigate("/admin/login");
          }}
        >
          Logout
        </button>
      </nav>
    </header>
  );
}
