"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Home, Send, Eraser, MessageSquare, X, Save, History } from "lucide-react";

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

  // New states for saving and viewing saved items
  const [activeTab, setActiveTab] = useState("whiteboard");
  const [savedWhiteboards, setSavedWhiteboards] = useState([]);
  const [savedChats, setSavedChats] = useState([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [saveItemName, setSaveItemName] = useState("");
  const [saveType, setSaveType] = useState(""); // "whiteboard" or "chat"
  const [isSaved, setIsSaved] = useState(false);

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

  // Save whiteboard as image
  const handleSaveWhiteboard = () => {
    setSaveType("whiteboard");
    setShowSaveDialog(true);
  };

  // Save chat history
  const handleSaveChat = () => {
    if (messages.length === 0) return;
    setSaveType("chat");
    setShowSaveDialog(true);
  };

  // Save the current item with a name
  const saveNamedItem = () => {
    if (saveItemName.trim() === "") {
      setSaveItemName("Untitled");
    }
    
    const timestamp = new Date().toLocaleString();
    
    if (saveType === "whiteboard") {
      const canvas = canvasRef.current;
      const imageData = canvas.toDataURL("image/png");
      
      const newWhiteboard = {
        name: saveItemName.trim() || "Untitled Whiteboard",
        image: imageData,
        timestamp: timestamp
      };
      
      setSavedWhiteboards(prev => [...prev, newWhiteboard]);
    } else if (saveType === "chat") {
      const newChatSave = {
        name: saveItemName.trim() || "Untitled Chat",
        messages: [...messages],
        timestamp: timestamp
      };
      
      setSavedChats(prev => [...prev, newChatSave]);
    }
    
    // For visual feedback
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
    
    // Reset and close dialog
    setSaveItemName("");
    setShowSaveDialog(false);
  };

  // Load saved whiteboard
  const loadSavedWhiteboard = (imageData) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    
    // Clear current canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Create an image to draw onto the canvas
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0);
    };
    img.src = imageData;
    
    // Switch to whiteboard tab
    setActiveTab("whiteboard");
  };

  // Load saved chat
  const loadSavedChat = (savedMessages) => {
    setMessages(savedMessages);
    setActiveTab("whiteboard"); // Go back to main view with chat loaded
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

      {/* Tabs Navigation */}
      <div style={{
        display: "flex",
        justifyContent: "center",
        marginTop: "70px",
        marginBottom: "20px",
        borderBottom: "1px solid #ccc",
        background: "#eaeaea",
        borderRadius: "8px 8px 0 0",
        overflow: "hidden"
      }}>
        <button 
          onClick={() => setActiveTab("whiteboard")}
          style={{
            padding: "12px 15px",
            background: activeTab === "whiteboard" ? "#fff" : "#eaeaea",
            border: "none",
            borderBottom: activeTab === "whiteboard" ? "3px solid #007bff" : "none",
            cursor: "pointer",
            fontWeight: activeTab === "whiteboard" ? "bold" : "normal",
            color: activeTab === "whiteboard" ? "#007bff" : "#333",
            minWidth: "100px"
          }}
        >
          Collaboration
        </button>
        <button 
          onClick={() => setActiveTab("saved")}
          style={{
            padding: "12px 15px",
            background: activeTab === "saved" ? "#fff" : "#eaeaea",
            border: "none",
            borderBottom: activeTab === "saved" ? "3px solid #007bff" : "none",
            cursor: "pointer",
            fontWeight: activeTab === "saved" ? "bold" : "normal",
            color: activeTab === "saved" ? "#007bff" : "#333",
            display: "flex",
            alignItems: "center",
            gap: "5px",
            minWidth: "100px"
          }}
        >
          <History size={16} />
          Saved Items
        </button>
      </div>

      {/* Main Content Area */}
      {activeTab === "whiteboard" && (
        /* Layout: Whiteboard on Left, Chat on Right */
        <div style={{ display: "flex", width: "100%", height: "75vh" }}>
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
            
            {/* Whiteboard Tools */}
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
              
              <button
                onClick={handleSaveWhiteboard}
                style={{
                  padding: "8px 15px",
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
                <Save size={16} />
                Save Whiteboard
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
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ color: "black", margin: "0" }}>💬 Team Chat</h3>
              <button
                onClick={handleSaveChat}
                disabled={messages.length === 0}
                style={{
                  fontSize: "14px",
                  padding: "5px 10px",
                  backgroundColor: messages.length === 0 ? "#ccc" : "#28a745",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: messages.length === 0 ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                }}
              >
                <Save size={14} />
                Save
              </button>
            </div>

            <div
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "10px",
                borderBottom: "2px solid #ccc",
                height: "80%",
                marginTop: "10px"
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
      )}

      {/* Saved Items Tab */}
      {activeTab === "saved" && (
        <div style={{ 
          width: "100%", 
          height: "75vh", 
          border: "2px solid #ccc", 
          borderRadius: "8px", 
          background: "#f9f9f9",
          overflowY: "auto",
          padding: "20px"
        }}>
          <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
            <h3 style={{ color: "black", margin: "0" }}>📚 Saved Items</h3>
          </div>
          
          {/* Saved Whiteboards Section */}
          <div style={{ marginBottom: "30px" }}>
            <h4 style={{ color: "#007bff", borderBottom: "1px solid #007bff", paddingBottom: "5px" }}>
              Saved Whiteboards
            </h4>
            
            {savedWhiteboards.length > 0 ? (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
                {savedWhiteboards.map((whiteboard, index) => (
                  <div 
                    key={index}
                    style={{
                      width: "250px",
                      border: "1px solid #ddd",
                      borderRadius: "8px",
                      overflow: "hidden",
                      background: "#fff",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                    }}
                  >
                    <div style={{ height: "150px", overflow: "hidden", background: "#f0f0f0", cursor: "pointer" }}
                      onClick={() => loadSavedWhiteboard(whiteboard.image)}>
                      <img 
                        src={whiteboard.image} 
                        alt={whiteboard.name} 
                        style={{ width: "100%", height: "100%", objectFit: "contain" }} 
                      />
                    </div>
                    <div style={{ padding: "10px" }}>
                      <div style={{ fontWeight: "bold", fontSize: "16px", marginBottom: "5px" }}>{whiteboard.name}</div>
                      <div style={{ fontSize: "12px", color: "#666" }}>{whiteboard.timestamp}</div>
                      <button
                        onClick={() => loadSavedWhiteboard(whiteboard.image)}
                        style={{
                          marginTop: "10px",
                          width: "100%",
                          padding: "6px",
                          background: "#007bff",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                      >
                        Open
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: "#666", fontStyle: "italic" }}>No saved whiteboards yet. Draw something and save it!</p>
            )}
          </div>
          
          {/* Saved Chats Section */}
          <div>
            <h4 style={{ color: "#007bff", borderBottom: "1px solid #007bff", paddingBottom: "5px" }}>
              Saved Chats
            </h4>
            
            {savedChats.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {savedChats.map((chat, index) => (
                  <div 
                    key={index}
                    style={{
                      border: "1px solid #ddd",
                      borderRadius: "8px",
                      overflow: "hidden",
                      background: "#fff",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                    }}
                  >
                    <div style={{ 
                      padding: "15px",
                      borderBottom: "1px solid #eee",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center"
                    }}>
                      <div>
                        <div style={{ fontWeight: "bold", fontSize: "16px" }}>{chat.name}</div>
                        <div style={{ fontSize: "12px", color: "#666" }}>{chat.timestamp}</div>
                      </div>
                      <button
                        onClick={() => loadSavedChat(chat.messages)}
                        style={{
                          padding: "6px 12px",
                          background: "#007bff",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                      >
                        Load Chat
                      </button>
                    </div>
                    <div style={{ padding: "10px", maxHeight: "150px", overflowY: "auto" }}>
                      {chat.messages.slice(0, 3).map((msg, msgIndex) => (
                        <div
                          key={msgIndex}
                          style={{
                            padding: "8px",
                            background: "#e0e0e0",
                            borderRadius: "5px",
                            marginBottom: "5px",
                            fontSize: "14px"
                          }}
                        >
                          {msg}
                        </div>
                      ))}
                      {chat.messages.length > 3 && (
                        <div style={{ textAlign: "center", color: "#666", fontSize: "12px" }}>
                          + {chat.messages.length - 3} more messages
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: "#666", fontStyle: "italic" }}>No saved chats yet. Have a conversation and save it!</p>
            )}
          </div>
        </div>
      )}

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
            width: "400px",
            color: "black"
          }}>
            <h3 style={{ marginTop: 0 }}>
              Save {saveType === "whiteboard" ? "Whiteboard" : "Chat"}
            </h3>
            <div style={{ marginBottom: "15px" }}>
              <label style={{ display: "block", marginBottom: "5px" }}>Enter a name:</label>
              <input
                type="text"
                value={saveItemName}
                onChange={(e) => setSaveItemName(e.target.value)}
                placeholder={`e.g., ${saveType === "whiteboard" ? "Project Diagram" : "Team Discussion"}`}
                style={{
                  width: "100%",
                  padding: "8px",
                  border: "1px solid #ccc",
                  borderRadius: "4px"
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
                onClick={saveNamedItem}
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