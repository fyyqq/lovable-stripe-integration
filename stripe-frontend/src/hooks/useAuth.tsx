import { useEffect, useState, useCallback } from "react";

export const useAuth = () => {
  const [auth, setAuth] = useState({ check_auth: false, user_data: null, loading: true });

  const refreshAuth = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:8000/api/user", {
        method: "GET",
        credentials: "include",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
      });

      const data = await res.json();
      setAuth({ check_auth: !!data.check_auth, user_data: data.user ?? null, loading: false });
    } catch {
      setAuth({ check_auth: false, user_data: null, loading: false });
    }
  }, []);

  useEffect(() => {
    refreshAuth();
  }, [refreshAuth]);

  return { auth, refreshAuth };
};