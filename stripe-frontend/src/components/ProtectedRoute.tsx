import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

type Props = {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
};

export default function ProtectedRoute({ children, requireAuth = false, redirectTo = "/"}: Props) {
  const { auth, loading } = useAuth();

  if (!loading) {
    return <div></div>;
  }

  // Protected page
  if (requireAuth && !auth.check_auth) {
    return <Navigate to={redirectTo} replace />;
  }

  // Guest only page
  if (!requireAuth && auth.check_auth) {
    return <Navigate to={redirectTo} replace />;
  }

  return children;
}