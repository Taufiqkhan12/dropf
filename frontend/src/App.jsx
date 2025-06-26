import Header from "./components/header";
import HeroSection from "./components/herosection";
import Footer from "./components/footer";
import { useState } from "react";
import ShareFile from "../pages/sharepage";

function App() {
  const [isGuideOpen, setGuideOpen] = useState(false);
  return (
    <>
      <Header setGuideOpen={setGuideOpen} isGuideOpen={isGuideOpen} />
      {/* <HeroSection isGuideOpen={isGuideOpen} setGuideOpen={setGuideOpen} /> */}
      <ShareFile isGuideOpen={isGuideOpen} setGuideOpen={setGuideOpen} />
      {/* <Footer /> */}
    </>
  );
}

export default App;
