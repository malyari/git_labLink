"use client";

import Link from "next/link";
import { useState } from "react";
import { Home, Camera, BookOpen, BarChart2, MessageSquare, Activity, Send, X, FileText, Users } from "lucide-react"; 

export default function Experiment1Page() {

  // State for chat functionality
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  // Function that handles sending messages
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
      height: "100vh",
      backgroundColor: "#121212",
      color: "white",
      fontFamily: "Arial, sans-serif"
    }}>
      {/* Breadcrumb Navigation (Top-left) */}
      <div style={{ 
        position: "absolute", 
        top: "20px", 
        left: "20px", 
        display: "flex", 
        alignItems: "center", 
        gap: "8px",
        fontSize: "16px"
      }}>
        <Link href="/" style={{ 
          color: "white", 
          display: "flex", 
          alignItems: "center",
          textDecoration: "none"
        }}>
          <Home size={20} />
        </Link>
        <span style={{ color: "#666" }}>/</span>
        <Link href="/experiments" style={{ 
          color: "white", 
          textDecoration: "none"
        }}>
          Experiments
        </Link>
        <span style={{ color: "#666" }}>/</span>
        <span style={{ color: "#aaa" }}>Experiment 1</span>
      </div>

      {/* Chat Button (Top-right) */}
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
      </div>

      {/* Visual Tab Grid with Icons and Labels */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(3, 1fr)", 
        gap: "30px", 
        maxWidth: "900px", 
        margin: "90px auto 0 auto"
      }}>
        {/* Photos Tab */}
        <Link href="/experiments/experiment-1/equipment-setup" style={{ textDecoration: "none" }}>
          <div style={{ 
            display: "flex", 
            flexDirection: "column", 
            alignItems: "center",
            padding: "25px", 
            backgroundColor: "#1e1e1e", 
            borderRadius: "12px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
            transition: "transform 0.2s, box-shadow 0.2s",
            cursor: "pointer"
          }}>
            <Camera size={64} color="#70d6ff" />
            <span style={{ 
              marginTop: "15px", 
              fontSize: "18px", 
              fontWeight: "bold",
              color: "white"
            }}>Photos</span>
          </div>
        </Link>

        {/* Trainings Tab */}
        <Link href="/experiments/experiment-1/training-guidelines" style={{ textDecoration: "none" }}>
          <div style={{ 
            display: "flex", 
            flexDirection: "column", 
            alignItems: "center",
            padding: "25px", 
            backgroundColor: "#1e1e1e", 
            borderRadius: "12px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
            transition: "transform 0.2s, box-shadow 0.2s",
            cursor: "pointer"
          }}>
            <BookOpen size={64} color="#00008B" />
            <span style={{ 
              marginTop: "15px", 
              fontSize: "18px", 
              fontWeight: "bold",
              color: "white"
            }}>Trainings</span>
          </div>
        </Link>

        {/* Data/Analysis Tab */}
        <Link href="/experiments/experiment-1/data-analysis" style={{ textDecoration: "none" }}>
          <div style={{ 
            display: "flex", 
            flexDirection: "column", 
            alignItems: "center",
            padding: "25px", 
            backgroundColor: "#1e1e1e", 
            borderRadius: "12px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
            transition: "transform 0.2s, box-shadow 0.2s",
            cursor: "pointer"
          }}>
            <BarChart2 size={64} color="#ff9770" />
            <span style={{ 
              marginTop: "15px", 
              fontSize: "18px", 
              fontWeight: "bold",
              color: "white"
            }}>Data/Analysis</span>
          </div>
        </Link>

        {/* Notes Tab (New separate tab) */}
        <Link href="/experiments/experiment-1/notes" style={{ textDecoration: "none" }}>
          <div style={{ 
            display: "flex", 
            flexDirection: "column", 
            alignItems: "center",
            padding: "25px", 
            backgroundColor: "#1e1e1e", 
            borderRadius: "12px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
            transition: "transform 0.2s, box-shadow 0.2s",
            cursor: "pointer"
          }}>
            <FileText size={64} color="#70ff94" />
            <span style={{ 
              marginTop: "15px", 
              fontSize: "18px", 
              fontWeight: "bold",
              color: "white"
            }}>Notes</span>
          </div>
        </Link>

        {/* Collaboration Tab (New separate tab) */}
        <Link href="/experiments/experiment-1/collaboration" style={{ textDecoration: "none" }}>
          <div style={{ 
            display: "flex", 
            flexDirection: "column", 
            alignItems: "center",
            padding: "25px", 
            backgroundColor: "#1e1e1e", 
            borderRadius: "12px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
            transition: "transform 0.2s, box-shadow 0.2s",
            cursor: "pointer"
          }}>
            <Users size={64} color="#bf70ff" />
            <span style={{ 
              marginTop: "15px", 
              fontSize: "18px", 
              fontWeight: "bold",
              color: "white"
            }}>Collaboration</span>
          </div>
        </Link>

        {/* Monitoring Devices Tab */}
        <Link href="/experiments/experiment-1/monitoring-devices" style={{ textDecoration: "none" }}>
          <div style={{ 
            display: "flex", 
            flexDirection: "column", 
            alignItems: "center",
            padding: "25px", 
            backgroundColor: "#1e1e1e", 
            borderRadius: "12px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
            transition: "transform 0.2s, box-shadow 0.2s",
            cursor: "pointer"
          }}>
            <Activity size={64} color="#e0ff70" />
            <span style={{ 
              marginTop: "15px", 
              fontSize: "18px", 
              fontWeight: "bold",
              color: "white"
            }}>Monitoring Devices</span>
          </div>
        </Link>
      </div>

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

    </main>
  );
}