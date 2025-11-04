import React, { createContext, useContext, useState, useEffect } from "react";
import { useMutation} from "@apollo/client/react";
import type { User, LoginData, LoginVars } from "../types";
import { LOGIN } from "../apollo/queries";

type AuthContextShape = {
  token: string | null;
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
};

const AuthContext = createContext<AuthContextShape | undefined>(undefined);

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));
  const [user, setUser] = useState<User | null>(() => {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  });
  const [loading, setLoading] = useState(false);

  const [mutateLogin] = useMutation<LoginData, LoginVars>(LOGIN);

  useEffect(() => {
    if (token) localStorage.setItem("token", token); else localStorage.removeItem("token");
    if (user) localStorage.setItem("user", JSON.stringify(user)); else localStorage.removeItem("user");
  }, [token, user]);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await mutateLogin({ variables: { email, password } });
      const d = res.data;
      if (d?.login?.token) {
        setToken(d.login.token);
        setUser(d.login.user);
      } else {
        throw new Error("No token returned");
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      token, user, loading, login, logout,
      isAuthenticated: !!token, isAdmin: user?.role === "ADMIN"
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};