"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Home, Send, Eraser, MessageSquare, X } from "lucide-react";

export default function NotesCollaborationPage() {
  const [messages, setMessages] = useState([]); // Chat messages
  const [newMessage, setNewMessage] = useState(""); // New message input
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isErasing, setIsErasing] = useState(false);
  
  // AI Assistant states
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [aiMessages, setAiMessages] = useState([]);
  const [newAiMessage, setNewAiMessage] = useState("");

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

  // Handle AI chat message submission
  const handleSendAiMessage = () => {
    if (newAiMessage.trim() === "") return;

    const userMessage = { sender: "user", text: newAiMessage };
    setAiMessages((prev) => [...prev, userMessage]);

    setTimeout(() => {
      const aiResponse = { sender: "ai", text: `🤖 AI: I found some insights about "${newAiMessage}"!` };
      setAiMessages((prev) => [...prev, aiResponse]);
    }, 1000);

    setNewAiMessage("");
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
      {/* Breadcrumb Navigation (Top-left) */}
      <div style={{ 
        position: "absolute", 
        top: "20px", 
        left: "20px", 
        display: "flex", 
        alignItems: "center", 
        gap: "8px",
        fontSize: "16px",
        zIndex: 10
      }}>
        <Link href="/" style={{ 
          color: "var(--text-color, currentColor)", 
          display: "flex", 
          alignItems: "center",
          textDecoration: "none"
        }}>
          <Home size={20} />
        </Link>
        <span style={{ color: "var(--separator-color, #666)" }}>/</span>
        <Link href="/experiments" style={{ 
          color: "var(--text-color, currentColor)", 
          textDecoration: "none"
        }}>
          Experiments
        </Link>
        <span style={{ color: "var(--separator-color, #666)" }}>/</span>
        <Link href="/experiments/experiment-1" style={{ 
          color: "var(--text-color, currentColor)", 
          textDecoration: "none"
        }}>
          Experiment 1
        </Link>
        <span style={{ color: "var(--separator-color, #666)" }}>/</span>
        <span style={{ color: "var(--inactive-color, #aaa)" }}>Collaboration</span>
      </div>

      
      <p> </p>

      {/* Layout: Whiteboard on Left, Chat on Right */}
      <div style={{ display: "flex", width: "100%", marginTop: "90px", height: "75vh" }}>
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


      {/* AI chat box */}
      <div style={{ position: "fixed", top: "20px", right: "20px", zIndex: 1100 }}>
        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          style={{
            background: "#007bff",
            color: "white",
            border: "none",
            padding: "12px",
            borderRadius: "50%",
            cursor: "pointer",
          }}
        >
          {isChatOpen ? <X size={24} /> : <MessageSquare size={24} />}
        </button>

        {/* AI Chat Window */}
        {isChatOpen && (
          <div
            style={{
              position: "fixed",
              top: "70px",
              right: "20px",
              width: "350px",
              height: "400px",
              background: "white",
              border: "2px solid #ccc",
              borderRadius: "8px",
              display: "flex",
              flexDirection: "column",
              zIndex: 1000,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Chat Header */}
            <div style={{ background: "#007bff", color: "white", textAlign: "center", padding: "10px", fontWeight: "bold" }}>
              🤖 AI Assistant
            </div>

            {/* Chat Messages */}
            <div style={{ flex: 1, padding: "10px", overflowY: "auto", background: "#f9f9f9" }}>
              {aiMessages.length > 0
                ? aiMessages.map((msg, index) => (
                    <p
                      key={index}
                      style={{
                        padding: "8px",
                        background: msg.sender === "user" ? "#d1e7ff" : "#e0e0e0",
                        borderRadius: "5px",
                        maxWidth: "80%",
                        color: "black",
                        alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
                      }}
                    >
                      {msg.text}
                    </p>
                  ))
                : <p style={{ color: "gray", textAlign: "center" }}>Ask me anything about your collaboration!</p>}
            </div>

            {/* Chat Input */}
            <div style={{ display: "flex", padding: "10px", borderTop: "2px solid #ccc" }}>
              <input
                type="text"
                value={newAiMessage}
                onChange={(e) => setNewAiMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendAiMessage()}
                placeholder="Type your question..."
                style={{ flex: 1, padding: "8px", border: "1px solid #ccc", borderRadius: "5px", color: "black" }}
              />
              <button
                onClick={handleSendAiMessage}
                style={{
                  marginLeft: "5px",
                  padding: "8px",
                  background: "#007bff",
                  color: "white",
                  borderRadius: "5px",
                }}
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}