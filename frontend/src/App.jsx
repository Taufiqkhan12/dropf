import Header from "./components/Header";
import HeroSection from "./components/Herosection";
import Footer from "./components/Footer";
import ShareFile from "../pages/Sharepage";
import Home from "../pages/Home";
import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import ReceivedFile from "../pages/Receiverpage";

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
          path="/share/:roomid"
          element={
            <>
              <Header isGuideOpen={isGuideOpen} setGuideOpen={setGuideOpen} />
              <ShareFile
                isGuideOpen={isGuideOpen}
                setGuideOpen={setGuideOpen}
              />
            </>
          }
        />
        <Route path="/download" element={<ReceivedFile />} />
      </Routes>
      {/* <HeroSection isGuideOpen={isGuideOpen} setGuideOpen={setGuideOpen} /> */}
      {/* <ShareFile isGuideOpen={isGuideOpen} setGuideOpen={setGuideOpen} /> */}
      {/* <Footer /> */}
    </>
  );
}

export default App;
