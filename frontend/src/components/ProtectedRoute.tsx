import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute = ({
  children,
  requireAdmin = false,
}: ProtectedRouteProps) => {
  const { isAuthenticated, role, isReady } = useAuth();
  const location = useLocation();

  // Wait until auth state is ready
  if (!isReady) {
    return <div>Loading...</div>;
  }

  if (requireAdmin && role !== "admin") {
    return <Navigate to="/adminlogin" replace />;
  }

  // Only for form links: check only user_token
  if (
    !requireAdmin &&
    location.pathname.startsWith("/form/")
  ) {
    const userToken = localStorage.getItem("user_token");
    if (!userToken) {
      localStorage.setItem("redirect_after_login", location.pathname);
      return <Navigate to="/login" replace />;
    }
    // If user_token exists, allow access
    return <>{children}</>;
  }

  // For other user routes
  if (!requireAdmin && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
