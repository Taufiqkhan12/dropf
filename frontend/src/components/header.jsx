import { useState } from "react";
import { Link } from "react-router-dom";
import Guide from "./Guide";

const Header = () => {
  const [openGuide, setOpenGuide] = useState(false);

  return (
    <header className="bg-[#121212] h-[20vh] flex items-center justify-between px-4 sm:px-12 md:px-20">
      {/* Logo */}
      <Link to="/">
        <span className="text-gradient-mint text-2xl sm:text-3xl md:text-4xl font-semibold">
          Dropf
        </span>
      </Link>

      {/* Guide Button */}
      <button
        onClick={() => setOpenGuide(!openGuide)}
        className="text-gray-200 text-sm sm:text-base md:text-lg cursor-pointer"
      >
        Guide
      </button>

      {/* Sliding Guide Panel */}
      <div
        className={`fixed top-0 right-0 h-screen bg-[#151515] text-green-700 z-50 border-l-2 border-green-700
        transition-transform duration-500 ease-in-out transform overflow-y-auto ${
          openGuide ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ width: "100%", maxWidth: "448px" }}
      >
        {/* Close Button */}
        <div className="mt-12 mx-6 lg:mx-12 sm:text-lg flex justify-end text-[#b4b4b4] ">
          <button
            className="cursor-pointer"
            onClick={() => setOpenGuide(false)}
          >
            Close
          </button>
        </div>
        <Guide />
      </div>
    </header>
  );
};

export default Header;
