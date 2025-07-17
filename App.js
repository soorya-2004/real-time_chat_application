import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";

// Connect to the backend Socket.IO server
const socket = io("http://localhost:5000");

function App() {
  // State for storing the username, current input message, and list of all messages
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  // Ref to ensure username prompt only runs once
  const hasPrompted = useRef(false);

  useEffect(() => {
    // Prompt the user to enter a username when the app loads
    if (!hasPrompted.current) {
      const name = prompt("Enter your username:");
      setUsername(name || "Anonymous"); // Fallback to 'Anonymous' if empty
      hasPrompted.current = true;
    }

    // Listen for incoming messages from the server
    const handleReceiveMessage = (data) => {
      setMessages((prev) => [...prev, data]);
    };

    socket.on("receive_message", handleReceiveMessage);

    // Clean up the listener when the component unmounts
    return () => {
      socket.off("receive_message", handleReceiveMessage);
    };
  }, []);

  // Send message to the server
  const sendMessage = () => {
    if (message.trim() !== "") {
      const data = {
        username,
        text: message,
        timestamp: new Date().toLocaleTimeString(),
      };
      socket.emit("send_message", data); // Emit message event to server
      setMessage(""); // Clear input field
    }
  };

  return (
    <div style={{ padding: 20, fontFamily: "Arial, sans-serif" }}>
      <h2>💬 Realtime Chat</h2>

      {/* Chat messages display area */}
      <div
        style={{
          marginBottom: 20,
          border: "1px solid #ddd",
          padding: 10,
          height: 300,
          overflowY: "auto",
          background: "#f9f9f9",
        }}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              padding: 8,
              marginBottom: 4,
              borderRadius: 4,
              background: "#fff",
              boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
            }}
          >
            <strong>{msg.username}</strong>{" "}
            <em style={{ fontSize: 12, color: "#888" }}>{msg.timestamp}</em>
            <div>{msg.text}</div>
          </div>
        ))}
      </div>

      {/* Input field and send button */}
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
        style={{ padding: 8, width: 300 }}
      />
      <button onClick={sendMessage} style={{ padding: 8, marginLeft: 10 }}>
        Send
      </button>
    </div>
  );
}

export default App;
// This code sets up a simple React chat application that connects to a Socket.IO server.
// It allows users to enter a username, send messages in real-time, and display all messages
// in a chat window. The messages include the username, text, and timestamp.
// The UI is styled with basic CSS for a clean look.
// Make sure to run the backend server on http://localhost:5000 for this to work
// properly. You can customize the styles and functionality as needed.
// To run this code, ensure you have the necessary dependencies installed:
// npm install socket.io-client react react-dom
// Then, you can start your React app using `npm start` or your preferred method.
// Ensure your backend server is running and listening for connections on the specified port.