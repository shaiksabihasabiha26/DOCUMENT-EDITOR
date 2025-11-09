// Importing necessary React and Socket.IO libraries
import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

// Connecting frontend (client) to backend server
// Make sure the backend (Express + Socket.IO) is running on port 5000
const socket = io("http://localhost:5000");

function App() {
  // State to store text entered in the editor
  const [text, setText] = useState("");

  // useEffect runs once when the component loads
  useEffect(() => {
    // Listen for 'doc-update' events from the server
    // Whenever another user changes the document, this will update our local state
    socket.on("doc-update", (data) => {
      setText(data); // Update text in the textarea
    });

    // Cleanup function — removes the event listener when component unmounts
    return () => socket.off("doc-update");
  }, []);

  // Function runs whenever user types something in the textarea
  const handleChange = (e) => {
    const newText = e.target.value;
    setText(newText);                 // Update local text immediately
    socket.emit("doc-update", newText); // Send updated text to the server
  };

  return (
    <div style={{ padding: "20px" }}>
      {/* App Heading */}
      <h2>📝 Real-Time Collaborative Editor</h2>

      {/* Textarea for typing and viewing shared content */}
      <textarea
        value={text}                   // Display the latest text
        onChange={handleChange}        // Update on every key press
        rows="15"
        cols="80"
        placeholder="Start typing..."
        style={{
          fontSize: "16px",
          fontFamily: "monospace",
          padding: "10px",
          borderRadius: "8px",
          border: "1px solid #ccc",
          width: "100%",
          resize: "none"
        }}
      />
    </div>
  );
}

export default App;
