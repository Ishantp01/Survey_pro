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
    // Check only for user_token for user authentication
    const savedUserToken = localStorage.getItem("user_token");
    const savedRole = localStorage.getItem("auth_role") as UserRole;

    if (savedUserToken && savedRole === "user") {
      setIsAuthenticated(true);
      setRole("user");
    } else if (localStorage.getItem("admin_token") && savedRole === "admin") {
      setIsAuthenticated(true);
      setRole("admin");
    }
    setIsReady(true);
  }, []);

  const login = (token: string, role: UserRole = "user") => {
    if (role === "admin") {
      localStorage.setItem("admin_token", token);
      localStorage.setItem("auth_role", "admin");
      setIsAuthenticated(true);
      setRole("admin");
      navigate("/admin", { replace: true });
    } else {
      localStorage.setItem("user_token", token);
      localStorage.setItem("auth_role", "user");
      setIsAuthenticated(true);
      setRole("user");
      navigate("/", { replace: true });
    }
  };

  const logout = () => {
    localStorage.removeItem("user_token");
    localStorage.removeItem("admin_token");
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
