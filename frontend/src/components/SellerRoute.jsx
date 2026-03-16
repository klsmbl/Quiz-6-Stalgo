import { Navigate, useLocation } from "react-router-dom";
import { getCurrentUser } from "../utils/storage";

function SellerRoute({ children }) {
  const location = useLocation();
  const currentUser = getCurrentUser();

  if (!currentUser) {
    return <Navigate to="/signin" replace state={{ from: location.pathname }} />;
  }

  if (currentUser.role !== "Seller") {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default SellerRoute;