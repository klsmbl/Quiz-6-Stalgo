import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomeScreen from "./screens/HomeScreen";
import DetailScreen from "./screens/DetailScreen";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/service/:id" element={<DetailScreen />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
