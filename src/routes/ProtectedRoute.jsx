import { Navigate, Outlet } from "react-router";
import { useAuth } from "../hooks/useAuth";

export default function ProtectedRoute({ allowedRoles }) {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;

  if (!user) return <Navigate to="/login" replace />;

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
