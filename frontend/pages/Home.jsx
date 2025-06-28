import React from "react";
import Header from "../src/components/Header";
import HeroSection from "../src/components/Herosection";
import Footer from "../src/components/Footer";
import socket from "../src/socket";

const Home = ({ setGuideOpen, isGuideOpen }) => {
  socket.on("connection", () => {
    console.log(socket.id);
  });

  socket.on("room-created", ({ uid }) => {
    console.log(uid);
  });

  return (
    <div>
      <Header setGuideOpen={setGuideOpen} isGuideOpen={isGuideOpen} />
      <HeroSection setGuideOpen={setGuideOpen} isGuideOpen={isGuideOpen} />
      <Footer />
    </div>
  );
};

export default Home;
