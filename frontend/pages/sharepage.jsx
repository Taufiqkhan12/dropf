import Header from "../src/components/Header";
import Footer from "../src/components/Footer";
import { useParams } from "react-router-dom";
import QRCode from "react-qr-code";
import { useDropzone } from "react-dropzone";
import { toast } from "react-hot-toast";
import { useState } from "react";
import { X } from "lucide-react";

// Dropzone Component
const Dropzone = ({ files, setFiles, label, MAX_FILES }) => {
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => handleFileDrop(acceptedFiles),
    multiple: false,
  });

  const handleFileDrop = (acceptedFiles) => {
    if (acceptedFiles.length + files.length > MAX_FILES) {
      toast.error(`You can upload up to ${MAX_FILES} files.`);
      return;
    }

    const validFiles = acceptedFiles.filter((file) => {
      if (file.size > 50 * 1024 * 1024) {
        // 50MB
        toast.error(`${file.name} exceeds 50MB`);
        return false;
      }
      return true;
    });

    const filePreviews = validFiles.map((file) => ({
      file,
      preview: file.type.startsWith("image/")
        ? URL.createObjectURL(file)
        : null,
    }));

    setFiles((prev) => [...prev, ...filePreviews]);

    validFiles.forEach((file) =>
      toast.success(`${file.name} added successfully`)
    );
  };

  const handleRemoveFile = (index) => {
    const updatedFiles = [...files];
    const [removed] = updatedFiles.splice(index, 1);

    if (removed.preview) {
      URL.revokeObjectURL(removed.preview);
    }

    setFiles(updatedFiles);
    toast.success("File removed");
  };

  return (
    <div className="w-full h-full text-white">
      <label className="ml-5 mt-20 font-zodiak text-lg">{label}</label>
      <div
        {...getRootProps({
          className:
            "drag-and-drop-container border-darkgreen w-full lg:w-2/3 mx-auto p-5 border-2 border-dashed rounded-md text-center cursor-pointer mt-10 mb-20",
        })}
      >
        <input {...getInputProps()} />
        <p className="my-3 font-jakarta">
          Drag and drop files here, or click to select
        </p>

        {files.length > 0 && (
          <div className="flex flex-wrap mt-10 gap-4 justify-center">
            {files.map(({ file, preview }, index) => (
              <div
                key={index}
                className="relative w-24 h-24 border rounded-md overflow-hidden bg-neutral-800 flex items-center justify-center"
              >
                {preview ? (
                  <img
                    src={preview}
                    alt={`preview-${index}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <p className="text-xs text-center p-1 truncate">
                    {file.name}
                  </p>
                )}
                <button
                  className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFile(index);
                  }}
                >
                  <X size={15} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const ShareFile = ({ isGuideOpen, setGuideOpen }) => {
  const { roomid } = useParams();
  const [files, setFiles] = useState([]);

  return (
    <>
      <div className="relative bg-[#121212] min-h-[80vh] w-full flex flex-col items-center justify-center gap-6 sm:gap-8 px-4 sm:px-8 text-center overflow-hidden">
        <div className="room-code text-white">
          <p className="text-lg font-medium leading-[7px]">Room Code</p>
          <h2 className="text-5xl font-medium">{roomid}</h2>
        </div>

        <div className="h-40 w-7/12 flex flex-col justify-center">
          <Dropzone
            files={files}
            setFiles={setFiles}
            label="Choose a file to send"
            MAX_FILES={3}
          />
        </div>

        <div className="w-7/12 send-btn flex justify-end">
          <button className="px-10 py-4 text-white bg-green-700 border-2 rounded-full">
            Send File
          </button>
        </div>

        <div
          style={{
            height: "auto",
            margin: "0 auto",
            maxWidth: 84,
            width: "100%",
          }}
        >
          <QRCode
            value={`https://t57b483m-5173.inc1.devtunnels.ms/share/${roomid}`}
            size={84}
            bgColor="#fff"
            fgColor="#6a6a6a"
          />
        </div>
        <p className="mt-5 text-center max-w-sm mx-auto text-neutral-600">
          Scan this QR code to receive the file on another device or join using
          the room code
        </p>

        {isGuideOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50">
            <div
              className="bg-[#1E1E1E] border border-zinc-700 text-white mx-4 my-8 w-full max-w-4xl rounded-2xl p-6 sm:p-8 relative overflow-y-auto"
              style={{ maxHeight: "90vh" }}
            >
              <div className="flex justify-end">
                <button
                  className="text-sm sm:text-base text-zinc-400 hover:text-white cursor-pointer"
                  onClick={() => setGuideOpen(false)}
                >
                  Close
                </button>
              </div>

              <div className="mt-6 space-y-8 sm:space-y-14">
                <div className="space-y-4">
                  <h2 className="text-xl sm:text-2xl font-bold">Sender</h2>
                  {[
                    ["Create Room", "Click Create Room to generate a code."],
                    [
                      "Share Code/QR",
                      "Provide the code or QR to the receiver.",
                    ],
                    ["Send Files", "Upload files and click Send File."],
                    [
                      "File persistency",
                      "Files persist only 10 min after leaving.",
                    ],
                  ].map(([title, desc], i) => (
                    <div
                      key={i}
                      className="text-zinc-300 text-sm sm:text-base flex items-start gap-4"
                    >
                      <span className="flex items-center justify-center w-7 h-7 rounded-full border-2 border-white text-white font-bold text-sm flex-shrink-0">
                        {i + 1}
                      </span>
                      <p className="text-left">{desc}</p>
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  <h2 className="text-xl sm:text-2xl font-bold">Receiver</h2>
                  {[
                    ["Join Room", "Enter the code or scan QR."],
                    ["Download Files", "Click Download to save files."],
                    ["Data loss", "Download files before they disappear."],
                  ].map(([title, desc], i) => (
                    <div
                      key={i}
                      className="text-zinc-300 text-sm sm:text-base flex items-start gap-4"
                    >
                      <span className="flex items-center justify-center w-7 h-7 rounded-full border-2 border-white text-white font-bold text-sm flex-shrink-0">
                        {i + 1}
                      </span>
                      <p className="text-left">{desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default ShareFile;
