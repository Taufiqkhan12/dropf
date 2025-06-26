// // import { useState, useRef, useEffect } from "react";

// // const HeroSection = () => {
// //   const [isInputVisible, setInputVisible] = useState(false);
// //   const [isJoinRoomVisible, setJoinVisible] = useState(true);

// //   const roomRef = useRef(null); // ref to input + buttons

// //   function handleInputVisibility() {
// //     setInputVisible((value) => !value);
// //     setJoinVisible((value) => !value);
// //   }

// //   useEffect(() => {
// //     const handleClickOutside = (e) => {
// //       if (roomRef.current && !roomRef.current.contains(e.target)) {
// //         setInputVisible(false);
// //         setJoinVisible(true);
// //       }
// //     };

// //     document.addEventListener("mousedown", handleClickOutside);
// //     return () => document.removeEventListener("mousedown", handleClickOutside);
// //   }, []);
// //   return (
// //     <>
// //       <div className="hero-section relative bg-[#121212] h-[70vh] w-full flex flex-col items-center  pt-12 gap-4 overflow-hidden">
// //         <h1 className="text-white text-5xl sm:text-6xl lg:text-7xl font-semibold text-center tracking-wide z-10">
// //           Drop files.
// //           <br />
// //           Collaborate fast.
// //         </h1>
// //         <p className="text-[#6a6a6a] text-center text-lg tracking-wider z-10">
// //           Create a room, upload anything,
// //           <br /> and collaborate instantly — from anywhere.
// //         </p>
// //         <div className="room-btn flex items-center justify-center gap-6 mt-12">
// //           <button className="px-8 py-3 bg-green-700 rounded-4xl text-white border-[1px] border-white cursor-pointer text-lg font-semibold tracking-wide">
// //             Create Room
// //           </button>
// //           <button
// //             className={
// //               isJoinRoomVisible
// //                 ? "px-8 py-3 rounded-4xl text-white border-[1px] font-semibold text-lg tracking-wide cursor-pointer"
// //                 : "hidden px-8 py-3 rounded-4xl text-white border-[1px] font-semibold text-lg tracking-wide cursor-pointer"
// //             }
// //             onClick={() => handleInputVisibility()}
// //           >
// //             Join Room
// //           </button>
// //           <input
// //             type="text"
// //             name="room-code"
// //             id=""
// //             className={
// //               isInputVisible
// //                 ? " border-[1px] border-white px-10 py-4 rounded-full text-white"
// //                 : "hidden border-[1px] border-white px-10 py-4 rounded-full text-white"
// //             }
// //             placeholder="Enter room code"
// //           />
// //         </div>
// //       </div>
// //       <div className="hero-section-animation"></div>
// //     </>
// //   );
// // };

// // export default HeroSection;

// import { useState, useRef, useEffect } from "react";

// const HeroSection = () => {
//   const [isInputVisible, setInputVisible] = useState(false);
//   const roomRef = useRef(null); // reference to the button/input group

//   const handleInputVisibility = () => {
//     setInputVisible(true);
//   };

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (roomRef.current && !roomRef.current.contains(event.target)) {
//         setInputVisible(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   return (
//     <div className="relative bg-[#121212] h-[66vh] w-full flex flex-col items-center pt-12 gap-4 overflow-hidden hero-section">
//       <h1 className="text-white text-5xl sm:text-6xl lg:text-7xl font-semibold text-center tracking-wide z-10">
//         Drop files.
//         <br />
//         Collaborate fast.
//       </h1>
//       <p className="text-[#6a6a6a] text-center text-lg tracking-wider z-10">
//         Create a room, upload anything,
//         <br /> and collaborate instantly — from anywhere.
//       </p>

//       <div
//         ref={roomRef}
//         className="room-btn flex items-center justify-center gap-6 mt-12 z-10"
//       >
//         <button className="px-8 py-3 bg-green-700 rounded-4xl text-white border border-white text-lg font-semibold tracking-wide cursor-pointer">
//           Create Room
//         </button>

//         {!isInputVisible ? (
//           <button
//             onClick={handleInputVisibility}
//             className="px-8 py-3 rounded-4xl text-white border border-white text-lg font-semibold tracking-wide cursor-pointer"
//           >
//             Join Room
//           </button>
//         ) : (
//           <input
//             type="text"
//             placeholder="Enter room code"
//             className="border border-white px-8 py-3 rounded-full text-white bg-transparent"
//           />
//         )}
//       </div>

//       <div className="hero-section-animation"></div>
//     </div>
//   );
// };

// export default HeroSection;

import { useState, useRef, useEffect } from "react";

const HeroSection = ({ isGuideOpen, setGuideOpen }) => {
  const [isInputVisible, setInputVisible] = useState(false);
  const roomRef = useRef(null);

  const handleInputVisibility = () => {
    setInputVisible(true);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (roomRef.current && !roomRef.current.contains(event.target)) {
        setInputVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative bg-[#121212] min-h-[66vh] w-full flex flex-col items-center pt-12 gap-6 sm:gap-8 px-4 sm:px-8 text-center overflow-hidden hero-section">
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

      <div
        ref={roomRef}
        className="room-btn flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mt-8 sm:mt-10 z-10"
      >
        <button className="px-6 sm:px-8 py-2.5 sm:py-3 bg-green-700 rounded-3xl text-white border border-white text-base sm:text-lg font-semibold tracking-wide cursor-pointer">
          Create Room
        </button>

        {!isInputVisible ? (
          <button
            onClick={handleInputVisibility}
            className="px-6 sm:px-8 py-2.5 sm:py-3 rounded-3xl text-white border border-white text-base sm:text-lg font-semibold tracking-wide cursor-pointer"
          >
            Join Room
          </button>
        ) : (
          <input
            type="text"
            placeholder="Enter room code"
            className="border border-white px-6 sm:px-10 py-2.5 sm:py-3 rounded-full text-white bg-transparent text-base sm:text-lg"
          />
        )}
      </div>

      <div className="hero-section-animation absolute inset-0 pointer-events-none"></div>

      {/* GUIDE MODAL WINDOW */}

      <div
        className={
          isGuideOpen
            ? "fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50"
            : "hidden"
        }
      >
        <div
          className="bg-[#1E1E1E] border border-zinc-700 text-white mx-4 my-8 w-full max-w-4xl rounded-2xl p-6 sm:p-8 relative overflow-y-auto"
          style={{ maxHeight: "90vh" }}
        >
          {/* Close Button */}
          <div className="flex justify-end">
            <button
              className="text-sm sm:text-base text-zinc-400 hover:text-white cursor-pointer"
              onClick={() => setGuideOpen((value) => !value)}
            >
              Close
            </button>
          </div>

          {/* Guide Info */}
          <div className="mt-6 space-y-8 sm:space-y-14">
            <div className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold">Sender</h2>
              <div className="text-zinc-300 text-sm sm:text-base flex items-start gap-4">
                <span className="flex items-center justify-center w-7 h-7 rounded-full border-2 border-white text-white font-bold text-sm flex-shrink-0">
                  1
                </span>
                <p className="text-left">
                  Create Room: Click
                  <span className="font-semibold text-green-400 px-1">
                    Create Room
                  </span>
                  to generate a code.
                </p>
              </div>
              <div className="text-zinc-300 text-sm sm:text-base flex items-start gap-4">
                <span className="flex items-center justify-center w-7 h-7 rounded-full border-2 border-white text-white font-bold text-sm flex-shrink-0">
                  2
                </span>
                <p className="text-left">
                  Share Code/QR: Provide the
                  <span className="font-semibold text-green-400 px-1">
                    code or QR
                  </span>
                  to the receiver.
                </p>
              </div>
              <div className="text-zinc-300 text-sm sm:text-base flex items-start gap-4">
                <span className="flex items-center justify-center w-7 h-7 rounded-full border-2 border-white text-white font-bold text-sm flex-shrink-0">
                  3
                </span>
                <p className="text-left">
                  Send Files: Upload files and click
                  <span className="font-semibold text-green-400 px-1">
                    Send File
                  </span>
                  .
                </p>
              </div>
              <div className="text-zinc-300 text-sm sm:text-base flex items-start gap-4">
                <span className="flex items-center justify-center w-7 h-7 rounded-full border-2 border-white text-white font-bold text-sm flex-shrink-0">
                  4
                </span>
                <p className="text-left">
                  File persistency: Files will persist for only
                  <span className="font-semibold text-green-400 px-1">
                    10 minutes
                  </span>
                  after you leave the room
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold">Receiver</h2>
              <div className="text-zinc-300 text-sm sm:text-base flex items-start gap-4">
                <span className="flex items-center justify-center w-7 h-7 rounded-full border-2 border-white text-white font-bold text-sm flex-shrink-0">
                  1
                </span>
                <p className="text-left">
                  Join Room: Enter the
                  <span className="font-semibold text-green-400 px-1">
                    code or scan QR
                  </span>
                </p>
              </div>
              <div className="text-zinc-300 text-sm sm:text-base flex items-start gap-4">
                <span className="flex items-center justify-center w-7 h-7 rounded-full border-2 border-white text-white font-bold text-sm flex-shrink-0">
                  2
                </span>
                <p className="text-left">
                  Download Files:Click
                  <span className="font-semibold text-green-400 px-1">
                    Download
                  </span>
                  to save files.
                </p>
              </div>
              <div className="text-zinc-300 text-sm sm:text-base flex items-start gap-4">
                <span className="flex items-center justify-center w-7 h-7 rounded-full border-2 border-white text-white font-bold text-sm flex-shrink-0">
                  3
                </span>
                <p className="text-left">
                  Data loss:
                  <span className="font-semibold text-green-400 px-1">
                    Download
                  </span>
                  files before they disappear.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
