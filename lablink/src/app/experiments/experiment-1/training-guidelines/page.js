"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Home, MessageSquare, Send, X } from "lucide-react";

export default function TrainingPage() {
  const [trainingText, setTrainingText] = useState(""); // Store user input
  const [completedSteps, setCompletedSteps] = useState([]); // Store completed steps
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const steps = [
    "Gather all required equipment.",
    "Set up the workstation.",
    "Prepare the necessary materials.",
    "Follow safety procedures.",
    "Begin the experiment as per instructions.",
    "Record observations and results.",
    "Clean up and store equipment properly."
  ];

  // Handle step completion
  const toggleStep = (index) => {
    setCompletedSteps((prev) =>
      prev.includes(index) ? prev.filter((step) => step !== index) : [...prev, index]
    );
  };

  // Calculate progress percentage
  const progress = (completedSteps.length / steps.length) * 100;

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
    <main style={{ textAlign: "center", padding: "10px", position: "relative", height: "100vh" }}>
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
        <span style={{ color: "var(--inactive-color, #aaa)" }}>Training</span>
      </div>

      {/* Title & Description */}
      <div style={{ marginTop: "90px" }}>
        
      </div>

      {/* Training Content Layout */}
      <div style={{ display: "flex", width: "100%", marginTop: "20px" }}>
        {/* Left Side: Training Guide + Notes Editor */}
        <div style={{ width: "65%", display: "flex", flexDirection: "column", marginLeft: "20px" }}>
          {/* Step-by-Step Guidelines Window */}
          <div
            style={{
              height: "40vh", // Increased height to fit the progress bar
              padding: "15px",
              border: "2px solid #ccc",
              borderRadius: "8px",
              textAlign: "left",
              overflowY: "auto",
              background: "#f9f9f9",
              color: "black",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between", // Aligns the progress bar at the bottom
            }}
          >
            <div>
              <h3>📌 Step-by-Step Guidelines</h3>
              <ul style={{ padding: 0, listStyleType: "none" }}>
                {steps.map((step, index) => (
                  <li
                    key={index}
                    onClick={() => toggleStep(index)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      cursor: "pointer",
                      marginBottom: "10px",
                      fontSize: "16px",
                      color: "black",
                    }}
                  >
                    {/* Circle Step Number */}
                    <div
                      style={{
                        width: "30px",
                        height: "30px",
                        borderRadius: "50%",
                        border: "2px solid black",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginRight: "10px",
                        background: completedSteps.includes(index) ? "green" : "white",
                        color: completedSteps.includes(index) ? "white" : "black",
                        fontWeight: "bold",
                      }}
                    >
                      {index + 1}
                    </div>
                    {step}
                  </li>
                ))}
              </ul>
            </div>

            {/* Progress Bar (Added at the bottom) */}
            <div
              style={{
                width: "100%",
                background: "white", // Empty progress bar
                height: "15px",
                borderRadius: "10px",
                border: "2px solid black", // Black border
                marginTop: "10px",
                position: "relative",
              }}
            >
              <div
                style={{
                  width: `${progress}%`,
                  height: "100%",
                  background: "green",
                  borderRadius: "10px",
                  transition: "width 0.3s ease-in-out",
                }}
              ></div>
            </div>
          </div>

          {/* Training Notes Editor */}
          <div
            style={{
              height: "30vh",
              marginTop: "15px",
              padding: "15px",
              border: "2px solid #ccc",
              borderRadius: "8px",
              textAlign: "left",
              overflowY: "auto",
            }}
          >
            <h3>✍️ Write Your Training Notes</h3>
            <textarea
              value={trainingText}
              onChange={(e) => setTrainingText(e.target.value)}
              placeholder="Type your training notes here..."
              style={{
                width: "100%",
                height: "75%",
                padding: "10px",
                fontSize: "16px",
                border: "1px solid #aaa",
                borderRadius: "5px",
                resize: "none",
              }}
            />
          </div>
        </div>

        {/* Right Side: Ask a Question + Summary Window */}
        <div style={{ width: "30%", marginLeft: "20px", display: "flex", flexDirection: "column", alignItems: "center" }}>
          {/* Training Summary Window (Smaller) */}
          <div
            style={{
              width: "100%",
              height: "64vh",
              padding: "15px",
              border: "2px solid #ccc",
              borderRadius: "8px",
              textAlign: "left",
              overflowY: "auto",
              background: "#f9f9f9",
              color: "black",
            }}
          >
            <h3>📄 Training Summary</h3>
            <p style={{ whiteSpace: "pre-wrap" }}>{trainingText || "Your training summary will appear here..."}</p>
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
                : <p style={{ color: "gray", textAlign: "center" }}>Ask me anything about your training!</p>}
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