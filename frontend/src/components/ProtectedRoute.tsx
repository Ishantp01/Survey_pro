import React from "react";
import { Navigate } from "react-router-dom";
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

  // Wait until auth state is ready
  if (!isReady) {
    return <div>Loading...</div>; // Or a loading spinner
  }

  if (requireAdmin && role !== "admin") {
    return <Navigate to="/adminlogin" replace />;
  }

  if (!requireAdmin && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
