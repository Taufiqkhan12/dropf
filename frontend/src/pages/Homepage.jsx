import { io } from "socket.io-client";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import JoinRoomButton from "../components/JoinRoomButton";
import Footer from "../components/Footer";

const HomePage = () => {
  const socket = io(import.meta.env.VITE_SOCKET_IO_URL);
  const navigate = useNavigate();

  function handleCreateRoom() {
    const joinId = generateRoomId();
    socket.emit("sender-join", { uid: joinId });
    navigate(`/${joinId}`);
  }

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Sender Connected", socket.id);
    });

    socket.on("room-not-found", (message) => {
      alert(message);
    });
  }, []);

  return (
    <div className="hero-section flex flex-col min-h-screen w-full bg-[#121212] text-center">
      <main className=" flex-grow flex flex-col items-center pt-12 gap-6 sm:gap-8 px-4 sm:px-8">
        <h1 className="text-white text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-wide z-10 leading-tight">
          Drop files.
          <br />
          Collaborate fast.
        </h1>
        <p className="text-[#6a6a6a] text-base sm:text-lg tracking-wider z-10 leading-relaxed">
          Create a room, upload anything,
          <br className="hidden sm:block" /> and collaborate instantly — from
          anywhere.
        </p>

        <div className="hero-section-animation absolute inset-0 pointer-events-none"></div>

        <div className="flex flex-wrap justify-center gap-4 mt-12 z-10">
          <button
            onClick={handleCreateRoom}
            className="bg-green-700 text-white border-2 border-white font-medium text-[16px] sm:text-lg py-2 sm:py-3 px-6 sm:px-8 rounded-full hover:bg-white hover:text-black  transition-all"
          >
            Create Room
          </button>
          <JoinRoomButton />
        </div>
      </main>
      <Footer />
    </div>
  );
};

function generateRoomId() {
  return Math.floor(1000 + Math.random() * 9000);
}

export default HomePage;
