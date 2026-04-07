import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { clearCart, getCart, updateCartQuantity } from "../services/cartStorage";
import { placeOrder } from "../services/orderService";

export default function Cart() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [cart, setCart] = useState(getCart());
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const total = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.qty, 0),
    [cart],
  );

  function changeQty(menuId, nextQty) {
    setCart(updateCartQuantity(menuId, nextQty));
  }

  async function handlePlaceOrder() {
    setSubmitting(true);
    setError("");
    setMessage("");

    try {
      const payload = cart.map((item) => ({
        menuId: item.menuId,
        qty: item.qty,
      }));

      const response = await placeOrder(payload, token);
      clearCart();
      setCart([]);
      setMessage(`${response.message}. Remaining balance: Rs. ${response.wallet.remainingBalance}`);
      setTimeout(() => navigate("/orders"), 900);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Order could not be placed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="layout-grid">
      <section className="panel">
        <h1 className="hero-title">Cart</h1>
        <p className="hero-copy">Review quantities, confirm the total, and place your order in one step.</p>
        {error ? <div className="error-text">{error}</div> : null}
        {message ? <div className="success-text">{message}</div> : null}
        <div className="cart-list">
          {cart.length === 0 ? <div className="empty-state muted">Your cart is empty.</div> : null}
          {cart.map((item) => (
            <article className="cart-item" key={item.menuId}>
              <div className="cart-row">
                <div>
                  <strong className="card-title">{item.name}</strong>
                  <div className="muted mini-text">Rs. {item.price} each</div>
                </div>
                <div className="qty-group">
                  <button className="qty-btn" type="button" onClick={() => changeQty(item.menuId, item.qty - 1)}>-</button>
                  <span className="qty-value">{item.qty}</span>
                  <button className="qty-btn" type="button" onClick={() => changeQty(item.menuId, item.qty + 1)}>+</button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <aside className="panel">
        <h2 className="section-title">Summary</h2>
        <div className="summary-list">
          <div className="summary-row">
            <span>Items</span>
            <span>{cart.reduce((sum, item) => sum + item.qty, 0)}</span>
          </div>
          <div className="summary-row">
            <span>Total</span>
            <strong className="money-strong">Rs. {total}</strong>
          </div>
        </div>
        <button className="primary-btn" type="button" disabled={cart.length === 0 || submitting} onClick={handlePlaceOrder}>
          {submitting ? "Placing order..." : "Place Order"}
        </button>
      </aside>
    </div>
  );
}
