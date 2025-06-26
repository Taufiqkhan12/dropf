import React from "react";
import Header from "../src/components/Header";
import HeroSection from "../src/components/Herosection";
import Footer from "../src/components/Footer";

const Home = ({ setGuideOpen, isGuideOpen }) => {
  return (
    <div>
      <Header setGuideOpen={setGuideOpen} isGuideOpen={isGuideOpen} />
      <HeroSection setGuideOpen={setGuideOpen} isGuideOpen={isGuideOpen} />
      <Footer />
    </div>
  );
};

export default Home;
