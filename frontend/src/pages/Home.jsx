import React from "react";
import Header from "../components/Header";
import HeroSection from "../components/Herosection";
import Footer from "../components/Footer";
import socket from "../socket";

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
