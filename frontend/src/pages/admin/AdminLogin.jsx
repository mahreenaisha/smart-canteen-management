import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { STORAGE_KEYS } from "../../config";
import { adminLogin } from "../../services/adminService";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const response = await adminLogin(form);
      localStorage.setItem(STORAGE_KEYS.ADMIN_TOKEN, response.token);
      navigate("/admin/menu");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Admin login failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-shell">
      <div className="auth-card panel">
        <h1 className="hero-title">Admin Login</h1>
        <p className="hero-copy">Access the canteen control panel to manage menu items and update order status.</p>
        <form className="form-grid" onSubmit={handleSubmit}>
          <label className="field">
            <span>Email</span>
            <input
              type="email"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              required
            />
          </label>
          <label className="field">
            <span>Password</span>
            <input
              type="password"
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
              required
            />
          </label>
          {error ? <div className="error-text">{error}</div> : null}
          <button className="primary-btn" type="submit" disabled={submitting}>
            {submitting ? "Signing in..." : "Login as Admin"}
          </button>
        </form>
        <p className="muted">
          Student portal? <Link className="subtle-link" to="/login">Go to student login</Link>
        </p>
      </div>
    </div>
  );
}
