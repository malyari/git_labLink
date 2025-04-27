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
        <span style={{ color: "var(--inactive-color, #aaa)" }}>Notes</span>
      </div>

      {/* Main content area - Notes */}
      <div style={{ 
        display: "flex",
        flexDirection: "column",
        height: "70vh", 
        margin: "90px auto 10px auto",
        border: "2px solid #ccc",
        borderRadius: "8px",
        overflow: "hidden",
        background: "#f9f9f9",
        maxWidth: "800px",
        width: "100%",
        position: "relative"
      }}>
        {/* Tabs Navigation */}
        <div style={{
          display: "flex",
          borderBottom: "1px solid #ccc",
          background: "#eaeaea"
        }}>
          <button 
            onClick={() => setActiveTab("write")}
            style={{
              padding: "12px 20px",
              background: activeTab === "write" ? "#fff" : "#eaeaea",
              border: "none",
              borderBottom: activeTab === "write" ? "3px solid #007bff" : "none",
              cursor: "pointer",
              fontWeight: activeTab === "write" ? "bold" : "normal",
              color: activeTab === "write" ? "#007bff" : "#333",
            }}
          >
            Take Notes
          </button>
          <button 
            onClick={() => setActiveTab("scan")}
            style={{
              padding: "12px 20px",
              background: activeTab === "scan" ? "#fff" : "#eaeaea",
              border: "none",
              borderBottom: activeTab === "scan" ? "3px solid #007bff" : "none",
              cursor: "pointer",
              fontWeight: activeTab === "scan" ? "bold" : "normal",
              color: activeTab === "scan" ? "#007bff" : "#333",
            }}
          >
            Scan Notes
          </button>
          <button 
            onClick={() => setActiveTab("previous")}
            style={{
              padding: "12px 20px",
              background: activeTab === "previous" ? "#fff" : "#eaeaea",
              border: "none",
              borderBottom: activeTab === "previous" ? "3px solid #007bff" : "none",
              cursor: "pointer",
              fontWeight: activeTab === "previous" ? "bold" : "normal",
              color: activeTab === "previous" ? "#007bff" : "#333",
              display: "flex",
              alignItems: "center",
              gap: "5px"
            }}
          >
            <History size={16} />
            Saved Notes
          </button>
        </div>
        
        {/* Write Notes Tab */}
        {activeTab === "write" && (
          <>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "10px 20px",
              borderBottom: "1px solid #ccc",
              background: "#f5f5f5"
            }}>
              <h2 style={{ color: "#000", margin: "0" }}>Research Notes</h2>
              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  onClick={toggleRecording}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "8px 12px",
                    background: isRecording ? "#ff4757" : "#007bff",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    gap: "5px"
                  }}
                >
                  {isRecording ? <MicOff size={18} /> : <Mic size={18} />}
                  {isRecording ? "Stop Recording" : "Voice to Text"}
                </button>
                
                <button
                  onClick={handleSaveNote}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "8px 12px",
                    background: isSaved ? "#28a745" : "#007bff",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    gap: "5px"
                  }}
                >
                  <Save size={18} />
                  {isSaved ? "Saved!" : "Save Note"}
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
                padding: "20px",
                border: "none",
                resize: "none",
                fontSize: "16px",
                lineHeight: "1.6",
                fontFamily: "Arial, sans-serif",
                color: "#333",
                background: "#fff"
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
            padding: "20px",
            background: "#fff"
          }}>
            <h2 style={{ color: "#000", marginTop: "0" }}>Scan Handwritten Notes</h2>
            
            <p style={{ color: "#666" }}>
              Use your device camera to scan handwritten notes and convert them to digital text.
            </p>
            
            <div style={{
              display: "flex",
              justifyContent: "center",
              margin: "20px 0",
            }}>
              {!scannedImage ? (
                <div style={{
                  width: "300px",
                  height: "200px",
                  border: "2px dashed #ccc",
                  borderRadius: "8px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  cursor: "pointer"
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
                  <div style={{ fontSize: "48px", marginBottom: "10px" }}>📷</div>
                  <p style={{ margin: "0", color: "#666" }}>Click to capture or upload image</p>
                </div>
              ) : (
                <div style={{ textAlign: "center" }}>
                  <img 
                    src={scannedImage} 
                    alt="Scanned notes" 
                    style={{ 
                      maxWidth: "100%", 
                      maxHeight: "200px",
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
                        border: "none"
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
                        border: "none"
                      }}
                    >
                      {isTranscribing ? "Transcribing..." : "Transcribe"}
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {transcribedText && (
              <div style={{
                marginTop: "20px",
                padding: "15px",
                background: "#f8f9fa",
                border: "1px solid #ccc",
                borderRadius: "8px"
              }}>
                <h3 style={{ margin: "0 0 10px 0", color: "#333" }}>Transcribed Text:</h3>
                <p style={{ margin: "0", color: "#333" }}>{transcribedText}</p>
                <div style={{ marginTop: "15px" }}>
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
                      border: "none"
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
            padding: "20px",
            background: "#fff",
            overflowY: "auto"
          }}>
            <h2 style={{ color: "#000", marginTop: "0" }}>Previous Notes</h2>
            
            {savedNotes.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                {savedNotes.map((note, index) => (
                  <div
                    key={index}
                    style={{
                      padding: "15px",
                      background: "#f9f9f9",
                      border: "1px solid #ddd",
                      borderRadius: "8px",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
                    }}
                    onClick={() => loadSavedNote(note.text)}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                      <h3 style={{ margin: "0", fontSize: "18px", color: "#333" }}>{note.name}</h3>
                      <small style={{ color: "#666", fontSize: "14px" }}>{note.timestamp}</small>
                    </div>
                    <p 
                      style={{ 
                        margin: "0", 
                        color: "#555",
                        fontSize: "15px",
                        lineHeight: "1.5",
                        maxHeight: "100px",
                        overflow: "hidden",
                        textOverflow: "ellipsis"
                      }}
                    >
                      {note.text}
                    </p>
                    <div style={{ marginTop: "15px", textAlign: "right" }}>
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
                          fontSize: "14px"
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
                height: "200px",
                color: "#666"
              }}>
                <History size={48} strokeWidth={1} style={{ color: "#ccc", marginBottom: "15px" }} />
                <p style={{ fontSize: "18px", margin: "0 0 5px 0" }}>No saved notes yet</p>
                <p style={{ fontSize: "14px", margin: "0" }}>
                  Your saved notes will appear here. Start by writing a note and saving it.
                </p>
                <button
                  onClick={() => setActiveTab("write")}
                  style={{
                    marginTop: "20px",
                    padding: "8px 16px",
                    background: "#007bff",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer"
                  }}
                >
                  Create New Note
                </button>
              </div>
            )}
          </div>
        )}
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
                : <p style={{ color: "gray", textAlign: "center" }}>Ask me anything about your notes!</p>}
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
            <h3 style={{ marginTop: 0 }}>Save Your Note</h3>
            <div style={{ marginBottom: "15px" }}>
              <label style={{ display: "block", marginBottom: "5px" }}>Enter a name for this note:</label>
              <input
                type="text"
                value={noteName}
                onChange={(e) => setNoteName(e.target.value)}
                placeholder="e.g., Experiment Observations"
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
                onClick={saveNamedNote}
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