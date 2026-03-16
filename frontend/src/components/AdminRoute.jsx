import { Navigate, useLocation } from "react-router-dom";
import { getCurrentUser } from "../utils/storage";

function AdminRoute({ children }) {
  const location = useLocation();
  const currentUser = getCurrentUser();

  if (!currentUser) {
    return <Navigate to="/signin" replace state={{ from: location.pathname }} />;
  }

  if (currentUser.role !== "Admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default AdminRoute;