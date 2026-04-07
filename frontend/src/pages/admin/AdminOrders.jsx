import { useEffect, useMemo, useState } from "react";
import { STORAGE_KEYS } from "../../config";
import { getAdminOrders, updateAdminOrderStatus } from "../../services/adminService";

export default function AdminOrders() {
  const adminToken = localStorage.getItem(STORAGE_KEYS.ADMIN_TOKEN);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState("");

  useEffect(() => {
    async function loadOrders() {
      setLoading(true);
      try {
        const data = await getAdminOrders(adminToken);
        setOrders(data);
        setError("");
      } catch (requestError) {
        setError(requestError.response?.data?.message || "Unable to fetch orders");
      } finally {
        setLoading(false);
      }
    }

    loadOrders();
  }, [adminToken]);

  const orderCount = useMemo(() => orders.length, [orders]);

  async function handleStatusUpdate(orderId, status) {
    setUpdatingId(orderId);
    setError("");
    setMessage("");

    try {
      await updateAdminOrderStatus(orderId, status, adminToken);
      setMessage(`Order ${orderId} updated to ${status}.`);
      const data = await getAdminOrders(adminToken);
      setOrders(data);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to update order");
    } finally {
      setUpdatingId("");
    }
  }

  return (
    <>
      <section className="hero-card">
        <h1 className="hero-title">Order Control</h1>
        <p className="hero-copy">Watch incoming orders, review item lists, and update statuses as meals move through preparation.</p>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">Orders</div>
            <div className="stat-value">{orderCount}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Ready</div>
            <div className="stat-value">{orders.filter((order) => order.status === "READY").length}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Placed</div>
            <div className="stat-value">{orders.filter((order) => order.status === "PLACED").length}</div>
          </div>
        </div>
      </section>

      {error ? <div className="panel error-text">{error}</div> : null}
      {message ? <div className="panel success-text">{message}</div> : null}
      {loading ? <div className="panel">Loading orders...</div> : null}

      <section className="order-grid">
        {orders.map((order) => (
          <article className="order-card" key={order.orderId}>
            <div className={`pill ${order.status === "READY" ? "ready" : order.status === "CANCELLED" ? "warn" : ""}`}>
              {order.status}
            </div>
            <h3 className="card-title">{order.orderId}</h3>
            <p className="muted mini-text">{order.studentId}</p>
            <div className="stack mini-text muted">
              {order.items.map((item) => (
                <span key={`${order.orderId}-${item.name}`}>{item.name} x {item.qty}</span>
              ))}
            </div>
            <div className="order-meta">
              <strong className="money-strong">Rs. {order.total}</strong>
              <div className="action-row">
                <button
                  className="secondary-btn"
                  type="button"
                  disabled={updatingId === order.orderId}
                  onClick={() => handleStatusUpdate(order.orderId, "READY")}
                >
                  Mark Ready
                </button>
                <button
                  className="secondary-btn"
                  type="button"
                  disabled={updatingId === order.orderId}
                  onClick={() => handleStatusUpdate(order.orderId, "CANCELLED")}
                >
                  Cancel
                </button>
              </div>
            </div>
          </article>
        ))}
        {!loading && orders.length === 0 ? <div className="empty-state muted">No admin orders yet.</div> : null}
      </section>
    </>
  );
}
