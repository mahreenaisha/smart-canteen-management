import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMenu, getMenuById } from "../services/menuService";
import { addCartItem, getCart } from "../services/cartStorage";

function formatMenuName(name) {
  return name.replace(/\s\d{8,}$/, "");
}

export default function Menu() {
  const [menu, setMenu] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState("");
  const [cartCount, setCartCount] = useState(() => getCart().reduce((sum, item) => sum + item.qty, 0));

  useEffect(() => {
    async function loadMenu() {
      try {
        const items = await getMenu();
        setMenu(items);
      } catch (requestError) {
        setError(requestError.response?.data?.message || "Unable to load menu");
      } finally {
        setLoading(false);
      }
    }

    loadMenu();

    function syncCart() {
      setCartCount(getCart().reduce((sum, item) => sum + item.qty, 0));
    }

    window.addEventListener("cart-updated", syncCart);
    return () => window.removeEventListener("cart-updated", syncCart);
  }, []);

  async function handleAdd(menuId) {
    setAddingId(menuId);
    setError("");

    try {
      const item = await getMenuById(menuId);
      addCartItem({
        menuId: item._id,
        name: item.name,
        price: item.price,
      });
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to add item to cart");
    } finally {
      setAddingId("");
    }
  }

  return (
    <>
      <section className="hero-card">
        <h1 className="hero-title">Today&apos;s Menu</h1>
        <p className="hero-copy">
          Fresh canteen picks for the day. Add items as you browse, then head to your
          <Link className="subtle-link" to="/cart"> cart</Link> when you&apos;re ready.
        </p>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">Live Cart</div>
            <div className="stat-value">{cartCount}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Menu Items</div>
            <div className="stat-value">{menu.length}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Next Step</div>
            <div className="stat-action">
              <Link className="primary-btn" to="/cart">Review Cart</Link>
            </div>
          </div>
        </div>
      </section>

      {error ? <div className="panel error-text">{error}</div> : null}
      {loading ? <div className="panel">Loading menu...</div> : null}

      <section className="menu-grid">
        {menu.map((item) => (
          <article className="menu-card" key={item._id}>
            <div className={item.isAvailable === false ? "pill warn" : "pill live"}>
              {item.isAvailable === false ? "Unavailable" : item.category || "Chef Selection"}
            </div>
            <div>
              <h3 className="card-title">{formatMenuName(item.name)}</h3>
              <p className="muted mini-text">{item.description || "Freshly prepared canteen item"}</p>
            </div>
            <div className="price-row card-footer">
              <span className="price-tag">Rs. {item.price}</span>
              <button
                type="button"
                className="icon-btn"
                disabled={item.isAvailable === false || addingId === item._id}
                onClick={() => handleAdd(item._id)}
              >
                {addingId === item._id ? "..." : "+"}
              </button>
            </div>
          </article>
        ))}
      </section>
    </>
  );
}
