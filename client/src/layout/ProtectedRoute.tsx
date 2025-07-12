import { useUser } from "@/hooks/services/user";
import { Navigate, Outlet } from "react-router";
import { toast } from "sonner";

const ProtectedRoute = () => {
  const { data: User, isLoading, isError } = useUser();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError || !User?.success) {
    toast.error("LogIn is required.");
    return <Navigate to="/auth" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
