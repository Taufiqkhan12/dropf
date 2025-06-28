import Header from "./components/Header";
import HeroSection from "./components/herosection";
import Footer from "./components/Footer";
import ShareFile from "../pages/Sharepage";
import Home from "../pages/Home";
import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import ReceivedFile from "../pages/Receiverpage";
import { Toaster } from "react-hot-toast";
import { CircleCheck, CircleX } from "lucide-react";

function App() {
  const [isGuideOpen, setGuideOpen] = useState(false);
  return (
    <>
      <Toaster
        toastOptions={{
          className: "text-center",
          style: {
            background: "#faf7f0",
            textAlign: "center",
          },
          success: {
            icon: <CircleCheck className="text-darkgreen" />,
          },
          error: {
            icon: <CircleX className="text-red-600" />,
          },
        }}
      />
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
