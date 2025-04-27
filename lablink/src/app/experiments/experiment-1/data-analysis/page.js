"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Home, Folder, Upload, Menu, ChevronLeft, MessageSquare, Send, X } from "lucide-react";
import Image from "next/image";

export default function DataAnalysisPage() {
  const [files, setFiles] = useState({
    Data: [],
    Analysis: [],
  }); // Store files per folder

  const [currentFolder, setCurrentFolder] = useState("Data"); // Default folder
  const fileInputRef = useRef(null);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  // Detect mobile devices
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      // Auto-hide sidebar on mobile
      if (window.innerWidth < 768) {
        setSidebarVisible(false);
      } else {
        setSidebarVisible(true);
      }
    };
    
    // Check on initial load
    checkMobile();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // AI messaging
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

  // Handle folder click to change active view
  const handleFolderClick = (folder) => {
    setCurrentFolder(folder);
    // On mobile, hide sidebar after selection
    if (isMobile) {
      setSidebarVisible(false);
    }
  };

  // Handle file upload and store in the selected folder
  const handleFileUpload = (event) => {
    const uploadedFiles = Array.from(event.target.files);
    const fileUrls = uploadedFiles.map((file) => URL.createObjectURL(file));

    setFiles((prevFiles) => ({
      ...prevFiles,
      [currentFolder]: [...(prevFiles[currentFolder] || []), ...fileUrls], // Store in selected folder
    }));
  };

  // Open file selector when clicking the upload button
  const openFileSelector = () => {
    fileInputRef.current.click();
  };

  // Handle right-click to delete a file from the selected folder
  const handleDeleteFile = (event, index) => {
    event.preventDefault(); // Prevent default right-click menu
    const confirmDelete = window.confirm("Are you sure you want to delete this file?");
    if (confirmDelete) {
      setFiles((prevFiles) => ({
        ...prevFiles,
        [currentFolder]: prevFiles[currentFolder].filter((_, i) => i !== index),
      }));
    }
  };

  // Render the sidebar with folder options
  const renderSidebar = () => {
    return (
      <div style={{ width: "100%" }}>
        <h3 style={{ padding: "15px 15px 5px", color: "#333", margin: 0 }}>📁 Folders</h3>
        
        {["Data", "Analysis"].map((folderName) => (
          <div
            key={folderName}
            style={{
              cursor: "pointer",
              padding: "12px 15px",
              backgroundColor: currentFolder === folderName ? "#ddd" : "transparent",
              fontWeight: currentFolder === folderName ? "bold" : "normal",
              color: "black",
              display: "flex",
              alignItems: "center",
              borderLeft: currentFolder === folderName ? "3px solid #007bff" : "3px solid transparent",
            }}
            onClick={() => handleFolderClick(folderName)}
          >
            <Folder
              size={20}
              style={{ 
                marginRight: "10px", 
                fill: currentFolder === folderName ? "#007bff" : "darkorange", 
                color: currentFolder === folderName ? "#007bff" : "darkorange" 
              }}
            /> 
            {folderName}
          </div>
        ))}
      </div>
    );
  };

  // Render folder content
  const renderFolderContent = () => {
    if (!files[currentFolder] || files[currentFolder].length === 0) {
      return (
        <div style={{ padding: "20px", textAlign: "center", color: "#666" }}>
          <p>No files in this folder</p>
        </div>
      );
    }

    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
          gap: "15px",
          padding: "15px",
        }}
      >
        {files[currentFolder].map((src, index) => (
          <div
            key={index}
            style={{
              position: "relative",
              width: "100%",
              borderRadius: "8px",
              overflow: "hidden",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              background: "#fff",
            }}
            onContextMenu={(event) => handleDeleteFile(event, index)}
          >
            <div style={{ height: "120px", position: "relative" }}>
              <Image
                src={src}
                alt={`File ${index}`}
                fill
                style={{ objectFit: "cover" }}
              />
            </div>
            <div style={{ 
              padding: "8px", 
              overflow: "hidden", 
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              fontSize: "14px",
              color: "#333"
            }}>
              File {index + 1}
            </div>
          </div>
        ))}
      </div>
    );
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
        <span style={{ color: "var(--inactive-color, #aaa)" }}>Data/Analysis</span>
      </div>

      <div style={{ 
        display: "flex", 
        height: "70vh", 
        margin: "90px auto 10px auto",
        border: "2px solid #ccc",
        borderRadius: "8px",
        overflow: "hidden",
        background: "#f9f9f9",
        maxWidth: "100%",
        position: "relative"
      }}>
      
        {/* Mobile toggle menu button */}
        {isMobile && (
          <button
            onClick={() => setSidebarVisible(!sidebarVisible)}
            style={{
              position: "absolute",
              top: "10px",
              left: "10px",
              zIndex: 100,
              background: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              width: "36px",
              height: "36px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer"
            }}
          >
            {sidebarVisible ? <ChevronLeft size={20} /> : <Menu size={20} />}
          </button>
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
        
        {/* Folder navigation sidebar - conditionally shown on mobile */}
        <div style={{ 
          width: isMobile ? (sidebarVisible ? "80%" : "0") : "220px",
          borderRight: "1px solid #ddd",
          overflowY: "auto",
          background: "#f0f0f0",
          transition: "width 0.3s ease",
          position: isMobile ? "absolute" : "relative",
          height: "100%",
          zIndex: isMobile ? "50" : "1",
          boxShadow: isMobile && sidebarVisible ? "2px 0 5px rgba(0,0,0,0.2)" : "none"
        }}>
          {(sidebarVisible || !isMobile) && renderSidebar()}
        </div>
        
        {/* Content area - full width on mobile when sidebar is hidden */}
        <div style={{ 
          flex: 1, 
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          marginLeft: isMobile && sidebarVisible ? "80%" : 0,
          transition: "margin-left 0.3s ease",
          width: isMobile && sidebarVisible ? "100%" : "auto"
        }}>
          <h3 style={{ 
            padding: "15px", 
            margin: 0, 
            borderBottom: "1px solid #ddd",
            color: "#333",
            display: "flex",
            alignItems: "center",
            paddingLeft: isMobile ? "60px" : "15px" // Make room for the menu button
          }}>
            <Folder size={20} style={{ marginRight: "10px", color: "darkorange" }} />
            {currentFolder}
          </h3>
          {renderFolderContent()}
        </div>
      </div>

      {/* Upload Button */}
      <button
        onClick={openFileSelector}
        style={{
          position: "absolute",
          bottom: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          border: "none",
          background: "#007bff",
          color: "white",
          padding: "12px",
          borderRadius: "50%",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "56px",
          height: "56px",
          boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
        }}
      >
        <Upload size={28} />
      </button>

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        multiple
        style={{ display: "none" }}
      />

      
    </main>
  );
}