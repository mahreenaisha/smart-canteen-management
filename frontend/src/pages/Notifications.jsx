import { useEffect, useState } from "react";
import { useAuth } from "../context/useAuth";
import { getNotifications } from "../services/notificationService";

export default function Notifications() {
  const { token } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadNotifications() {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const data = await getNotifications(token);
        if (!isMounted) {
          return;
        }

        setNotifications(data);
        setError("");
      } catch (requestError) {
        if (!isMounted) {
          return;
        }

        setError(requestError.response?.data?.message || "Unable to fetch notifications");
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
  }, [token]);

  return (
    <>
      <section className="hero-card">
        <h1 className="hero-title">Notifications</h1>
        <p className="hero-copy">Live order updates from the notification service, refreshed automatically while you stay on this page.</p>
      </section>

      {error ? <div className="panel error-text">{error}</div> : null}
      {loading ? <div className="panel">Loading notifications...</div> : null}

      <section className="stack">
        {notifications.map((notification) => (
          <article className="order-card" key={notification._id}>
            <div className={`pill ${notification.status === "READY" ? "ready" : notification.status === "CANCELLED" ? "warn" : ""}`}>
              {notification.status}
            </div>
            <h3 className="card-title">{notification.message}</h3>
            <div className="order-meta muted mini-text">
              <span>{notification.orderId}</span>
              <span>
              {new Date(notification.createdAt).toLocaleString()}
              </span>
            </div>
          </article>
        ))}
        {!loading && notifications.length === 0 ? (
          <div className="empty-state muted">No notifications yet.</div>
        ) : null}
      </section>
    </>
  );
}
