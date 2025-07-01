<<<<<<< HEAD
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SharePage from "./pages/SharePage";
import Header from "./components/Header";
=======
import Header from "../src/components/Header";
import Footer from "../src/components/Footer";
import ShareFile from "../src/pages/sharepage";
import Home from "../src/pages/Home";
import ReceiverPage from "../src/pages/Receiverpage";
import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { CircleCheck, CircleX } from "lucide-react";
>>>>>>> 692023198cf15814e6780b44b4e984ccad1b3646

export default function App() {
  return (
    <>
<<<<<<< HEAD
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/:roomId" element={<SharePage />} />
        </Routes>
      </main>
=======
      <Toaster
        toastOptions={{
          success: {
            icon: <CircleCheck className="text-green-600" />,
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
              <Footer />
            </>
          }
        />
        <Route path="/download/:roomId" element={<ReceiverPage />} />
      </Routes>
>>>>>>> 692023198cf15814e6780b44b4e984ccad1b3646
    </>
  );
}
