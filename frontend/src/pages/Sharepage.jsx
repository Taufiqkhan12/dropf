<<<<<<< HEAD
import { useState, useEffect, useMemo, useRef } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import QRCode from "react-qr-code";

const SharePage = () => {
  const { roomId } = useParams();
  const socket = useMemo(() => io(import.meta.env.VITE_SOCKET_IO_URL), []);
  const [file, setFile] = useState(null);
  const [fileProgress, setFileProgress] = useState(0);
  const [receivedFiles, setReceivedFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false); // Track drag status
  const fileInputRef = useRef(null);
  const [roomLink, setRoomLink] = useState("");
  const [roomNotFound, setRoomNotFound] = useState(false); // Room existence status
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    setRoomLink(`https://airbin.vercel.app/${roomId}`);

    socket.on("connect", () => {
      console.log("Connected to server:", socket.id);
      setIsChecking(false);
    });

    socket.emit("join-room", { uid: roomId });

    // Handle room-not-found event
    socket.on("room-not-found", (message) => {
      console.error(message);
      setRoomNotFound(true); // Update state to indicate room does not exist
      setIsChecking(roomNotFound);
    });

    // Handle room closure
    socket.on("room-closed", () => {
      alert("Room has been closed due to timeout.");
      socket.disconnect();
    });

    // Handle file metadata
    socket.on("fs-meta", (metadata) => {
      console.log("File metadata received:", metadata);
      setReceivedFiles((prevFiles) => [
        { ...metadata, data: [], inProgress: true },
        ...prevFiles,
      ]);
    });

    // Handle file chunks
    socket.on("fs-share", (chunk) => {
      handleReceivedChunk(chunk);
    });

    // Handle file-too-large error
    socket.on("file-too-large", (message) => {
      console.log(message); // when file exceeds size
    });

    return () => {
      socket.off("room-not-found");
      socket.off("fs-meta");
      socket.off("fs-share");
      socket.off("room-closed");
      socket.off("file-too-large");
    };
  }, [roomId, socket]);

  const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500MB in bytes

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    // Check if the file is larger than 500MB
    if (selectedFile.size > MAX_FILE_SIZE) {
      alert("The file is too large. Please select a file smaller than 500MB.");
      return;
    }

    setFile(selectedFile);
    setFileProgress(0);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const droppedFile = e.dataTransfer.files[0];

    if (droppedFile) {
      // Check if the file is larger than 500MB
      if (droppedFile.size > MAX_FILE_SIZE) {
        alert(
          "The file is too large. Please select a file smaller than 500MB."
        );
        setIsDragging(false);
        return;
      }

      setFile(droppedFile);
      setFileProgress(0);
    }
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const sendFile = () => {
    if (!file) return;

    let chunkSize = 1024; // Default chunk size of 1KB
    if (file.size > 100 * 1024 * 1024) {
      // Files larger than 100MB
      chunkSize = 5 * 1024 * 1024; // 5MB chunks
    }

    let offset = 0;

    const metadata = {
      filename: file.name,
      mimeType: file.type,
      totalBufferSize: file.size,
      bufferSize: chunkSize,
    };

    // Send metadata to receiver
    socket.emit("file-meta", { uid: roomId, metadata });

    const reader = new FileReader();

    const uploadChunk = () => {
      const chunk = file.slice(offset, offset + chunkSize);
      reader.onload = () => {
        const buffer = new Uint8Array(reader.result);
        socket.emit("file-raw", { uid: roomId, buffer });

        offset += chunkSize;
        setFileProgress(Math.round((offset / file.size) * 100));

        if (offset < file.size) {
          uploadChunk();
        } else {
          setFile(null);
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        }
      };
      reader.readAsArrayBuffer(chunk);
    };

    uploadChunk();
  };

  const handleReceivedChunk = (chunk) => {
    setReceivedFiles((prevFiles) => {
      const updatedFiles = [...prevFiles];
      const currentFile = updatedFiles.find((file) => file.inProgress);

      if (currentFile) {
        currentFile.data.push(chunk);

        const totalSize = currentFile.data.reduce(
          (size, chunk) => size + chunk.byteLength,
          0
        );
        if (totalSize >= currentFile.totalBufferSize) {
          currentFile.inProgress = false;
          currentFile.data = new Blob(currentFile.data, {
            type: currentFile.mimeType,
          });
        }
      }

      return updatedFiles;
    });
  };

  const downloadFile = (fileData, filename) => {
    const url = URL.createObjectURL(fileData);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename || "downloaded-file";
    link.click();
    URL.revokeObjectURL(url);
  };

  if (isChecking)
    return (
      <div className="h-[100vh] w-full flex justify-center items-center bg-[#121212]">
        <div className="hero-section"></div>
        <div className="hero-section-animation"></div>
        <div className="hero-section-animation-2"></div>
      </div>
    );

  if (roomNotFound) {
    return (
      <div className="h-[100vh] w-full bg-[#121212] text-white flex justify-center pt-24 px-4">
        <div className="max-w-2xl text-center">
          <p className="text-5xl text-green-700 font-bold">{roomId}</p>
          <h1 className="text-2xl font-medium sm:font-semibold text-red-500 mt-2">
            Room Not Found
          </h1>
          <p className="mt-4 sm:text-lg text-gray-400">
            The room you are trying to join does not exist or has expired.
            Please verify the room code or create a new room.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212] text-white px-4 pb-12">
      <div className="max-w-2xl mx-auto">
        <div className=" flex flex-col justify-center items-center">
          <p className="text-lg font-medium leading-[7px]">Room Code</p>
          <h2 className="text-5xl font-medium">{roomId}</h2>
        </div>

        {/* Drag-and-drop area */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`h-[140px] mt-12 flex flex-col justify-center border-dashed border-2 text-center rounded-md cursor-pointer transition duration-200 ${
            isDragging
              ? "bg-green-700/10 border-green-700 animate-pulse"
              : "bg-[#1e1e1e]"
          } ${file ? "border-gray-500" : "border-gray-700"} tracking-tight`}
        >
          {!file ? (
            <>
              <p className="text-gray-400">Drag & drop a file here or</p>
              <input
                type="file"
                onChange={handleFileChange}
                className="hidden"
                id="fileInput"
                ref={fileInputRef}
              />
              <label
                htmlFor="fileInput"
                className="underline cursor-pointer text-white"
              >
                Choose a file
              </label>
            </>
          ) : (
            <p className="mt-2 text-lg font-medium">{file.name}</p>
          )}
        </div>

        {/* Send File Button & Progress */}
        <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
          {fileProgress > 0 && fileProgress < 100 && (
            <p className="text-base">
              File Transfer Progress: <strong>{fileProgress}%</strong>
            </p>
          )}
          <button
            onClick={sendFile}
            disabled={!file || fileProgress}
            className="bg-green-700 text-white border-2 border-white font-medium text-[16px] sm:text-lg py-2 px-6 rounded-full hover:bg-white hover:text-black transition-all disabled:bg-green-700/60 disabled:text-white disabled:cursor-not-allowed"
          >
            Send File
          </button>
        </div>

        {/* Display Received Files */}
        <div className="mt-12">
          {receivedFiles.length > 0 ? (
            <h3 className="text-lg">Received Files:</h3>
          ) : (
            <>
              <div
                style={{
                  height: "auto",
                  margin: "0 auto",
                  maxWidth: 84,
                  width: "100%",
                }}
              >
                <QRCode
                  value={roomLink}
                  size={84}
                  bgColor="#fff"
                  fgColor="#6a6a6a"
                />
              </div>
              <p className="mt-5 text-center max-w-sm mx-auto text-gray-400">
                Scan this QR code to receive the file on another device or join
                using the room code
              </p>
            </>
          )}
          {receivedFiles.map((file, index) => (
            <div
              key={index}
              className="mt-4 border border-gray-600 p-3 rounded-md flex justify-between items-center"
            >
              <p className="text-white">
                <strong>{file.filename || "Unknown File"}</strong>
              </p>
              {!file.inProgress && file.data ? (
                <button
                  onClick={() => downloadFile(file.data, file.filename)}
                  className="bg-green-700 border-2 border-white font-medium text-[16px] sm:text-lg py-2 px-6 rounded-full hover:bg-white hover:text-black transition-colors"
                >
                  Download
                </button>
              ) : (
                <p className="font-medium text-[16px] sm:text-lg py-2 px-6 rounded-full transition-all animate-pulse text-gray-400">
                  Receiving...
                </p>
              )}
            </div>
          ))}
        </div>
=======
import Footer from "../components/Footer";
import { useParams } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import { toast } from "react-hot-toast";
import { useState } from "react";
import { X } from "lucide-react";
import socket from "../socket";
import QRCode from "react-qr-code";

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

        {files?.length > 0 && (
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
>>>>>>> 692023198cf15814e6780b44b4e984ccad1b3646
      </div>
    </div>
  );
};

<<<<<<< HEAD
export default SharePage;
=======
const ShareFile = ({ isGuideOpen, setGuideOpen }) => {
  const { roomid } = useParams();
  const [files, setFiles] = useState([]);

  const handleSendFiles = async () => {
    if (!files?.length) return toast.error("No file selected");

    const file = files[0].file;

    const reader = new FileReader();

    reader.onload = () => {
      const fileData = {
        name: file.name,
        type: file.type,
        size: file.size,
        content: reader.result, // base64 string
      };

      socket.emit("send-files", {
        roomId: roomid,
        file: fileData,
      });

      toast.success("File sent!");
    };

    reader.onerror = () => {
      toast.error("Failed to read file.");
    };

    reader.readAsDataURL(file); // base64 encoding
  };

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
            MAX_FILES={1}
          />
        </div>

        <div className="w-7/12 send-btn flex justify-end">
          <button
            className="px-10 py-4 text-white bg-green-700 border-2 rounded-full"
            onClick={() => handleSendFiles()}
          >
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
>>>>>>> 692023198cf15814e6780b44b4e984ccad1b3646
