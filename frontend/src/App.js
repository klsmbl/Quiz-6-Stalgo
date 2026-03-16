import { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AdminRoute from "./components/AdminRoute";
import ChatbotWidget from "./components/ChatbotWidget";
import PrivateRoute from "./components/PrivateRoute";
import SellerRoute from "./components/SellerRoute";
import Footer from "./components/Footer";
import Header from "./components/Header";
import HomeScreen from "./screens/HomeScreen";
import DetailScreen from "./screens/DetailScreen";
import SignIn from "./screens/SignIn";
import SignUp from "./screens/SignUp";
import ApplySeller from "./screens/ApplySeller";
import SellerDashboard from "./screens/SellerDashboard";
import UserScreen from "./screens/UserScreen";
import UserProfile from "./screens/UserProfile";
import { ensureAdminUser } from "./utils/storage";

function App() {
  useEffect(() => {
    ensureAdminUser();
  }, []);

  return (
    <BrowserRouter>
      <div className="app-shell">
        <Header />
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/service/:id" element={<DetailScreen />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route
            path="/apply-seller"
            element={(
              <PrivateRoute>
                <ApplySeller />
              </PrivateRoute>
            )}
          />
          <Route
            path="/profile"
            element={(
              <PrivateRoute>
                <UserProfile />
              </PrivateRoute>
            )}
          />
          <Route
            path="/seller/dashboard"
            element={(
              <SellerRoute>
                <SellerDashboard />
              </SellerRoute>
            )}
          />
          <Route
            path="/admin/users"
            element={(
              <AdminRoute>
                <UserScreen />
              </AdminRoute>
            )}
          />
        </Routes>
        <Footer />
        <ChatbotWidget />
      </div>
    </BrowserRouter>
  );
}

export default App;
