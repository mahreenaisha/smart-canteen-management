import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/useAuth";
import { getCart } from "../services/cartStorage";

export default function Navbar() {
  const { logout, profile } = useAuth();
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(() => getCart().reduce((sum, item) => sum + item.qty, 0));

  useEffect(() => {
    function syncCart() {
      setCartCount(getCart().reduce((sum, item) => sum + item.qty, 0));
    }

    window.addEventListener("cart-updated", syncCart);
    return () => window.removeEventListener("cart-updated", syncCart);
  }, []);

  return (
    <header className="topbar">
      <div>
        <div className="brand">Smart Canteen</div>
        <div className="mini-text muted">{profile?.name ? `Signed in as ${profile.name}` : "Student portal"}</div>
      </div>
      <nav className="nav-links">
        <NavLink to="/menu">Menu</NavLink>
        <NavLink to="/cart">Cart ({cartCount})</NavLink>
        <NavLink to="/orders">Orders</NavLink>
        <NavLink to="/notifications">Notifications</NavLink>
        <NavLink to="/wallet">Wallet</NavLink>
        <button
          type="button"
          onClick={() => {
            logout();
            navigate("/login");
          }}
        >
          Logout
        </button>
      </nav>
    </header>
  );
}
