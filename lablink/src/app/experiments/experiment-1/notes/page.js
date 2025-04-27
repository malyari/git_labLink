"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Home, MessageSquare, Send, X, Save, Mic, MicOff } from "lucide-react";

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
  
  // Refs
  const textareaRef = useRef(null);
  const recognitionRef = useRef(null);
  const fileInputRef = useRef(null);

  // Initialize speech recognition when component mounts
  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      
      recognitionRef.current.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');
        
        // Append transcript to noteContent
        setNoteContent(prev => prev + ' ' + transcript);
      };
      
      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsRecording(false);
      };
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

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

  // Save note function
  const handleSaveNote = () => {
    // Here you would implement actual saving logic
    // For now, we'll just show a saved indicator
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  // Toggle voice recording
  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    } else {
      try {
        recognitionRef.current?.start();
        setIsRecording(true);
      } catch (error) {
        console.error('Failed to start recording:', error);
      }
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
            Write Notes
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
    </main>
  );
}