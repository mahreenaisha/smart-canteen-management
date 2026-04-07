import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMenu, getMenuById } from "../services/menuService";
import { addCartItem, getCart } from "../services/cartStorage";

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
          Go to <Link to="/cart"> cart</Link> to place the order.
        </p>
        <div className="summary-row">
          <span className="muted">{cartCount} item(s) currently in cart</span>
          <Link className="secondary-btn" to="/cart">Review Cart</Link>
        </div>
      </section>

      {error ? <div className="panel error-text">{error}</div> : null}
      {loading ? <div className="panel">Loading menu...</div> : null}

      <section className="menu-grid">
        {menu.map((item) => (
          <article className="menu-card" key={item._id}>
            <div className={item.isAvailable === false ? "pill warn" : "pill"}>
              {item.category || "General"}
            </div>
            <div>
              <h3>{item.name}</h3>
              <p className="muted mini-text">{item.description || "Freshly prepared canteen item"}</p>
            </div>
            <div className="price-row">
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
