import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// components & other files
import MemeSearch from "./pages/MemeSearch";
import MemePrediction from "./pages/MemePrediction";
import HeaderNav from "./components/HeaderNav";
import Dashboard from "./pages/Dashboard";
import Meme from "./pages/Meme";
import MemeSearchResult from "./pages/MemeSearchResult";
import MemePredictionResult from "./pages/MemePredictionResult.jsx";
import ImageCaptioning from "./pages/ImageCaptioning.jsx";
import "./global.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HeaderNav />}>
          <Route index element={<Navigate to="/dashboard" />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="memesearch" element={<MemeSearch />} />
          <Route path="memeprediction" element={<MemePrediction />} />
          <Route path="/meme/:id" element={<Meme />} />
          <Route path="memesearchresult" element={<MemeSearchResult />} />
          <Route path="imagecaptioning" element={<ImageCaptioning />} />
          <Route
            path="memepredictionresult"
            element={<MemePredictionResult />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
