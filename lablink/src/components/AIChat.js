// components/AIChat.js
"use client";

import { MessageSquare, Send, X } from "lucide-react";
import { useChat } from "../context/ChatContext";

export default function AIChat() {
  const { 
    messages, 
    newMessage, 
    setNewMessage, 
    handleSendMessage, 
    isChatOpen, 
    toggleChat 
  } = useChat();

  return (
    <div style={{ position: "fixed", top: "20px", right: "20px", zIndex: 1100 }}>
      <button
        onClick={toggleChat}
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
                      marginLeft: msg.sender === "user" ? "auto" : "0",
                      color: "black",
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
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage(newMessage)}
              placeholder="Type your question..."
              style={{ flex: 1, padding: "8px", border: "1px solid #ccc", borderRadius: "5px", color: "black" }}
            />
            <button
              onClick={() => handleSendMessage(newMessage)}
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
  );
}