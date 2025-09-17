import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";

type UserRole = "user" | "admin" | null;

type AuthContextValue = {
  isAuthenticated: boolean;
  role: UserRole;
  login: (token: string, role?: UserRole) => void;
  logout: () => void;
  isReady: boolean;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState<UserRole>(null);
  const [isReady, setIsReady] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedToken = localStorage.getItem("auth_token");
    const savedRole = localStorage.getItem("auth_role") as UserRole;

    if (savedToken && savedRole) {
      setIsAuthenticated(true);
      setRole(savedRole);
    }
    setIsReady(true);
  }, []);

  const login = (token: string, role: UserRole = "user") => {
    localStorage.setItem("auth_token", token);
    localStorage.setItem("auth_role", role);

    setIsAuthenticated(true);
    setRole(role);

    if (role === "admin") {
      navigate("/admin", { replace: true });
    } else {
      navigate("/", { replace: true });
    }
  };

  const logout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_role");
    setIsAuthenticated(false);
    setRole(null);
    navigate("/login", { replace: true });
  };

  const value = useMemo(
    () => ({
      isAuthenticated,
      role,
      login,
      logout,
      isReady,
    }),
    [isAuthenticated, role, isReady]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
