"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Home, MessageSquare, Send, X } from "lucide-react";

export default function MonitoringDevicesPage() {
  // State variables
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  // AI messaging function
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
    <main
      style={{
        textAlign: "center",
        padding: "10px",
        position: "relative",
        height: "100vh",
      }}
    >
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
        <span style={{ color: "var(--inactive-color, #aaa)" }}>Monitoring</span>
      </div>

      {/* Main content area - Add your monitoring devices content here */}
      <div style={{ 
        display: "flex", 
        height: "70vh", 
        margin: "90px auto 10px auto",
        border: "2px solid #ccc",
        borderRadius: "8px",
        overflow: "hidden",
        background: "#f9f9f9",
        maxWidth: "100%",
        position: "relative"
      }}>
        <h2 style={{ color: "#000", margin: "20px auto" }}>Monitoring Devices Dashboard</h2>
        {/* Add your monitoring devices content here */}
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