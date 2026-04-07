import { useEffect, useState } from "react";
import { useAuth } from "../context/useAuth";
import { getNotifications } from "../services/notificationService";
import { getOrders } from "../services/orderService";

export default function Notifications() {
  const { profile, token } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadNotifications() {
      if (!token || !profile?.studentId) {
        setLoading(false);
        return;
      }

      try {
        const data = await getNotifications(profile.studentId, token);
        if (!isMounted) {
          return;
        }
        setNotifications(data);
        setError("");
      } catch {
        if (!isMounted) {
          return;
        }

        try {
          const orders = await getOrders(token);
          if (!isMounted) {
            return;
          }

          const fallbackNotifications = orders.map((order) => ({
            _id: order.orderId,
            orderId: order.orderId,
            message:
              order.status === "READY"
                ? "Your order is ready"
                : order.status === "CANCELLED"
                  ? "Your order is cancelled"
                  : "Your order is confirmed",
            status: order.status,
            createdAt: order.updatedAt || order.createdAt,
          }));

          setNotifications(fallbackNotifications);
          setError("");
        } catch (requestError) {
          if (!isMounted) {
            return;
          }

          setError(requestError.response?.data?.message || "Unable to fetch notifications");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadNotifications();
    const intervalId = window.setInterval(loadNotifications, 5000);

    return () => {
      isMounted = false;
      window.clearInterval(intervalId);
    };
  }, [profile?.studentId, token]);

  return (
    <>
      <section className="hero-card">
        <h1 className="hero-title">Notifications</h1>
        <p className="hero-copy">
        </p>
      </section>

      {error ? <div className="panel error-text">{error}</div> : null}
      {loading ? <div className="panel">Loading notifications...</div> : null}

      <section className="stack">
        {notifications.map((notification) => (
          <article className="order-card" key={notification._id}>
            <div className={`pill ${notification.status === "READY" ? "ready" : notification.status === "CANCELLED" ? "warn" : ""}`}>
              {notification.status}
            </div>
            <h3>{notification.message}</h3>
            <div className="muted mini-text">{notification.orderId}</div>
            <div className="muted mini-text">
              {new Date(notification.createdAt).toLocaleString()}
            </div>
          </article>
        ))}
        {!loading && notifications.length === 0 ? (
          <div className="panel muted">No notifications yet.</div>
        ) : null}
      </section>
    </>
  );
}
