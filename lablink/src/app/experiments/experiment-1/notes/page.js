"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Home, MessageSquare, Send, X, Save, Mic, MicOff, History } from "lucide-react";

export default function NotesPage() {
  // State variables
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [activeTab, setActiveTab] = useState("write");
  const [scannedImage, setScannedImage] = useState(null);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcribedText, setTranscribedText] = useState("");
  
  // New state variables for saving notes functionality
  const [savedNotes, setSavedNotes] = useState([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [noteName, setNoteName] = useState("");
  
  // Refs
  const textareaRef = useRef(null);
  const recognitionRef = useRef(null);
  const fileInputRef = useRef(null);

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

  // Show save dialog
  const showSavePrompt = () => {
    if (noteContent.trim() === "") return;
    setShowSaveDialog(true);
  };
  
  // Save note function
  const handleSaveNote = () => {
    // For simple visual feedback
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
    
    // Show save dialog for naming the note
    showSavePrompt();
  };
  
  // Save note with name
  const saveNamedNote = () => {
    if (noteContent.trim() === "") return;
    
    const newNote = {
      name: noteName.trim() || "Untitled Note",
      text: noteContent,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', year: 'numeric', month: 'short', day: 'numeric' })
    };
    
    setSavedNotes(prev => [...prev, newNote]);
    setNoteName(""); // Reset note name
    setShowSaveDialog(false); // Hide dialog
  };
  
  // Load saved note into editor
  const loadSavedNote = (noteText) => {
    setNoteContent(noteText);
    setActiveTab("write");
  };

  // Simple mock recording toggle
  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
    } else {
      setIsRecording(true);
      
      // Simulate a recording and add mock text after a delay
      setTimeout(() => {
        const mockTranscripts = [
          "This is a simulated voice transcription for demo purposes.",
          "The real speech recognition would convert your voice to text here.",
          "Taking notes is easier with voice to text technology.",
          "Remember to save your important research findings."
        ];
        
        // Pick a random transcript from the array
        const randomIndex = Math.floor(Math.random() * mockTranscripts.length);
        setNoteContent(prev => prev + ' ' + mockTranscripts[randomIndex]);
        
        // Stop the "recording"
        setIsRecording(false);
      }, 3000);
    }
  };
  
  // Handle file selection for scanning
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setScannedImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Simulate transcription of scanned image
  const handleTranscribe = () => {
    if (!scannedImage) return;
    
    setIsTranscribing(true);
    
    // Simulate a delay for transcription processing
    setTimeout(() => {
      setTranscribedText(
        "This is a simulated transcription of the scanned handwritten notes. " +
        "In a real implementation, this would use OCR technology to convert the " +
        "handwritten text into digital format. The transcribed content would appear here " +
        "and could be edited or saved to your digital notes."
      );
      setIsTranscribing(false);
    }, 2000);
  };
  
  // Open camera/file browser
  const handleScanClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <main
      style={{
        textAlign: "center",
        padding: "5px",
        position: "relative",
        height: "100vh",
        width: "100%",
        maxWidth: "100vw",
        overflowX: "hidden"
      }}
    >
      {/* Breadcrumb Navigation (Top-left) - Simplified for mobile */}
      <div style={{ 
        position: "absolute", 
        top: "10px", 
        left: "10px", 
        display: "flex", 
        alignItems: "center", 
        gap: "4px",
        fontSize: "14px",
        zIndex: 10,
        overflowX: "auto",
        whiteSpace: "nowrap",
        maxWidth: "calc(100% - 80px)", // Leave space for the chat button
        WebkitOverflowScrolling: "touch", // For smoother scrolling on iOS
        padding: "5px 0"
      }}>
        <Link href="/" style={{ 
          color: "var(--text-color, currentColor)", 
          display: "flex", 
          alignItems: "center",
          textDecoration: "none"
        }}>
          <Home size={18} />
        </Link>
        <span style={{ color: "var(--separator-color, #666)" }}>/</span>
        <Link href="/experiments" style={{ 
          color: "var(--text-color, currentColor)", 
          textDecoration: "none"
        }}>
          Experiment
        </Link>
        <span style={{ color: "var(--separator-color, #666)" }}>/</span>
        <Link href="/experiments/experiment-1" style={{ 
          color: "var(--text-color, currentColor)", 
          textDecoration: "none"
        }}>
          Experiment 1
        </Link>
        <span style={{ color: "var(--separator-color, #666)" }}>/</span>
        <span style={{ color: "var(--inactive-color, #aaa)" }}>Notes</span>
      </div>

      {/* Main content area - Notes */}
      <div style={{ 
        display: "flex",
        flexDirection: "column",
        height: "calc(100vh - 140px)", 
        margin: "60px auto 5px auto",
        border: "1px solid #ccc",
        borderRadius: "8px",
        overflow: "hidden",
        background: "#f9f9f9",
        width: "95%",
        position: "relative"
      }}>
        {/* Tabs Navigation - Touch-friendly tabs */}
        <div style={{
          display: "flex",
          borderBottom: "1px solid #ccc",
          background: "#eaeaea",
          width: "100%",
          overflowX: "auto",
          WebkitOverflowScrolling: "touch" // For smoother scrolling on iOS
        }}>
          <button 
            onClick={() => setActiveTab("write")}
            style={{
              padding: "12px 15px",
              background: activeTab === "write" ? "#fff" : "#eaeaea",
              border: "none",
              borderBottom: activeTab === "write" ? "3px solid #007bff" : "none",
              cursor: "pointer",
              fontWeight: activeTab === "write" ? "bold" : "normal",
              color: activeTab === "write" ? "#007bff" : "#333",
              minWidth: "80px",
              fontSize: "14px"
            }}
          >
            Take Notes
          </button>
          <button 
            onClick={() => setActiveTab("scan")}
            style={{
              padding: "12px 15px",
              background: activeTab === "scan" ? "#fff" : "#eaeaea",
              border: "none",
              borderBottom: activeTab === "scan" ? "3px solid #007bff" : "none",
              cursor: "pointer",
              fontWeight: activeTab === "scan" ? "bold" : "normal",
              color: activeTab === "scan" ? "#007bff" : "#333",
              minWidth: "80px",
              fontSize: "14px"
            }}
          >
            Scan Notes
          </button>
          <button 
            onClick={() => setActiveTab("previous")}
            style={{
              padding: "12px 15px",
              background: activeTab === "previous" ? "#fff" : "#eaeaea",
              border: "none",
              borderBottom: activeTab === "previous" ? "3px solid #007bff" : "none",
              cursor: "pointer",
              fontWeight: activeTab === "previous" ? "bold" : "normal",
              color: activeTab === "previous" ? "#007bff" : "#333",
              display: "flex",
              alignItems: "center",
              gap: "5px",
              minWidth: "80px",
              fontSize: "14px"
            }}
          >
            <History size={14} />
            Saved
          </button>
        </div>
        
        {/* Write Notes Tab */}
        {activeTab === "write" && (
          <>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "8px 10px",
              borderBottom: "1px solid #ccc",
              background: "#f5f5f5",
              flexWrap: "wrap"
            }}>
              <h2 style={{ color: "#000", margin: "0", fontSize: "18px" }}>Research Notes</h2>
              <div style={{ display: "flex", gap: "5px", marginTop: "3px" }}>
                <button
                  onClick={toggleRecording}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "6px 10px",
                    background: isRecording ? "#ff4757" : "#007bff",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    gap: "5px",
                    fontSize: "14px"
                  }}
                >
                  {isRecording ? <MicOff size={16} /> : <Mic size={16} />}
                  {isRecording ? "Stop" : "Voice"}
                </button>
                
                <button
                  onClick={handleSaveNote}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "6px 10px",
                    background: isSaved ? "#28a745" : "#007bff",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    gap: "5px",
                    fontSize: "14px"
                  }}
                >
                  <Save size={16} />
                  {isSaved ? "Saved!" : "Save"}
                </button>
              </div>
            </div>
            
            <textarea
              ref={textareaRef}
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              style={{
                flex: 1,
                width: "100%",
                padding: "15px",
                border: "none",
                resize: "none",
                fontSize: "16px",
                lineHeight: "1.5",
                fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
                color: "#333",
                background: "#fff",
                WebkitAppearance: "none", // Remove default iOS styling
                borderRadius: "0" // Remove rounded corners on iOS
              }}
              placeholder="Start typing your notes here or use voice-to-text..."
            />
          </>
        )}
        
        {/* Scan Notes Tab */}
        {activeTab === "scan" && (
          <div style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            padding: "15px",
            background: "#fff",
            overflowY: "auto",
            WebkitOverflowScrolling: "touch" // For smoother scrolling on iOS
          }}>
            <h2 style={{ color: "#000", marginTop: "0", fontSize: "18px" }}>Scan Handwritten Notes</h2>
            
            <p style={{ color: "#666", fontSize: "14px" }}>
              Use your device camera to scan handwritten notes and convert them to digital text.
            </p>
            
            <div style={{
              display: "flex",
              justifyContent: "center",
              margin: "15px 0",
            }}>
              {!scannedImage ? (
                <div style={{
                  width: "100%",
                  maxWidth: "280px",
                  height: "180px",
                  border: "2px dashed #ccc",
                  borderRadius: "8px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  cursor: "pointer",
                  touchAction: "manipulation" // Improve touch responsiveness
                }}
                onClick={handleScanClick}
                >
                  <input 
                    type="file" 
                    accept="image/*" 
                    style={{ display: "none" }} 
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    capture="environment"
                  />
                  <div style={{ fontSize: "40px", marginBottom: "10px" }}>📷</div>
                  <p style={{ margin: "0", color: "#666", fontSize: "14px" }}>Tap to capture or upload image</p>
                </div>
              ) : (
                <div style={{ textAlign: "center", width: "100%" }}>
                  <img 
                    src={scannedImage} 
                    alt="Scanned notes" 
                    style={{ 
                      maxWidth: "100%", 
                      maxHeight: "180px",
                      border: "1px solid #ccc",
                      borderRadius: "8px"
                    }} 
                  />
                  <div style={{ marginTop: "10px" }}>
                    <button
                      onClick={() => setScannedImage(null)}
                      style={{
                        padding: "8px 12px",
                        marginRight: "10px",
                        background: "#6c757d",
                        color: "white",
                        borderRadius: "5px",
                        border: "none",
                        fontSize: "14px",
                        minWidth: "60px"
                      }}
                    >
                      Clear
                    </button>
                    <button
                      onClick={handleTranscribe}
                      disabled={isTranscribing}
                      style={{
                        padding: "8px 12px",
                        background: isTranscribing ? "#6c757d" : "#007bff",
                        color: "white",
                        borderRadius: "5px",
                        border: "none",
                        fontSize: "14px",
                        minWidth: "90px"
                      }}
                    >
                      {isTranscribing ? "Working..." : "Transcribe"}
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {transcribedText && (
              <div style={{
                marginTop: "15px",
                padding: "12px",
                background: "#f8f9fa",
                border: "1px solid #ccc",
                borderRadius: "8px",
                fontSize: "14px"
              }}>
                <h3 style={{ margin: "0 0 8px 0", color: "#333", fontSize: "16px" }}>Transcribed Text:</h3>
                <p style={{ margin: "0", color: "#333", fontSize: "14px" }}>{transcribedText}</p>
                <div style={{ marginTop: "12px" }}>
                  <button
                    onClick={() => {
                      setNoteContent(prev => prev + "\n\n" + transcribedText);
                      setActiveTab("write");
                    }}
                    style={{
                      padding: "8px 12px",
                      background: "#28a745",
                      color: "white",
                      borderRadius: "5px",
                      border: "none",
                      fontSize: "14px",
                      minHeight: "36px", // Larger touch target
                      touchAction: "manipulation" // Improve touch responsiveness
                    }}
                  >
                    Add to Notes
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Previous Notes Tab */}
        {activeTab === "previous" && (
          <div style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            padding: "15px",
            background: "#fff",
            overflowY: "auto",
            WebkitOverflowScrolling: "touch" // For smoother scrolling on iOS
          }}>
            <h2 style={{ color: "#000", marginTop: "0", fontSize: "18px" }}>Previous Notes</h2>
            
            {savedNotes.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {savedNotes.map((note, index) => (
                  <div
                    key={index}
                    style={{
                      padding: "12px",
                      background: "#f9f9f9",
                      border: "1px solid #ddd",
                      borderRadius: "8px",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                      fontSize: "14px",
                      touchAction: "manipulation" // Improve touch responsiveness
                    }}
                    onClick={() => loadSavedNote(note.text)}
                  >
                    <div style={{ 
                      display: "flex", 
                      justifyContent: "space-between", 
                      alignItems: "flex-start", 
                      marginBottom: "8px",
                      flexWrap: "wrap"
                    }}>
                      <h3 style={{ margin: "0", fontSize: "16px", color: "#333" }}>{note.name}</h3>
                      <small style={{ color: "#666", fontSize: "12px" }}>{note.timestamp}</small>
                    </div>
                    <p 
                      style={{ 
                        margin: "0", 
                        color: "#555",
                        fontSize: "14px",
                        lineHeight: "1.4",
                        maxHeight: "80px",
                        overflow: "hidden",
                        textOverflow: "ellipsis"
                      }}
                    >
                      {note.text}
                    </p>
                    <div style={{ marginTop: "12px", textAlign: "right" }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          loadSavedNote(note.text);
                        }}
                        style={{
                          padding: "6px 12px",
                          background: "#007bff",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontSize: "14px",
                          minHeight: "36px", // Larger touch target
                          touchAction: "manipulation" // Improve touch responsiveness
                        }}
                      >
                        Open in Editor
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ 
                display: "flex", 
                flexDirection: "column", 
                alignItems: "center", 
                justifyContent: "center",
                height: "180px",
                color: "#666"
              }}>
                <History size={40} strokeWidth={1} style={{ color: "#ccc", marginBottom: "12px" }} />
                <p style={{ fontSize: "16px", margin: "0 0 5px 0" }}>No saved notes yet</p>
                <p style={{ fontSize: "14px", margin: "0", textAlign: "center" }}>
                  Your saved notes will appear here.
                </p>
                <button
                  onClick={() => setActiveTab("write")}
                  style={{
                    marginTop: "15px",
                    padding: "8px 16px",
                    background: "#007bff",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    fontSize: "14px",
                    minHeight: "36px", // Larger touch target
                    touchAction: "manipulation" // Improve touch responsiveness
                  }}
                >
                  Create New Note
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* AI chat box - Mobile optimized */}
      <div style={{ position: "fixed", top: "15px", right: "15px", zIndex: 1100 }}>
        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          style={{
            background: "#007bff",
            color: "white",
            border: "none",
            padding: "10px",
            borderRadius: "50%",
            cursor: "pointer",
            width: "40px",
            height: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 5px rgba(0,0,0,0.2)"
          }}
        >
          {isChatOpen ? <X size={20} /> : <MessageSquare size={20} />}
        </button>

        {/* AI Chat Window */}
        {isChatOpen && (
          <div
            style={{
              position: "fixed",
              top: "60px",
              right: "0",
              left: "0",
              width: "100%",
              maxWidth: "100vw",
              height: "60vh",
              background: "white",
              border: "1px solid #ccc",
              borderRadius: "8px 8px 0 0",
              display: "flex",
              flexDirection: "column",
              zIndex: 1000,
              margin: "0 auto",
              boxShadow: "0 -2px 10px rgba(0,0,0,0.1)"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Chat Header with close button */}
            <div style={{ 
              background: "#007bff", 
              color: "white", 
              padding: "10px", 
              fontWeight: "bold",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderRadius: "8px 8px 0 0"
            }}>
              <span>🤖 AI Assistant</span>
              <button
                onClick={() => setIsChatOpen(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "white",
                  cursor: "pointer",
                  padding: "5px"
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Chat Messages */}
            <div style={{ 
              flex: 1, 
              padding: "10px", 
              overflowY: "auto", 
              background: "#f9f9f9",
              WebkitOverflowScrolling: "touch" // For smoother scrolling on iOS
            }}>
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
                        marginRight: msg.sender === "user" ? "0" : "auto",
                        fontSize: "14px",
                        wordBreak: "break-word" // Prevent overflow of long words
                      }}
                    >
                      {msg.text}
                    </p>
                  ))
                : <p style={{ color: "gray", textAlign: "center", fontSize: "14px" }}>Ask me anything about your notes!</p>}
            </div>

            {/* Chat Input */}
            <div style={{ 
              display: "flex", 
              padding: "10px", 
              borderTop: "1px solid #ccc",
              background: "#fff"
            }}>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Type your question..."
                style={{ 
                  flex: 1, 
                  padding: "8px 12px", 
                  border: "1px solid #ccc", 
                  borderRadius: "20px", 
                  color: "black",
                  fontSize: "14px",
                  marginRight: "5px"
                }}
              />
              <button
                onClick={handleSendMessage}
                style={{
                  width: "40px",
                  height: "40px",
                  background: "#007bff",
                  color: "white",
                  borderRadius: "50%",
                  border: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Save Dialog Modal - Mobile optimized */}
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
            width: "90%",
            maxWidth: "350px",
            color: "black"
          }}>
            <h3 style={{ marginTop: 0, fontSize: "18px" }}>Save Your Note</h3>
            <div style={{ marginBottom: "15px" }}>
              <label style={{ display: "block", marginBottom: "5px", fontSize: "14px" }}>Enter a name for this note:</label>
              <input
                type="text"
                value={noteName}
                onChange={(e) => setNoteName(e.target.value)}
                placeholder="e.g., Experiment Observations"
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  fontSize: "16px", // Larger text for better mobile input
                  WebkitAppearance: "none" // Remove default iOS styling
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
                  padding: "10px 15px", // Larger touch target
                  cursor: "pointer",
                  fontSize: "14px",
                  minHeight: "44px", // Larger touch target
                  minWidth: "80px",
                  touchAction: "manipulation" // Improve touch responsiveness
                }}
              >
                Cancel
              </button>
              <button
                onClick={saveNamedNote}
                style={{
                  background: "#28a745",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  padding: "10px 15px", // Larger touch target
                  cursor: "pointer",
                  fontSize: "14px",
                  minHeight: "44px", // Larger touch target
                  minWidth: "80px",
                  touchAction: "manipulation" // Improve touch responsiveness
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