import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";

type AuthContextValue = {
  isAuthenticated: boolean;
  login: (token?: string) => void;
  logout: () => void;
  isReady: boolean;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isReady, setIsReady] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem("auth_token");
    setIsAuthenticated(Boolean(saved));
    setIsReady(true);
  }, []);

  const login = (token?: string) => {
    if (token) {
      localStorage.setItem("auth_token", token);
    } else {
      localStorage.setItem("auth_token", "dummy");
    }
    setIsAuthenticated(true);
    navigate("/", { replace: true });
  };

  const logout = () => {
    localStorage.removeItem("auth_token");
    setIsAuthenticated(false);
    navigate("/login", { replace: true });
  };

  const value = useMemo(
    () => ({ isAuthenticated, login, logout, isReady }),
    [isAuthenticated, isReady]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
