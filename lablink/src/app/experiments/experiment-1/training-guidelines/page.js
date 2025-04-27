"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Home, MessageSquare, Send, X, Edit, Save, Plus, Trash2, History } from "lucide-react";

export default function TrainingPage() {
  const [trainingText, setTrainingText] = useState(""); // Store user input
  const [completedSteps, setCompletedSteps] = useState([]); // Store completed steps
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [question, setQuestion] = useState(""); // Store question input
  const [instructorMessages, setInstructorMessages] = useState([]); // Store instructor messages
  const [unreadMessages, setUnreadMessages] = useState(0); // Track unread messages
  const [showInstructorChat, setShowInstructorChat] = useState(false); // Control instructor chat visibility
  const [isEditingSteps, setIsEditingSteps] = useState(false); // Track if we're in edit mode
  const [savedSummaries, setSavedSummaries] = useState([]); // Store saved summaries
  const [showPreviousSummaries, setShowPreviousSummaries] = useState(false); // Control summaries visibility
  const [showSaveDialog, setShowSaveDialog] = useState(false); // Control save dialog visibility
  const [summaryName, setSummaryName] = useState(""); // Store summary name
  const [editableSteps, setEditableSteps] = useState([
    "Gather all required equipment.",
    "Set up the workstation.",
    "Prepare the necessary materials.",
    "Follow safety procedures.",
    "Begin the experiment as per instructions.",
    "Record observations and results.",
    "Clean up and store equipment properly."
  ]);
  const [tempSteps, setTempSteps] = useState([]); // Temporary state for editing

  // Handle step completion
  const toggleStep = (index) => {
    if (!isEditingSteps) { // Only toggle completion when not in edit mode
      setCompletedSteps((prev) =>
        prev.includes(index) ? prev.filter((step) => step !== index) : [...prev, index]
      );
    }
  };

  // Calculate progress percentage
  const progress = (completedSteps.length / editableSteps.length) * 100;
  
  // Simulate initial instructor message on component mount
  useEffect(() => {
    setTimeout(() => {
      const initialMessage = { 
        sender: "instructor", 
        text: "Hello! If you have any questions about the experiment, feel free to message me here.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setInstructorMessages([initialMessage]);
      setUnreadMessages(1);
    }, 2000);
  }, []);

  // Show save dialog
  const showSavePrompt = () => {
    if (trainingText.trim() === "") return;
    setShowSaveDialog(true);
  };
  
  // Save current training notes with name
  const saveTrainingNotes = () => {
    if (trainingText.trim() === "") return;
    
    const newSummary = {
      name: summaryName.trim() || "Untitled Summary",
      text: trainingText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', year: 'numeric', month: 'short', day: 'numeric' })
    };
    
    setSavedSummaries(prev => [...prev, newSummary]);
    setTrainingText(""); // Clear the text area after saving
    setSummaryName(""); // Reset summary name
    setShowSaveDialog(false); // Hide dialog
  };
  
  // Toggle previous summaries visibility
  const togglePreviousSummaries = () => {
    setShowPreviousSummaries(prev => !prev);
  };

  // Start editing steps
  const handleEditSteps = () => {
    setTempSteps([...editableSteps]); // Create a copy for editing
    setIsEditingSteps(true);
  };

  // Save edited steps
  const handleSaveSteps = () => {
    setEditableSteps([...tempSteps]);
    setIsEditingSteps(false);
    
    // Remove completed steps that no longer exist
    setCompletedSteps(prev => 
      prev.filter(stepIndex => stepIndex < tempSteps.length)
    );
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setIsEditingSteps(false);
  };

  // Update a step text
  const updateStep = (index, text) => {
    const newSteps = [...tempSteps];
    newSteps[index] = text;
    setTempSteps(newSteps);
  };

  // Add a new step
  const addStep = () => {
    setTempSteps([...tempSteps, "New step"]);
  };

  // Remove a step
  const removeStep = (index) => {
    const newSteps = tempSteps.filter((_, i) => i !== index);
    setTempSteps(newSteps);
  };

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

  // Handle instructor message submission
  const handleQuestionSubmit = (e) => {
    e.preventDefault();
    if (question.trim() === "") return;
    
    // Add the message to instructor chat
    const newUserMsg = { 
      sender: "student", 
      text: question,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setInstructorMessages(prev => [...prev, newUserMsg]);
    
    // Clear the question field
    setQuestion("");
    
    // Show instructor chat if it's hidden
    setShowInstructorChat(true);
    
    // Simulate instructor response after delay
    setTimeout(() => {
      const instructorReply = { 
        sender: "instructor", 
        text: "Thanks for your message. I'll get back to you as soon as possible.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setInstructorMessages(prev => [...prev, instructorReply]);
      setUnreadMessages(prev => prev + 1);
    }, 3000);
  };
  
  // Toggle instructor chat visibility
  const toggleInstructorChat = () => {
    setShowInstructorChat(prev => !prev);
    if (!showInstructorChat) {
      // Reset unread count when opening chat
      setUnreadMessages(0);
    }
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

      {/* Title & Description - Reduced margin to bring content higher */}
      <div style={{ marginTop: "60px" }}>
        
      </div>

      {/* Training Content Layout */}
      <div style={{ display: "flex", width: "100%", marginTop: "10px", height: "calc(85vh - 60px)" }}>
        {/* Left Side: Ask a Question + Training Guide */}
        <div style={{ width: "65%", display: "flex", flexDirection: "column", marginLeft: "20px", height: "100%" }}>
          {/* Message Instructor Section - Redesigned layout for better chat visibility */}
          <div
            style={{
              width: "100%",
              padding: "15px",
              border: "2px solid #ccc",
              borderRadius: "8px",
              textAlign: "left",
              background: "#222", // Dark background
              marginBottom: "15px",
              position: "relative",
              height: "230px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
              <h3 style={{ color: "white", margin: 0 }}>📧 Message Instructor</h3>
              
              {/* Smaller instructor chat view button - positioned at top */}
              <button
                onClick={toggleInstructorChat}
                style={{
                  background: "transparent",
                  border: "1px solid #555",
                  color: "white",
                  padding: "4px 8px",
                  fontSize: "12px",
                  borderRadius: "4px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                {showInstructorChat ? "Hide Chat" : "View Chat"}
              </button>
              
              {/* Notification badge */}
              {unreadMessages > 0 && (
                <div style={{
                  position: "absolute",
                  top: "15px",
                  right: "15px",
                  background: "red",
                  color: "white",
                  borderRadius: "50%",
                  width: "24px",
                  height: "24px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "14px",
                  fontWeight: "bold"
                }}>
                  {unreadMessages}
                </div>
              )}
            </div>
            
            {/* Layout container for chat history and message form */}
            <div style={{ display: "flex", flexDirection: "column", height: "calc(100% - 40px)" }}>
              {/* Instructor chat history - Now larger with more space */}
              {showInstructorChat && (
                <div
                  style={{
                    height: "130px", // Increased height for better visibility
                    overflowY: "auto",
                    marginBottom: "10px",
                    padding: "10px",
                    background: "#333",
                    borderRadius: "4px",
                    border: "1px solid #555"
                  }}
                >
                  {instructorMessages.length > 0 ? (
                    instructorMessages.map((msg, index) => (
                      <div
                        key={index}
                        style={{
                          marginBottom: "10px",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: msg.sender === "student" ? "flex-end" : "flex-start"
                        }}
                      >
                        <div 
                          style={{
                            padding: "10px",
                            borderRadius: "10px",
                            maxWidth: "80%",
                            background: msg.sender === "student" ? "#1c7ed6" : "#555",
                            color: "white"
                          }}
                        >
                          {msg.text}
                        </div>
                        <span style={{ 
                          fontSize: "12px", 
                          color: "#aaa", 
                          marginTop: "2px",
                          alignSelf: msg.sender === "student" ? "flex-end" : "flex-start"
                        }}>
                          {msg.sender === "student" ? "You" : "Instructor"} • {msg.timestamp}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p style={{ color: "#aaa", textAlign: "center" }}>No messages yet</p>
                  )}
                </div>
              )}
              
              {/* New message form - Simple chat-like layout */}
              <form onSubmit={handleQuestionSubmit} style={{ 
                display: "flex", 
                alignItems: "center",
                marginTop: showInstructorChat ? "0" : "10px",
                background: "white",
                borderRadius: "24px",
                padding: "4px",
                border: "1px solid #ddd"
              }}>
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Type a message..."
                  style={{
                    flex: "1",
                    padding: "10px 15px",
                    fontSize: "16px",
                    border: "none",
                    borderRadius: "24px",
                    outline: "none",
                    color: "black",
                    background: "transparent"
                  }}
                />
                <button
                  type="submit"
                  style={{
                    width: "48px",
                    height: "48px",
                    background: "#1c7ed6",
                    color: "white",
                    border: "none",
                    borderRadius: "50%",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <Send size={20} />
                </button>
              </form>
            </div>
          </div>
          
          {/* Step-by-Step Guidelines Window */}
          <div
            style={{
              flex: "1",
              padding: "15px",
              border: "2px solid #ccc",
              borderRadius: "8px",
              textAlign: "left",
              overflowY: "auto",
              background: "#f9f9f9",
              color: "black",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                <h3>📌 Step-by-Step Guidelines</h3>
                
                {isEditingSteps ? (
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button 
                      onClick={addStep}
                      style={{
                        background: "#28a745",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        padding: "5px 10px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "5px"
                      }}
                    >
                      <Plus size={16} /> Add
                    </button>
                    <button 
                      onClick={handleSaveSteps}
                      style={{
                        background: "#007bff",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        padding: "5px 10px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "5px"
                      }}
                    >
                      <Save size={16} /> Save
                    </button>
                    <button 
                      onClick={handleCancelEdit}
                      style={{
                        background: "#6c757d",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        padding: "5px 10px",
                        cursor: "pointer"
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={handleEditSteps}
                    style={{
                      background: "#6c757d",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      padding: "5px 10px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "5px"
                    }}
                  >
                    <Edit size={16} /> Edit Steps
                  </button>
                )}
              </div>
              
              {isEditingSteps ? (
                // Editable steps list
                <ul style={{ padding: 0, listStyleType: "none" }}>
                  {tempSteps.map((step, index) => (
                    <li key={index} style={{ marginBottom: "10px", display: "flex", alignItems: "center" }}>
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
                          background: "white",
                          color: "black",
                          fontWeight: "bold",
                        }}
                      >
                        {index + 1}
                      </div>
                      <input
                        type="text"
                        value={step}
                        onChange={(e) => updateStep(index, e.target.value)}
                        style={{
                          flex: 1,
                          padding: "8px",
                          border: "1px solid #ccc",
                          borderRadius: "4px",
                          fontSize: "16px"
                        }}
                      />
                      <button
                        onClick={() => removeStep(index)}
                        style={{
                          background: "#dc3545",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          padding: "5px 8px",
                          marginLeft: "8px",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center"
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                // Non-editable steps list with checkboxes
                <ul style={{ padding: 0, listStyleType: "none" }}>
                  {editableSteps.map((step, index) => (
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
              )}
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
        </div>

        {/* Right Side: Combined Notes Editor and Summary - SWAPPED ORDER */}
        <div style={{ width: "30%", marginLeft: "20px", display: "flex", flexDirection: "column", alignItems: "center", height: "100%" }}>
          {/* Combined Notes Editor and Summary */}
          <div
            style={{
              width: "100%",
              height: "100%",
              padding: "15px",
              border: "2px solid #ccc",
              borderRadius: "8px",
              textAlign: "left",
              overflowY: "auto",
              background: "#f9f9f9",
              color: "black",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Training Summary - NOW FIRST */}
            <h3>📄 Training Summary</h3>
            <div 
              style={{ 
                padding: "10px", 
                border: "1px solid #aaa", 
                borderRadius: "5px", 
                background: "white", 
                color: "black", 
                flexGrow: 1,
                overflowY: "auto",
                marginBottom: "15px"
              }}
            >
              <p style={{ whiteSpace: "pre-wrap" }}>{trainingText || "Your training summary will appear here..."}</p>
            </div>
            
            {/* Write Training Notes - NOW SECOND AND SMALLER */}
            <div style={{ marginBottom: "15px" }}>
              <h3>✍️ Write Your Training Notes</h3>
              <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                <textarea
                  value={trainingText}
                  onChange={(e) => setTrainingText(e.target.value)}
                  placeholder="Type your training notes here..."
                  style={{
                    width: "100%",
                    height: "120px", // Made smaller than summary (was 50%)
                    padding: "10px",
                    fontSize: "16px",
                    border: "1px solid #aaa",
                    borderRadius: "5px",
                    resize: "none",
                    color: "black"
                  }}
                />
              </div>
              {/* Save button for training notes */}
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                <button
                  onClick={showSavePrompt}
                  style={{
                    background: "#28a745",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    padding: "8px 15px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "5px"
                  }}
                >
                  <Save size={16} /> Save
                </button>
              </div>
            </div>
            
            {/* Button to view previously saved summaries */}
            <div>
              <button
                onClick={togglePreviousSummaries}
                style={{
                  background: "#6c757d",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  padding: "8px 15px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  width: "100%",
                  justifyContent: "center"
                }}
              >
                <History size={16} /> {showPreviousSummaries ? "Hide" : "View"} Previous Summaries
              </button>
              
              {/* Display previous summaries when toggle is on */}
              {showPreviousSummaries && (
                <div
                  style={{
                    marginTop: "10px",
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                    padding: "10px",
                    background: "white",
                    maxHeight: "200px",
                    overflowY: "auto"
                  }}
                >
                  {savedSummaries.length > 0 ? (
                    savedSummaries.map((summary, index) => (
                      <div
                        key={index}
                        style={{
                          padding: "10px",
                          borderBottom: index < savedSummaries.length - 1 ? "1px solid #eee" : "none",
                          marginBottom: "10px"
                        }}
                      >
                        <h4 style={{ margin: "0 0 5px 0" }}>{summary.name}</h4>
                        <p style={{ margin: "0 0 5px 0", whiteSpace: "pre-wrap" }}>{summary.text}</p>
                        <small style={{ color: "#666" }}>Saved on {summary.timestamp}</small>
                      </div>
                    ))
                  ) : (
                    <p style={{ color: "#666", textAlign: "center" }}>No saved summaries yet</p>
                  )}
                </div>
              )}
            </div>
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
            position: "relative"
          }}
        >
          {isChatOpen ? <X size={24} /> : <MessageSquare size={24} />}
          
          {/* Notification badge for AI chat */}
          {!isChatOpen && messages.length > 0 && (
            <div style={{
              position: "absolute",
              top: "-5px",
              right: "-5px",
              background: "red",
              color: "white",
              borderRadius: "50%",
              width: "20px",
              height: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "12px",
              fontWeight: "bold"
            }}>
              {messages.filter(msg => msg.sender === "ai").length}
            </div>
          )}
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
                        marginLeft: msg.sender === "user" ? "auto" : "0",
                        marginRight: msg.sender === "ai" ? "auto" : "0",
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

      {/* Save Dialog Modal */}
      {showSaveDialog && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 2000
        }}>
          <div style={{
            background: "white",
            padding: "20px",
            borderRadius: "8px",
            maxWidth: "400px",
            width: "100%",
            color: "black"
          }}>
            <h3 style={{ marginTop: 0 }}>Save Your Summary</h3>
            <div style={{ marginBottom: "15px" }}>
              <label style={{ display: "block", marginBottom: "5px" }}>Enter a name for this summary:</label>
              <input
                type="text"
                value={summaryName}
                onChange={(e) => setSummaryName(e.target.value)}
                placeholder="e.g., Day 1 Observations"
                style={{
                  width: "100%",
                  padding: "8px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  fontSize: "16px"
                }}
              />
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
              <button
                onClick={() => setShowSaveDialog(false)}
                style={{
                  background: "#6c757d",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  padding: "8px 15px",
                  cursor: "pointer"
                }}
              >
                Cancel
              </button>
              <button
                onClick={saveTrainingNotes}
                style={{
                  background: "#28a745",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  padding: "8px 15px",
                  cursor: "pointer"
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}