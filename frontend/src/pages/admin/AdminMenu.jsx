import { useEffect, useMemo, useState } from "react";
import { STORAGE_KEYS } from "../../config";
import {
  createMenuItem,
  deleteMenuItem,
  getAdminMenu,
  updateMenuItem,
} from "../../services/adminService";

const initialForm = {
  name: "",
  price: "",
  category: "",
  description: "",
  isAvailable: true,
};

export default function AdminMenu() {
  const adminToken = localStorage.getItem(STORAGE_KEYS.ADMIN_TOKEN);
  const [menu, setMenu] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  async function loadMenu() {
    setLoading(true);
    try {
      const data = await getAdminMenu();
      setMenu(data);
      setError("");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to fetch menu");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMenu();
  }, []);

  const itemCount = useMemo(() => menu.length, [menu]);

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    setMessage("");

    try {
      const payload = {
        ...form,
        price: Number(form.price),
      };

      if (editingId) {
        await updateMenuItem(editingId, payload, adminToken);
        setMessage("Menu item updated successfully.");
      } else {
        await createMenuItem(payload, adminToken);
        setMessage("Menu item created successfully.");
      }

      setForm(initialForm);
      setEditingId("");
      await loadMenu();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to save menu item");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id) {
    setError("");
    setMessage("");

    try {
      await deleteMenuItem(id, adminToken);
      setMessage("Menu item deleted successfully.");
      await loadMenu();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to delete menu item");
    }
  }

  function handleEdit(item) {
    setEditingId(item._id);
    setForm({
      name: item.name,
      price: String(item.price),
      category: item.category || "",
      description: item.description || "",
      isAvailable: item.isAvailable !== false,
    });
  }

  return (
    <>
      <section className="hero-card">
        <h1 className="hero-title">Menu Control</h1>
        <p className="hero-copy">Create new dishes, update pricing, and switch availability before students place orders.</p>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">Total Items</div>
            <div className="stat-value">{itemCount}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Editing</div>
            <div className="stat-value">{editingId ? "Yes" : "No"}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Mode</div>
            <div className="stat-value">{editingId ? "Update" : "Create"}</div>
          </div>
        </div>
      </section>

      <div className="layout-grid">
        <section className="panel">
          <h2 className="section-title">{editingId ? "Edit Menu Item" : "Create Menu Item"}</h2>
          <form className="form-grid" onSubmit={handleSubmit}>
            <label className="field">
              <span>Name</span>
              <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
            </label>
            <label className="field">
              <span>Price</span>
              <input
                type="number"
                min="1"
                value={form.price}
                onChange={(event) => setForm({ ...form, price: event.target.value })}
                required
              />
            </label>
            <label className="field">
              <span>Category</span>
              <input value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} />
            </label>
            <label className="field">
              <span>Description</span>
              <input value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />
            </label>
            <label className="toggle-row">
              <input
                type="checkbox"
                checked={form.isAvailable}
                onChange={(event) => setForm({ ...form, isAvailable: event.target.checked })}
              />
              <span>Available for students</span>
            </label>
            {error ? <div className="error-text">{error}</div> : null}
            {message ? <div className="success-text">{message}</div> : null}
            <div className="action-row">
              <button className="primary-btn" type="submit" disabled={submitting}>
                {submitting ? "Saving..." : editingId ? "Update Item" : "Create Item"}
              </button>
              {editingId ? (
                <button
                  className="secondary-btn"
                  type="button"
                  onClick={() => {
                    setEditingId("");
                    setForm(initialForm);
                  }}
                >
                  Cancel Edit
                </button>
              ) : null}
            </div>
          </form>
        </section>

        <aside className="panel">
          <h2 className="section-title">Current Menu</h2>
          {loading ? <div className="muted">Loading menu...</div> : null}
          <div className="stack">
            {menu.map((item) => (
              <article className="order-card" key={item._id}>
                <div className={`pill ${item.isAvailable === false ? "warn" : "live"}`}>
                  {item.isAvailable === false ? "Unavailable" : item.category || "Live"}
                </div>
                <h3 className="card-title">{item.name}</h3>
                <p className="muted mini-text">{item.description || "No description added yet."}</p>
                <div className="order-meta">
                  <strong className="money-strong">Rs. {item.price}</strong>
                  <div className="action-row">
                    <button className="secondary-btn" type="button" onClick={() => handleEdit(item)}>Edit</button>
                    <button className="secondary-btn" type="button" onClick={() => handleDelete(item._id)}>Delete</button>
                  </div>
                </div>
              </article>
            ))}
            {!loading && menu.length === 0 ? <div className="empty-state muted">No menu items yet.</div> : null}
          </div>
        </aside>
      </div>
    </>
  );
}
