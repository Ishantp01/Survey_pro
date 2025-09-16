// import React from "react";
// import { Navigate, useLocation } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

// export default function ProtectedRoute({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const { isAuthenticated, isReady } = useAuth();
//   const location = useLocation();

//   if (!isReady) {
//     return null;
//   }

//   if (!isAuthenticated) {
//     return <Navigate to="/login" replace state={{ from: location.pathname }} />;
//   }

//   return <>{children}</>;
// }


import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute = ({ children, requireAdmin = false }: ProtectedRouteProps) => {
  const { isAuthenticated, isAdminAuthenticated, isReady } = useAuth();

  // Wait until auth state is ready
  if (!isReady) {
    return <div>Loading...</div>; // Or a loading spinner
  }

  if (requireAdmin && !isAdminAuthenticated) {
    return <Navigate to="/adminlogin" replace />;
  }

  if (!requireAdmin && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;