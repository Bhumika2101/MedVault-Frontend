import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Loader from "./Loader";
import { ROUTES } from "../../utils/constants";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  const token = localStorage.getItem("token");

  if (loading) {
    return <Loader message="Verifying authentication..." />;
  }

  // Check both user AND token
  if (!user || !token) {
    console.log("🚫 Access denied - No authentication");
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard based on user role
    const redirectPath =
      user.role === "ADMIN"
        ? ROUTES.ADMIN_DASHBOARD
        : user.role === "DOCTOR"
        ? ROUTES.DOCTOR_DASHBOARD
        : ROUTES.PATIENT_DASHBOARD;

    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

export default ProtectedRoute;
