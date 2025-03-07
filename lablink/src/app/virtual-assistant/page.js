"use client";

import { useState } from "react";
import Link from "next/link";
import { Home, MessageSquare, Send, X } from "lucide-react";

export default function VirtualAssistantPage() {
  const [isChatOpen, setIsChatOpen] = useState(false); // Toggle AI chat visibility
  const [messages, setMessages] = useState([]); // Stores chat messages
  const [newMessage, setNewMessage] = useState(""); // New user input

  // Dummy AI response function (can be connected to OpenAI API)
  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;

    // Add user message
    const userMessage = { sender: "user", text: newMessage };
    setMessages((prev) => [...prev, userMessage]);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = { sender: "ai", text: `🤖 AI: I found some insights about "${newMessage}"!` };
      setMessages((prev) => [...prev, aiResponse]);
    }, 1000);

    setNewMessage(""); // Clear input
  };

  return (
    <main style={{ textAlign: "center", padding: "50px", position: "relative", height: "100vh" }}>
      <h1>🤖 Virtual Assistant</h1>
      <p>How can I assist you today?</p>

      {/* Floating AI Chat Button */}
      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "80px",
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
            bottom: "80px",
            right: "40px",
            width: "350px",
            height: "400px",
            background: "white",
            border: "2px solid #ccc",
            borderRadius: "8px",
            display: "flex",
            flexDirection: "column",
          }}
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

      {/* Home Button */}
      <div style={{ position: "absolute", bottom: "20px", right: "20px" }}>
        <Link href="/">
          <button style={{ border: "none", background: "transparent", cursor: "pointer" }}>
            <Home size={32} />
          </button>
        </Link>
      </div>
    </main>
  );
}
