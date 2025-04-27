"use client"; // Ensures this runs on the client side in Next.js

import Link from "next/link";
import { FlaskConical, Calendar, Settings, MessageSquare, Send, X, User, Bell } from "lucide-react"; // Added Bell icon
import { useState } from "react";

export default function Home() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  // Add state for notification
  const [hasNotification, setHasNotification] = useState(true);

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

  const handleLogin = (e) => {
    e.preventDefault();
    // In a real app, you would validate credentials here
    if (username && password) {
      setIsLoggedIn(true);
      setShowLoginModal(false);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
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

      {/* Message Notification Button */}
      <div style={{ position: "fixed", top: "20px", right: "120px", zIndex: 1100 }}>
        <Link href="/experiments/experiment-1/training-guidelines">
          <button
            onClick={() => setHasNotification(false)}
            style={{
              background: hasNotification ? "#ff4757" : "#007bff",
              color: "white",
              border: "none",
              padding: "12px",
              borderRadius: "50%",
              cursor: "pointer",
              position: "relative",
            }}
          >
            <Bell size={24} />
            {hasNotification && (
              <span style={{
                position: "absolute",
                top: "-5px",
                right: "-5px",
                background: "white",
                color: "#ff4757",
                borderRadius: "50%",
                width: "20px",
                height: "20px",
                fontSize: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
                border: "2px solid #ff4757"
              }}>
                1
              </span>
            )}
          </button>
        </Link>
      </div>

      {/* Login/User Profile Button (Top Right) */}
      <div style={{ position: "fixed", top: "20px", right: "70px", zIndex: 1100 }}>
        <button
          onClick={() => isLoggedIn ? handleLogout() : setShowLoginModal(true)}
          style={{
            background: isLoggedIn ? "#28a745" : "#6c757d",
            color: "white",
            border: "none",
            padding: "12px",
            borderRadius: "50%",
            cursor: "pointer",
          }}
        >
          <User size={24} />
        </button>
        {isLoggedIn && (
          <div style={{
            position: "absolute",
            top: "60px",
            right: "0",
            background: "white",
            border: "1px solid #000",
            borderRadius: "4px",
            padding: "5px 10px",
            fontSize: "12px",
            whiteSpace: "nowrap",
            color: "#000",
            fontWeight: "bold",
          }}>
            {username}
          </div>
        )}
      </div>

      {/* Login Modal */}
      {showLoginModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "rgba(0,0,0,0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1200,
        }}>
          <div style={{
            background: "white",
            padding: "20px",
            borderRadius: "8px",
            width: "300px",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
              <h2 style={{ margin: 0, color: "black" }}>Login</h2>
              <button 
                onClick={() => setShowLoginModal(false)}
                style={{ background: "none", border: "none", cursor: "pointer", fontSize: "18px", color: "black"  }}
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleLogin}>
              <div style={{ marginBottom: "15px" }}>
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #000", color: "#000" }}
                  required
                />
              </div>
              <div style={{ marginBottom: "15px" }}>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #000", color: "#000" }}
                  required
                />
              </div>
              <button
                type="submit"
                style={{
                  width: "100%",
                  padding: "10px",
                  background: "#0070f3",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Log In
              </button>
            </form>
          </div>
        </div>
      )}

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