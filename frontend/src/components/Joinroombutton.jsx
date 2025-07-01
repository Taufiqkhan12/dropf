import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom"; // useNavigate hook for redirection

const JoinRoomButton = () => {
  const [buttonText, setButtonText] = useState("Join Room");
  const [roomCode, setRoomCode] = useState("");
  const [isRedirecting, setIsRedirecting] = useState(false); // State to manage redirection delay
  const navigate = useNavigate(); // useNavigate hook for redirection

  const inputRef = useRef(null); // Create a ref for the input field

  const handleJoinRoom = () => {
    // Change button text to input field when clicked
    setButtonText("");
  };

  const handleCodeChange = (e) => {
    const value = e.target.value;
    // Allow only 4 digits
    if (/^\d{0,4}$/.test(value)) {
      setRoomCode(value);
    }
  };

  // Auto redirect once the room code has exactly 4 digits with a delay
  useEffect(() => {
    if (roomCode.length === 4 && !isRedirecting) {
      setIsRedirecting(true); // Start the redirection process
      setTimeout(() => {
        navigate(`/${roomCode}`); // Redirect to the desired URL with room code
      }, 300); // Delay the redirect by 500ms (0.5 seconds)
    }
  }, [roomCode, isRedirecting, navigate]);

  // Handle clicks outside the input to revert the button text
  useEffect(() => {
    // Function to check if click is outside the input
    const handleClickOutside = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setButtonText("Join Room"); // Revert to original text when clicked outside
      }
    };

    // Add event listener for click events
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup the event listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []); // Empty dependency array ensures this effect runs only once after the component mounts

  return (
    <div>
      <button
        onClick={handleJoinRoom}
        className="border-2 border-white text-white font-medium text-lg text-[16px] sm:text-lg py-2 sm:py-3 px-6 sm:px-8 rounded-full"
      >
        {buttonText === "Join Room" ? (
          "Join Room"
        ) : (
          <input
            ref={inputRef} // Attach the ref to the input element
            type="text"
            value={roomCode}
            onChange={handleCodeChange}
            maxLength="4"
            placeholder="Enter room code"
            className="outline-none w-[142px] md:w-full"
            autoFocus
          />
        )}
      </button>
    </div>
  );
};

export default JoinRoomButton;
