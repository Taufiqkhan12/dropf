import Header from "./components/Header";
import HeroSection from "./components/Herosection";
import Footer from "./components/Footer";
import { useState } from "react";
import ShareFile from "../pages/Sharepage";
import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";

function App() {
  const [isGuideOpen, setGuideOpen] = useState(false);
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <Home isGuideOpen={isGuideOpen} setGuideOpen={setGuideOpen} />
          }
        />
        <Route
          path="/share"
          element={
            <ShareFile isGuideOpen={isGuideOpen} setGuideOpen={setGuideOpen} />
          }
        />
      </Routes>
      {/* <HeroSection isGuideOpen={isGuideOpen} setGuideOpen={setGuideOpen} /> */}
      {/* <ShareFile isGuideOpen={isGuideOpen} setGuideOpen={setGuideOpen} /> */}
      {/* <Footer /> */}
    </>
  );
}

export default App;
