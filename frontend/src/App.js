import { BrowserRouter, Route, Routes } from "react-router-dom";
import Footer from "./components/Footer";
import Header from "./components/Header";
import HomeScreen from "./screens/HomeScreen";
import DetailScreen from "./screens/DetailScreen";
import SignIn from "./screens/SignIn";
import SignUp from "./screens/SignUp";
import ApplySeller from "./screens/ApplySeller";

function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <Header />
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/service/:id" element={<DetailScreen />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/apply-seller" element={<ApplySeller />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
