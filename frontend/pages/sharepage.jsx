import Header from "../src/components/header";

const ShareFile = ({ isGuideOpen, setGuideOpen }) => {
  return (
    <div className="relative bg-[#121212] min-h-[80vh] w-full flex flex-col items-center justify-center gap-6 sm:gap-8 px-4 sm:px-8 text-center overflow-hidden ">
      {/* HEADING */}
      <div className="room-code text-white">
        <p className="text-lg font-medium leading-[7px]">Room Code</p>
        <h2 className="text-5xl font-medium">4983</h2>
      </div>

      {/* FILE DROP BOX */}

      <div class="h-40 w-7/12 flex flex-col justify-center border border-dashed border-gray-600 rounded-xl">
        <p class="text-[#969696]">Drag &amp; drop a file here or</p>
        <input type="file" class="hidden" id="fileInput" />
        <label for="fileInput" class="underline cursor-pointer text-amber-50">
          Choose a file
        </label>
      </div>

      {/* SEND BUTTON */}

      <div className=" w-7/12 send-btn flex flex-row justify-end  items-center   ">
        <button className="flex justify-end px-10 py-4 text-white bg-green-700 border-2 rounded-full  ">
          Send File
        </button>
      </div>

      {/* QR */}

      <div
        style={{
          height: "auto",
          margin: "0 auto",
          maxWidth: 84,
          width: "100%",
        }}
      >
        <img src="./public/image.png" alt="" />
      </div>
      <p className="mt-5 text-center max-w-sm mx-auto text-neutral-600">
        Scan this QR code to receive the file on another device or join using
        the room code
      </p>

      {/* GUIDE MODAL */}

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

export default ShareFile;
