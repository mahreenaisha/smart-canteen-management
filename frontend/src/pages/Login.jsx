import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { STORAGE_KEYS } from "../config";
import { useAuth } from "../context/useAuth";
import { adminLogin } from "../services/adminService";
import { loginUser } from "../services/authService";

export default function Login({ initialRole = "student" }) {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [role, setRole] = useState(initialRole);
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const title = useMemo(
    () => (role === "admin" ? "Admin Login" : "Student Login"),
    [role],
  );

  const copy = useMemo(
    () => (
      role === "admin"
        ? "Sign in to manage menu items and update order status from the control panel."
        : "Log in to browse the menu, add items to your cart, manage your wallet, and place orders."
    ),
    [role],
  );

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      if (role === "admin") {
        const response = await adminLogin(form);
        localStorage.setItem(STORAGE_KEYS.ADMIN_TOKEN, response.token);
        navigate("/admin/menu");
      } else {
        const response = await loginUser(form);
        login(response.data.token);
        navigate("/menu");
      }
    } catch (requestError) {
      setError(requestError.response?.data?.msg || requestError.response?.data?.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-shell">
      <div className="auth-card panel">
        <div className="role-tabs">
          <button
            className={`tab-btn ${role === "student" ? "active" : ""}`}
            type="button"
            onClick={() => setRole("student")}
          >
            Student
          </button>
          <button
            className={`tab-btn ${role === "admin" ? "active" : ""}`}
            type="button"
            onClick={() => setRole("admin")}
          >
            Admin
          </button>
        </div>
        <h1 className="hero-title">{title}</h1>
        <p className="hero-copy">{copy}</p>
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
            {submitting ? "Logging in..." : role === "admin" ? "Login as Admin" : "Login"}
          </button>
        </form>
        {role === "student" ? (
          <p className="muted">
            New user? <Link to="/register">Register here</Link>
          </p>
        ) : (
          <p className="muted">Admin accounts are managed by the platform setup.</p>
        )}
      </div>
    </div>
  );
}
