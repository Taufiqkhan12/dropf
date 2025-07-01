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
    setRoomLink(`https://dropf.vercel.app/${roomId}`);

    socket.on("connect", () => {
      console.log("Connected to server:", socket.id);
      setIsChecking(false);
    });

    socket.emit("join-room", { uid: roomId });

    // Handle room-not-found event
    socket.on("room-not-found", (message) => {
      console.error(message);
      setRoomNotFound(true); // Update state to indicate room does not exist
      setIsChecking(false);
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
                  fgColor="#121212"
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
      </div>
    </div>
  );
};

export default SharePage;
