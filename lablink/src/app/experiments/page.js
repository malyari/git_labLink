"use client";

import { useState } from "react";
import Link from "next/link";
import { Home, FlaskConical, Plus, Copy, Trash, MessageSquare, Send, X } from "lucide-react"; // Import icons

export default function ExperimentsPage() {
  const [experiments, setExperiments] = useState(["Experiment 1"]); // Default experiment

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


  // Add a new experiment
  const addExperiment = () => {
    const newExperimentName = `Experiment ${experiments.length + 1}`;
    setExperiments([...experiments, newExperimentName]);
  };

  // Copy an experiment
  const copyExperiment = () => {
    if (experiments.length > 0) {
      const lastExperiment = experiments[experiments.length - 1];
      const copiedExperiment = `${lastExperiment} (Copy)`;
      setExperiments([...experiments, copiedExperiment]);
    }
  };

  // Delete last experiment
  const deleteExperiment = () => {
    if (experiments.length > 0) {
      const confirmDelete = window.confirm("Are you sure you want to delete the last experiment?");
      if (confirmDelete) {
        setExperiments(experiments.slice(0, -1)); // Remove last experiment
      }
    }
  };

  return (
    <main style={{ textAlign: "center", padding: "50px", position: "relative", height: "100vh" }}>
  
      {/* Action Buttons */}
      <div style={{ display: "flex", justifyContent: "center", gap: "15px", marginTop: "20px" }}>
        <button
          onClick={addExperiment}
          style={{
            padding: "10px 15px",
            fontSize: "14px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "5px",
          }}
        >
          <Plus size={16} />
          Add New Experiment
        </button>

        <button
          onClick={copyExperiment}
          style={{
            padding: "10px 15px",
            fontSize: "14px",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "5px",
          }}
        >
          <Copy size={16} />
          Copy Experiment
        </button>

        <button
          onClick={deleteExperiment}
          style={{
            padding: "10px 15px",
            fontSize: "14px",
            backgroundColor: "#dc3545",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "5px",
          }}
        >
          <Trash size={16} />
          Delete
        </button>
      </div>

      {/* Experiments List */}
      <div
        style={{
          marginTop: "40px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "10px",
        }}
      >
        {experiments.length > 0 ? (
          experiments.map((experiment, index) => (
            <Link key={index} href={`/experiments/experiment-${index + 1}`} style={{ textDecoration: "none" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "12px 20px",
                  fontSize: "16px",
                  backgroundColor: "#f0f0f0",
                  borderRadius: "5px",
                  cursor: "pointer",
                  width: "250px",
                  justifyContent: "center",
                  color: "black", 
                  fontWeight: "bold", 
                }}
              >
                <FlaskConical size={20} style={{ color: "#007bff" }} />
                {experiment}
              </div>
            </Link>
          ))
        ) : (
          <p style={{ color: "gray" }}>No experiments available.</p>
        )}
      </div>

      {/* Home Icon Button (Bottom-right) */}
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
        <span style={{ color: "#aaa" }}>Experiments</span>
      </div>



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