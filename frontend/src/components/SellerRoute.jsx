import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

function SellerRoute({ children }) {
  const location = useLocation();
  const currentUser = useSelector((state) => state.auth.currentUser);

  if (!currentUser) {
    return <Navigate to="/signin" replace state={{ from: location.pathname }} />;
  }

  if (currentUser.role !== "Seller") {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default SellerRoute;