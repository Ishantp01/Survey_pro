// import React, {
//   createContext,
//   useContext,
//   useEffect,
//   useMemo,
//   useState,
// } from "react";
// import { useNavigate } from "react-router-dom";

// type AuthContextValue = {
//   isAuthenticated: boolean;
//   login: (token?: string) => void;
//   logout: () => void;
//   isReady: boolean;
// };

// const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// export function AuthProvider({ children }: { children: React.ReactNode }) {
//   const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
//   const [isReady, setIsReady] = useState<boolean>(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const saved = localStorage.getItem("auth_token");
//     setIsAuthenticated(Boolean(saved));
//     setIsReady(true);
//   }, []);

//   const login = (token?: string) => {
//     if (token) {
//       localStorage.setItem("auth_token", token);
//     } else {
//       localStorage.setItem("auth_token", "dummy");
//     }
//     setIsAuthenticated(true);
//     navigate("/", { replace: true });
//   };

//   const logout = () => {
//     localStorage.removeItem("auth_token");
//     setIsAuthenticated(false);
//     navigate("/login", { replace: true });
//   };

//   const value = useMemo(
//     () => ({ isAuthenticated, login, logout, isReady }),
//     [isAuthenticated, isReady]
//   );
//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// }

// export function useAuth() {
//   const ctx = useContext(AuthContext);
//   if (!ctx) throw new Error("useAuth must be used within AuthProvider");
//   return ctx;
// }

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";

type AuthContextValue = {
  isAuthenticated: boolean; // Regular user authentication
  isAdminAuthenticated: boolean; // Admin authentication
  login: (token?: string) => void; // Regular user login
  adminLogin: (adminToken?: string) => void; // Admin login
  logout: () => void; // Regular user logout
  adminLogout: () => void; // Admin logout
  isReady: boolean;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] =
    useState<boolean>(false);
  const [isReady, setIsReady] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userToken = localStorage.getItem("auth_token");
    const adminToken = localStorage.getItem("admin_auth_token"); // Separate key for admin
    setIsAuthenticated(Boolean(userToken));
    setIsAdminAuthenticated(Boolean(adminToken));
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

  const adminLogin = (adminToken?: string) => {
    if (adminToken) {
      localStorage.setItem("admin_auth_token", adminToken);
    } else {
      localStorage.setItem("admin_auth_token", "admin_dummy");
    }
    setIsAdminAuthenticated(true);
    navigate("/admin", { replace: true });
  };

  const logout = () => {
    localStorage.removeItem("auth_token");
    setIsAuthenticated(false);
    navigate("/login", { replace: true });
  };

  const adminLogout = () => {
    localStorage.removeItem("admin_auth_token");
    setIsAdminAuthenticated(false);
    navigate("/adminlogin", { replace: true });
  };

  const value = useMemo(
    () => ({
      isAuthenticated,
      isAdminAuthenticated,
      login,
      adminLogin,
      logout,
      adminLogout,
      isReady,
    }),
    [isAuthenticated, isAdminAuthenticated, isReady]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
