import { useEffect, useState } from "react";
import { useAuth } from "../context/useAuth";
import { createWallet, getWallet } from "../services/walletService";

export default function Wallet() {
  const { profile, token } = useAuth();
  const [wallet, setWallet] = useState(null);
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadWallet() {
      if (!profile?.studentId) {
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const data = await getWallet(profile.studentId, token);
        setWallet(data);
        setError("");
      } catch (requestError) {
        if (requestError.response?.status !== 404) {
          setError(requestError.response?.data?.message || "Unable to fetch wallet");
        } else {
          setWallet(null);
        }
      } finally {
        setLoading(false);
      }
    }

    loadWallet();
  }, [profile?.studentId, token]);

  async function handleCreateOrTopUp(event) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    setMessage("");

    try {
      const response = await createWallet(
        {
          studentId: profile.studentId,
          balance: Number(amount),
        },
        token,
      );

      setWallet(response.wallet);
      setAmount("");
      setMessage(response.message);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to update wallet");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="layout-grid">
      <section className="panel">
        <h1 className="hero-title">Wallet</h1>
        <p className="hero-copy">Add funds</p>
        <form className="form-grid" onSubmit={handleCreateOrTopUp}>
          <label className="field">
            <span>Amount to add</span>
            <input
              type="number"
              min="1"
              step="1"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              required
            />
          </label>
          {error ? <div className="error-text">{error}</div> : null}
          {message ? <div className="success-text">{message}</div> : null}
          <button className="primary-btn" type="submit" disabled={submitting || !profile?.studentId}>
            {submitting ? "Saving..." : wallet ? "Add Money" : "Create Wallet"}
          </button>
        </form>
      </section>

      <aside className="panel">
        <h2>Current Balance</h2>
        {loading ? <div className="muted">Loading wallet...</div> : null}
        {!loading ? (
          <div className="wallet-balance">
            <span className="muted">{profile?.studentId || "Student"}</span>
            <strong>Rs. {wallet?.balance || 0}</strong>
          </div>
        ) : null}
      </aside>
    </div>
  );
}
