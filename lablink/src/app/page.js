"use client"; // Ensures this runs on the client side in Next.js

import Link from "next/link";
import { FlaskConical, Calendar, Settings, MessageSquare, Send, X } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;

    const userMessage = { sender: "user", text: newMessage };
    setMessages((prev) => [...prev, userMessage]);

    setTimeout(() => {
      const aiResponse = { sender: "ai", text: `🤖 AI: I found some insights about "${newMessage}"!` };
      setMessages((prev) => [...prev, aiResponse]);
    }, 1000);

    setNewMessage("");
  };

  return (
    <main style={{ 
      textAlign: "center", 
      padding: "50px", 
      position: "relative", 
      height: "100vh"
    }}>
      {/* Title and Subtitle */}
      <h1>🚀 Welcome to LabLink 🧪</h1>
      {/* <h1>🚀 Hello, Scientists! 🧪</h1> */}
      {/* <p>Welcome to the app that makes your life easier!</p> */}

      {/* Centered Icons for Calendar and Experiments (Swapped) */}
      <div style={{ 
        display: "flex", 
        flexDirection: "column", 
        alignItems: "center", 
        justifyContent: "center", 
        gap: "40px", 
        marginTop: "80px"
      }}>
        <div style={{ display: "flex", gap: "120px" }}>
          {/* Calendar Icon */}
          <div style={{ textAlign: "center" }}>
            <Link href="/calendar">
              <Calendar size={140} color="#0070f3" style={{ cursor: "pointer" }} />
            </Link>
            <p style={{ marginTop: "10px", fontSize: "18px", fontWeight: "bold" }}>Calendar</p>
          </div>

          {/* Experiment Icon */}
          <div style={{ textAlign: "center" }}>
            <Link href="/experiments">
              <FlaskConical size={140} color="#0070f3" style={{ cursor: "pointer" }} />
            </Link>
            <p style={{ marginTop: "10px", fontSize: "18px", fontWeight: "bold" }}>Experiments</p>
          </div>
        </div>
      </div>

      {/* Settings Icon - Placed Below and Between */}
      <div style={{ 
        position: "absolute", 
        bottom: "80px", 
        left: "50%", 
        transform: "translateX(-50%)",
        textAlign: "center"
      }}>
        <Link href="/settings">
          <Settings size={100} color="#555" style={{ cursor: "pointer" }} />
        </Link>
        {/* <p style={{ marginTop: "10px", fontSize: "18px", fontWeight: "bold" }}>Settings</p> */}
      </div>

      {/* Floating AI Chat Button (Top Right) */}
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
              {messages.length > 0
                ? messages.map((msg, index) => (
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
                : <p style={{ color: "gray", textAlign: "center" }}>Ask me anything about your work!</p>}
            </div>

            {/* Chat Input */}
            <div style={{ display: "flex", padding: "10px", borderTop: "2px solid #ccc" }}>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Type your question..."
                style={{ flex: 1, padding: "8px", border: "1px solid #ccc", borderRadius: "5px", color: "black" }}
              />
              <button
                onClick={handleSendMessage}
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
