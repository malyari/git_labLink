"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Home, Send, Eraser } from "lucide-react";

export default function NotesCollaborationPage() {
  const [messages, setMessages] = useState([]); // Chat messages
  const [newMessage, setNewMessage] = useState(""); // New message input
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isErasing, setIsErasing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx.strokeStyle = "black";
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
    }
  }, []);

  // Handle chat message submission
  const handleSendMessage = () => {
    if (newMessage.trim() !== "") {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setNewMessage(""); // Clear input field
    }
  };

  // Start drawing on the whiteboard
  const startDrawing = (event) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(event.nativeEvent.offsetX, event.nativeEvent.offsetY);
    setIsDrawing(true);
  };

  // Draw or erase based on the selected tool
  const draw = (event) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (isErasing) {
      ctx.strokeStyle = "white"; // Erase with white color
      ctx.lineWidth = 20; // Bigger width for erasing
    } else {
      ctx.strokeStyle = "black"; // Default black for drawing
      ctx.lineWidth = 2;
    }

    ctx.lineTo(event.nativeEvent.offsetX, event.nativeEvent.offsetY);
    ctx.stroke();
  };

  // Stop drawing
  const stopDrawing = () => {
    setIsDrawing(false);
  };

  // Clear the whiteboard
  const clearWhiteboard = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <main style={{ textAlign: "center", padding: "20px", position: "relative", height: "100vh" }}>
      <h1>📝 Notes & Collaboration</h1>
      <p>Share notes, collaborate with team members, and discuss experiment findings.</p>

      {/* Layout: Whiteboard on Left, Chat on Right */}
      <div style={{ display: "flex", width: "100%", marginTop: "20px", height: "75vh" }}>
        {/* Whiteboard Section */}
        <div
          style={{
            width: "65%",
            height: "100%",
            border: "2px solid #ccc",
            borderRadius: "8px",
            background: "white",
            textAlign: "center",
            position: "relative",
            marginRight: "20px",
          }}
        >
          <h3 style={{ color: "black" }}>🖊️ Whiteboard</h3>
          <canvas
            ref={canvasRef}
            width={900}
            height={500}
            style={{ border: "1px solid black", cursor: isErasing ? "crosshair" : "default", width: "100%", height: "85%" }}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
          />
          
          {/* Eraser & Clear Board Buttons */}
          <div style={{ marginTop: "10px", display: "flex", justifyContent: "center", gap: "15px" }}>
            <button
              onClick={() => setIsErasing(!isErasing)}
              style={{
                padding: "8px 15px",
                fontSize: "14px",
                backgroundColor: isErasing ? "red" : "#007bff",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "5px",
              }}
            >
              <Eraser size={16} />
              {isErasing ? "Erasing" : "Eraser"}
            </button>

            <button
              onClick={clearWhiteboard}
              style={{
                padding: "8px 15px",
                fontSize: "14px",
                backgroundColor: "#ff0000",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              🧹 Clear Board
            </button>
          </div>
        </div>

        {/* Chat Section */}
        <div
          style={{
            width: "30%",
            height: "100%",
            border: "2px solid #ccc",
            borderRadius: "8px",
            background: "#f9f9f9",
            textAlign: "left",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "15px",
          }}
        >
          <h3 style={{ color: "black" }}>💬 Team Chat</h3>
          <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "10px",
            borderBottom: "2px solid #ccc",
            height: "80%",
          }}
        >
          {messages.length > 0 ? (
            messages.map((msg, index) => (
              <div
                key={index}
                style={{
                  padding: "8px",
                  background: "#e0e0e0",
                  borderRadius: "5px",
                  marginBottom: "5px",
                  maxWidth: "80%",
                  color: "black", // Ensures messages appear black
                }}
              >
                {msg}
              </div>
            ))
          ) : (
            <p style={{ color: "gray" }}>No messages yet. Start the conversation!</p>
          )}
        </div>


          {/* Chat Input */}
          <div style={{ display: "flex", marginTop: "10px" }}>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSendMessage(); // Calls the function to send message
                }
              }}
              style={{
                flex: 1,
                padding: "10px",
                fontSize: "14px",
                border: "1px solid #ccc",
                borderRadius: "5px",
                color: "black"
              }}
            />
            <button
              onClick={handleSendMessage}
              style={{
                marginLeft: "10px",
                padding: "10px 15px",
                fontSize: "14px",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Back to Experiment 1 Button */}
      <div style={{ position: "absolute", bottom: "20px", left: "20px" }}>
        <Link href="/experiments/experiment-1">
          <button style={{ padding: "12px 20px", fontSize: "16px", cursor: "pointer" }}>
            Back to Experiment 1
          </button>
        </Link>
      </div>

      {/* Home Icon Button */}
      <div style={{ position: "absolute", bottom: "20px", right: "20px" }}>
        <Link href="/">
          <button
            style={{
              border: "none",
              background: "transparent",
              cursor: "pointer",
              fontSize: "24px",
              padding: "10px",
            }}
          >
            <Home size={32} />
          </button>
        </Link>
      </div>
    </main>
  );
}
