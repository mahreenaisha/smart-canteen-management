import { useEffect, useState } from "react";
import { useAuth } from "../context/useAuth";
import { getOrders } from "../services/orderService";

export default function Orders() {
  const { profile, token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrders() {
      try {
        const data = await getOrders(token);
        const studentOrders = profile?.studentId
          ? data.filter((order) => order.studentId === profile.studentId)
          : data;
        setOrders(studentOrders);
      } catch (requestError) {
        setError(requestError.response?.data?.message || "Unable to load orders");
      } finally {
        setLoading(false);
      }
    }

    loadOrders();
  }, [profile?.studentId, token]);

  return (
    <>
      <section className="hero-card">
        <h1 className="hero-title">My Orders</h1>
        <p className="hero-copy">Placed Orders</p>
      </section>

      {error ? <div className="panel error-text">{error}</div> : null}
      {loading ? <div className="panel">Loading orders...</div> : null}

      <section className="order-grid">
        {orders.map((order) => (
          <article className="order-card" key={order.orderId}>
            <div className={`pill ${order.status === "READY" ? "ready" : order.status === "CANCELLED" ? "warn" : ""}`}>
              {order.status}
            </div>
            <h3>{order.orderId}</h3>
            <div className="stack mini-text muted">
              {order.items.map((item) => (
                <span key={`${order.orderId}-${item.name}`}>
                  {item.name} x {item.qty}
                </span>
              ))}
            </div>
            <div className="summary-row">
              <span>Total</span>
              <strong>Rs. {order.total}</strong>
            </div>
          </article>
        ))}
        {!loading && orders.length === 0 ? <div className="panel muted">No orders yet.</div> : null}
      </section>
    </>
  );
}
