import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { API, STORAGE_KEYS } from "../config";
import AuthContext from "./authContextValue";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(STORAGE_KEYS.TOKEN));
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      if (!token) {
        setProfile(null);
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${API.GATEWAY}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(response.data);
      } catch {
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        setToken(null);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [token]);

  const value = useMemo(
    () => ({
      token,
      profile,
      loading,
      login(nextToken) {
        localStorage.setItem(STORAGE_KEYS.TOKEN, nextToken);
        setToken(nextToken);
      },
      logout() {
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        localStorage.removeItem(STORAGE_KEYS.CART);
        setToken(null);
        setProfile(null);
      },
    }),
    [loading, profile, token],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
