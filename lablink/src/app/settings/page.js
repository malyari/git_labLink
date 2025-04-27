"use client";

import { useState } from "react";
import Link from "next/link";
import { Home, MessageSquare, Smartphone, Edit, HardDrive, Cloud, RefreshCw, X, Send, Globe, Users, Plus, Trash2 } from "lucide-react";

export default function SettingsPage() {
  // State for toggle switches
  const [phoneConnected, setPhoneConnected] = useState(false);
  const [editingEnabled, setEditingEnabled] = useState(true);
  const [offlineStorage, setOfflineStorage] = useState(false);
  const [cloudSync, setCloudSync] = useState(true);
  
  // State for language selection
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  
  // State for chat functionality
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  // State for admin list functionality
  const [admins, setAdmins] = useState([
    { id: 1, name: "Maral", initial: "M" },
    { id: 2, name: "Natalie", initial: "N" }
  ]);
  const [newAdminName, setNewAdminName] = useState("");
  const [isAddingAdmin, setIsAddingAdmin] = useState(false);
  
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
  
  // Toggle handler function
  const handleToggle = (setter) => {
    return () => setter(prev => !prev);
  };

  // Admin functions
  const addAdmin = () => {
    if (newAdminName.trim() === "") return;
    
    const initial = newAdminName.charAt(0).toUpperCase();
    const newAdmin = {
      id: Date.now(), // Simple unique ID
      name: newAdminName,
      initial: initial
    };
    
    setAdmins([...admins, newAdmin]);
    setNewAdminName("");
    setIsAddingAdmin(false);
  };

  const removeAdmin = (id) => {
    setAdmins(admins.filter(admin => admin.id !== id));
  };

  return (
    <main style={{ 
      textAlign: "left", 
      padding: "30px", 
      position: "relative", 
      height: "100vh",
      maxWidth: "1100px",
      marginLeft: "30px",
      fontFamily: "system-ui, -apple-system, sans-serif"
    }}>
      <h1 style={{ 
        fontSize: "28px", 
        marginBottom: "30px", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center" 
      }}></h1>
      
      <div style={{ 
        background: "#fff", 
        borderRadius: "12px", 
        padding: "25px", 
        marginTop: "50px",
        marginBottom: "30px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
      }}>
        <div style={{ marginBottom: "30px" }}>
          <h2 style={{ fontSize: "20px", marginBottom: "20px", color: "#000" }}>Device Settings</h2>
          
          {/* Phone Connection Toggle */}
          <div style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center", 
            marginBottom: "20px", 
            padding: "12px", 
            borderRadius: "8px",
            background: "#f0f7ff",  /* Light blue background */
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
          }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Smartphone size={20} style={{ marginRight: "12px", color: "#007bff" }} />
              <div>
                <h3 style={{ margin: "0 0 4px 0", fontSize: "16px", color: "#000" }}>Connect to Phone</h3>
                <p style={{ margin: "0", fontSize: "14px", color: "#000" }}>Receive messages on your mobile device</p>
              </div>
            </div>
            <div className="toggle-switch">
              <label className="switch">
                <input 
                  type="checkbox" 
                  checked={phoneConnected} 
                  onChange={handleToggle(setPhoneConnected)}
                />
                <span className="slider round"></span>
              </label>
            </div>
          </div>

          {/* Offline Storage Toggle */}
          <div style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center", 
            marginBottom: "15px", 
            padding: "12px", 
            borderRadius: "8px",
            background: "#f5f0ff",  /* Light purple background */
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
          }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <HardDrive size={20} style={{ marginRight: "12px", color: "#6200ea" }} />
              <div>
                <h3 style={{ margin: "0 0 4px 0", fontSize: "16px", color: "#000" }}>Offline Storage</h3>
                <p style={{ margin: "0", fontSize: "14px", color: "#000" }}>Save data to hard drive instead of cloud</p>
              </div>
            </div>
            <div className="toggle-switch">
              <label className="switch">
                <input 
                  type="checkbox" 
                  checked={offlineStorage} 
                  onChange={handleToggle(setOfflineStorage)}
                />
                <span className="slider round"></span>
              </label>
            </div>
          </div>

          {/* Cloud Sync Toggle as Sub-Setting */}
          {offlineStorage && (
            <div style={{ 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "center", 
              marginBottom: "20px", 
              marginLeft: "30px", /* Indentation to show it's a sub-setting */
              padding: "12px", 
              borderRadius: "8px",
              background: "#f0fff4",  /* Light green background */
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              borderLeft: "3px solid #6200ea", /* Left border to connect to parent */
              width: "calc(100% - 30px)" /* Account for the indentation */
            }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <Cloud size={20} style={{ marginRight: "12px", color: "#00c853" }} />
                <div>
                  <h3 style={{ margin: "0 0 4px 0", fontSize: "16px", color: "#000" }}>Cloud Synchronization</h3>
                  <p style={{ margin: "0", fontSize: "14px", color: "#000" }}>Sync to cloud when internet connection is restored</p>
                </div>
              </div>
              <div className="toggle-switch">
                <label className="switch">
                  <input 
                    type="checkbox" 
                    checked={cloudSync} 
                    onChange={handleToggle(setCloudSync)}
                  />
                  <span className="slider round"></span>
                </label>
              </div>
            </div>
          )}
          
          {/* Language Picker */}
          <div style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center", 
            marginBottom: "20px", 
            padding: "12px", 
            borderRadius: "8px",
            background: "#e8f5e9",  /* Light green background */
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
          }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Globe size={20} style={{ marginRight: "12px", color: "#2e7d32" }} />
              <div>
                <h3 style={{ margin: "0 0 4px 0", fontSize: "16px", color: "#000" }}>Language</h3>
                <p style={{ margin: "0", fontSize: "14px", color: "#000" }}>Select your preferred language</p>
              </div>
            </div>
            <div>
              <select 
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                style={{
                  padding: "8px 12px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                  backgroundColor: "white",
                  color: "#000",
                  fontSize: "14px"
                }}
              >
                <option value="English">English</option>
                <option value="Spanish">Español</option>
                <option value="French">Français</option>
                <option value="German">Deutsch</option>
                <option value="Chinese">中文</option>
                <option value="Japanese">日本語</option>
              </select>
            </div>
          </div>
        </div>

        <div style={{ marginBottom: "30px" }}>
          <h2 style={{ fontSize: "20px", marginBottom: "20px", color: "#000" }}>Content Settings</h2>
          
          {/* Edit Training Data Toggle */}
          <div style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center", 
            padding: "12px", 
            borderRadius: "8px",
            background: "#fff8e1",  /* Light amber background */
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
          }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Edit size={20} style={{ marginRight: "12px", color: "#ff8f00" }} />
              <div>
                <h3 style={{ margin: "0 0 4px 0", fontSize: "16px", color: "#000" }}>Training Page Editing</h3>
                <p style={{ margin: "0", fontSize: "14px", color: "#000" }}>Allow editing options on the training page</p>
              </div>
            </div>
            <div className="toggle-switch">
              <label className="switch">
                <input 
                  type="checkbox" 
                  checked={editingEnabled} 
                  onChange={handleToggle(setEditingEnabled)}
                />
                <span className="slider round"></span>
              </label>
            </div>
          </div>
        </div>

        {/* Admin Section */}
        <div>
          <h2 style={{ 
            fontSize: "20px", 
            marginBottom: "20px", 
            color: "#000", 
            display: "flex", 
            justifyContent: "space-between",
            alignItems: "center"
          }}>
            <span>Administrators</span>
            <button 
              onClick={() => setIsAddingAdmin(true)}
              style={{
                background: "#1976d2",
                color: "white",
                border: "none",
                borderRadius: "5px",
                padding: "5px 10px",
                fontSize: "14px",
                display: "flex",
                alignItems: "center",
                cursor: "pointer"
              }}
            >
              <Plus size={16} style={{ marginRight: "5px" }} />
              Add Admin
            </button>
          </h2>
          
          <div style={{ 
            padding: "12px", 
            borderRadius: "8px",
            background: "#e3f2fd",  /* Light blue background */
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
          }}>
            <div style={{ display: "flex", alignItems: "center", marginBottom: "15px" }}>
              <Users size={20} style={{ marginRight: "12px", color: "#1976d2" }} />
              <h3 style={{ margin: "0", fontSize: "16px", color: "#000" }}>Admin List</h3>
            </div>
            
            {/* Add Admin Form */}
            {isAddingAdmin && (
              <div style={{
                marginLeft: "32px",
                marginBottom: "15px",
                padding: "12px",
                borderRadius: "6px",
                backgroundColor: "#bbdefb",
                display: "flex",
                gap: "10px"
              }}>
                <input
                  type="text"
                  value={newAdminName}
                  onChange={(e) => setNewAdminName(e.target.value)}
                  placeholder="Enter admin name"
                  style={{
                    flex: 1,
                    padding: "8px",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    fontSize: "14px",
                    color: "black",
                  }}
                />
                <button
                  onClick={addAdmin}
                  style={{
                    background: "#1976d2",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    padding: "0 12px",
                    fontSize: "14px",
                    cursor: "pointer"
                  }}
                >
                  Add
                </button>
                <button
                  onClick={() => {
                    setIsAddingAdmin(false);
                    setNewAdminName("");
                  }}
                  style={{
                    background: "#f44336",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    padding: "0 12px",
                    fontSize: "14px",
                    cursor: "pointer"
                  }}
                >
                  Cancel
                </button>
              </div>
            )}
            
            <div style={{ 
              marginLeft: "32px", 
              display: "flex", 
              flexDirection: "column", 
              gap: "10px" 
            }}>
              {/* Admin Users with Delete Button */}
              {admins.map((admin) => (
                <div 
                  key={admin.id}
                  style={{ 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "space-between",
                    padding: "8px 12px", 
                    backgroundColor: "#bbdefb", 
                    borderRadius: "6px" 
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <span style={{ 
                      width: "30px", 
                      height: "30px", 
                      borderRadius: "50%", 
                      background: "#1565c0", 
                      color: "white", 
                      display: "flex", 
                      alignItems: "center", 
                      justifyContent: "center", 
                      fontWeight: "bold", 
                      marginRight: "10px" 
                    }}>
                      {admin.initial}
                    </span>
                    <span style={{ fontSize: "14px", color: "#000" }}>{admin.name}</span>
                  </div>
                  
                  <button
                    onClick={() => removeAdmin(admin.id)}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: "#f44336",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      padding: "5px"
                    }}
                    title="Remove admin"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              
              {admins.length === 0 && (
                <div style={{ 
                  padding: "10px", 
                  textAlign: "center", 
                  color: "#888", 
                  fontStyle: "italic" 
                }}>
                  No administrators added
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Home Navigation (Top-left) - Positioned to match the header in the image */}
      <div style={{ 
        position: "absolute", 
        top: "28px", 
        left: "30px", 
        display: "flex", 
        alignItems: "center", 
        gap: "8px",
        fontSize: "16px"
      }}>
        <Link href="/" style={{ 
          color: "#fff", 
          display: "flex", 
          alignItems: "center",
          textDecoration: "none"
        }}>
          <Home size={20} />
        </Link>
        <span style={{ color: "#aaa" }}>/</span>
        <span style={{ color: "#aaa" }}>Settings</span>
      </div>
      
      {/* AI Chat Button (Top-right) */}
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
                : <p style={{ color: "gray", textAlign: "center" }}>Ask me anything about your settings!</p>}
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

      {/* CSS for toggle switches */}
      <style jsx>{`
        .switch {
          position: relative;
          display: inline-block;
          width: 50px;
          height: 24px;
        }
        
        .switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }
        
        .slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #ccc;
          transition: .4s;
        }
        
        .slider:before {
          position: absolute;
          content: "";
          height: 18px;
          width: 18px;
          left: 3px;
          bottom: 3px;
          background-color: white;
          transition: .4s;
        }
        
        input:checked + .slider {
          background-color: #2196F3;
        }
        
        input:disabled + .slider {
          background-color: #e0e0e0;
          cursor: not-allowed;
        }
        
        input:focus + .slider {
          box-shadow: 0 0 1px #2196F3;
        }
        
        input:checked + .slider:before {
          transform: translateX(26px);
        }
        
        .slider.round {
          border-radius: 24px;
        }
        
        .slider.round:before {
          border-radius: 50%;
        }
      `}</style>
    </main>
  );
}