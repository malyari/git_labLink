"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Home, MessageSquare, Send, X, Plus, Trash2, FileText, Activity, Upload } from "lucide-react";

export default function MonitoringDevicesPage() {
  // State variables
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [devices, setDevices] = useState([
    {
      id: 1,
      name: "Temperature Sensor A",
      status: "Online",
      lastUpdated: new Date().toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',

      }),
      manuals: [],
      readings: []
    }
  ]);


  const [selectedDevice, setSelectedDevice] = useState(null);
  const [newDeviceName, setNewDeviceName] = useState("");
  const [showAddDeviceForm, setShowAddDeviceForm] = useState(false);
  const [activeTab, setActiveTab] = useState("status");
  const [fileUploadName, setFileUploadName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
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

  // Handle device selection
  const handleSelectDevice = (device) => {
    setSelectedDevice(device);
    setActiveTab("status");
  };

  const getHumanReadableDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  useEffect(() => {
    const fetchTemperatureData = async () => {
      try {
        const response = await fetch("/api/temperature");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        const updatedDevices = devices.map(device => {
          const existingTimestamps = new Set(device.readings.map(reading => reading.timestamp));

          if (device.id === selectedDevice.id) {
            return {
              ...device,
              lastUpdated: getHumanReadableDate(new Date()),
              readings: [
                ...device.readings,
                ...data
                  .filter(d => {
                    const newTimestamp = getHumanReadableDate(d.timestamp);
                    return !existingTimestamps.has(newTimestamp);

                  }).map(d => ({
                    timestamp: getHumanReadableDate(d.timestamp),
                    value: `${d.temperature_f}°F`,
                  })),
              ]
            };
          }
          return device;
        });

        setDevices(updatedDevices);
        setSelectedDevice(updatedDevices.find(d => d.id === selectedDevice.id));
      } catch (error) {
        console.error("Error fetching temperature data:", error);
      }
    };

    const interval = setInterval(() => {
      if (selectedDevice) {
        fetchTemperatureData();
      }
    }, 6000);

    return () => clearInterval(interval);

  }, [selectedDevice]);

  // Add new device
  const handleAddDevice = () => {
    if (newDeviceName.trim() === "") return;

    const newDevice = {
      id: Date.now(),
      name: newDeviceName,
      status: "Offline",
      lastUpdated: new Date().toLocaleString(),
      manuals: [],
      readings: []
    };

    setDevices([...devices, newDevice]);
    setNewDeviceName("");
    setShowAddDeviceForm(false);
  };

  // Delete device
  const handleDeleteDevice = (deviceId) => {
    const updatedDevices = devices.filter(device => device.id !== deviceId);
    setDevices(updatedDevices);

    if (selectedDevice && selectedDevice.id === deviceId) {
      setSelectedDevice(null);
    }
  };

  // Handle file selection
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);

      // Set file name in input if not already set
      if (fileUploadName === "") {
        setFileUploadName(file.name);
      }
    }
  };

  // Handle file drop
  const handleFileDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);

      // Set file name in input if not already set
      if (fileUploadName === "") {
        setFileUploadName(file.name);
      }
    }
  };

  // Prevent default behavior for drag events
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // Trigger file input click
  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  // Handle file upload - Fixed version
  const handleFileUpload = () => {
    if (!selectedDevice) return;

    // If we don't have a file selected yet, open the file browser instead of uploading
    if (!selectedFile) {
      triggerFileInput();
      return;
    }

    const fileName = fileUploadName.trim() !== "" ? fileUploadName : selectedFile.name;

    // Create file URL for the selected file
    const fileUrl = URL.createObjectURL(selectedFile);

    const updatedDevices = devices.map(device => {
      if (device.id === selectedDevice.id) {
        return {
          ...device,
          manuals: [...device.manuals, {
            name: fileName,
            url: fileUrl
          }]
        };
      }
      return device;
    });

    setDevices(updatedDevices);
    setSelectedDevice(updatedDevices.find(d => d.id === selectedDevice.id));
    setFileUploadName("");
    setSelectedFile(null);

    // Show success message
    alert(`File "${fileName}" uploaded successfully!`);
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
        <span style={{ color: "var(--inactive-color, #aaa)" }}>Monitoring</span>
      </div>

      {/* Main content area */}
      <div style={{
        display: "flex",
        flexDirection: "column",
        height: "80vh",
        margin: "90px auto 10px auto",
        border: "2px solid #ccc",
        borderRadius: "8px",
        overflow: "hidden",
        background: "#f9f9f9",
        maxWidth: "1200px",
        width: "100%",
        position: "relative"
      }}>

        <div style={{ display: "flex", height: "calc(100% - 70px)", overflow: "hidden" }}>
          {/* Device List Sidebar */}
          <div style={{
            width: "300px",
            borderRight: "1px solid #ccc",
            padding: "10px",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden"
          }}>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "10px"
            }}>
              <h3 style={{ margin: 0, color: "#333" }}>Devices</h3>
              <button
                onClick={() => setShowAddDeviceForm(!showAddDeviceForm)}
                style={{
                  background: "#28a745",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  padding: "6px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center"
                }}
              >
                <Plus size={16} />
              </button>
            </div>

            {/* Add Device Form */}
            {showAddDeviceForm && (
              <div style={{
                padding: "10px",
                marginBottom: "10px",
                background: "#f0f0f0",
                borderRadius: "4px"
              }}>
                <input
                  type="text"
                  value={newDeviceName}
                  onChange={(e) => setNewDeviceName(e.target.value)}
                  placeholder="Enter device name"
                  style={{
                    width: "100%",
                    padding: "8px",
                    marginBottom: "8px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                    color: "#000000"
                  }}
                />
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <button
                    onClick={handleAddDevice}
                    style={{
                      background: "#28a745",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      padding: "8px 12px",
                      cursor: "pointer"
                    }}
                  >
                    Add
                  </button>
                  <button
                    onClick={() => setShowAddDeviceForm(false)}
                    style={{
                      background: "#6c757d",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      padding: "8px 12px",
                      cursor: "pointer"
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Device List */}
            <div style={{ overflowY: "auto", flex: 1 }}>
              {devices.length === 0 ? (
                <p style={{ color: "#666", textAlign: "center" }}>No devices added yet</p>
              ) : (
                devices.map(device => (
                  <div
                    key={device.id}
                    onClick={() => handleSelectDevice(device)}
                    style={{
                      padding: "12px",
                      borderRadius: "4px",
                      marginBottom: "8px",
                      background: selectedDevice && selectedDevice.id === device.id ? "#d1e7ff" : "white",
                      border: "1px solid #ddd",
                      cursor: "pointer",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center"
                    }}
                  >
                    <div style={{ textAlign: "left" }}>
                      <div style={{ fontWeight: "bold", marginBottom: "4px", color: "#000000" }}>{device.name}</div>
                      <div style={{
                        fontSize: "12px",
                        display: "flex",
                        alignItems: "center",
                        color: device.status === "Online" ? "#28a745" : "#dc3545"
                      }}>
                        <span style={{
                          height: "8px",
                          width: "8px",
                          borderRadius: "50%",
                          background: device.status === "Online" ? "#28a745" : "#dc3545",
                          display: "inline-block",
                          marginRight: "5px"
                        }}></span>
                        {device.status}
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm("Are you sure you want to delete this device?")) {
                          handleDeleteDevice(device.id);
                        }
                      }}
                      style={{
                        background: "transparent",
                        border: "none",
                        color: "#dc3545",
                        cursor: "pointer",
                        padding: "5px"
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Device Details Area */}
          <div style={{ flex: 1, padding: "15px", display: "flex", flexDirection: "column" }}>
            {selectedDevice ? (
              <>
                {/* Device Header */}
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "15px"
                }}>
                  <h3 style={{ margin: 0, color: "#000000" }}>{selectedDevice.name}</h3>
                  <div style={{ fontSize: "12px", color: "#666" }}>
                    Last Updated: {selectedDevice.lastUpdated}
                  </div>
                </div>

                {/* Tabs */}
                <div style={{
                  display: "flex",
                  borderBottom: "1px solid #ccc",
                  marginBottom: "15px"
                }}>
                  <button
                    onClick={() => setActiveTab("status")}
                    style={{
                      background: "transparent",
                      border: "none",
                      borderBottom: activeTab === "status" ? "2px solid #007bff" : "none",
                      padding: "8px 15px",
                      color: activeTab === "status" ? "#007bff" : "#333",
                      fontWeight: activeTab === "status" ? "bold" : "normal",
                      cursor: "pointer"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <Activity size={16} />
                      Status
                    </div>
                  </button>
                  <button
                    onClick={() => setActiveTab("manuals")}
                    style={{
                      background: "transparent",
                      border: "none",
                      borderBottom: activeTab === "manuals" ? "2px solid #007bff" : "none",
                      padding: "8px 15px",
                      color: activeTab === "manuals" ? "#007bff" : "#333",
                      fontWeight: activeTab === "manuals" ? "bold" : "normal",
                      cursor: "pointer"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <FileText size={16} />
                      Manuals
                    </div>
                  </button>
                </div>

                {/* Tab Content */}
                <div style={{ flex: 1, overflow: "auto" }}>
                  {activeTab === "status" && (
                    <div className="status-tab">
                      <div style={{
                        padding: "15px",
                        background: "#fff",
                        borderRadius: "6px",
                        border: "1px solid #ddd",
                        marginBottom: "15px"
                      }}>
                        <h4 style={{ margin: "0 0 10px 0", color: "#333" }}>Current Status</h4>
                        <div style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          height: "100px",
                          background: "#f5f5f5",
                          borderRadius: "4px",
                          fontSize: "24px",
                          color: selectedDevice.status === "Online" ? "#28a745" : "#dc3545"
                        }}>
                          {selectedDevice.status}
                        </div>
                      </div>

                      <div style={{
                        padding: "15px",
                        background: "#fff",
                        borderRadius: "6px",
                        border: "1px solid #ddd"
                      }}>
                        <h4 style={{ margin: "0 0 10px 0", color: "#333" }}>Recent Readings</h4>
                        {selectedDevice.readings && selectedDevice.readings.length > 0 ? (
                          <table style={{ width: "100%", borderCollapse: "collapse" }}>
                            <thead>
                              <tr>
                                <th style={{ padding: "8px", borderBottom: "1px solid #ddd", textAlign: "left" }}>Time</th>
                                <th style={{ padding: "8px", borderBottom: "1px solid #ddd", textAlign: "right" }}>Value</th>
                              </tr>
                            </thead>
                            <tbody>
                              {selectedDevice.readings.map((reading, index) => (
                                <tr key={index}>
                                  <td style={{ padding: "8px", borderBottom: "1px solid #eee", textAlign: "left", color: "#000000" }}>{reading.timestamp}</td>
                                  <td style={{ padding: "8px", borderBottom: "1px solid #eee", textAlign: "right", color: "#000000" }}>{reading.value}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        ) : (
                          <p style={{ color: "#666", textAlign: "center" }}>No readings available</p>
                        )}
                      </div>
                    </div>
                  )}

                  {activeTab === "manuals" && (
                    <div>
                      <div style={{
                        padding: "15px",
                        background: "#fff",
                        borderRadius: "6px",
                        border: "1px solid #ddd",
                        marginBottom: "15px"
                      }}>
                        <h4 style={{ margin: "0 0 10px 0", color: "#333" }}>Uploaded Manuals</h4>
                        {selectedDevice.manuals && selectedDevice.manuals.length > 0 ? (
                          <ul style={{
                            listStyle: "none",
                            padding: 0,
                            margin: 0
                          }}>
                            {selectedDevice.manuals.map((manual, index) => (
                              <li
                                key={index}
                                style={{
                                  padding: "10px",
                                  background: "#f5f5f5",
                                  borderRadius: "4px",
                                  marginBottom: "8px",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "10px"
                                }}
                              >
                                <FileText size={16} color="#007bff" />
                                <span style={{ color: "#000000" }}>
                                  {typeof manual === 'string' ? manual : manual.name}
                                </span>
                                <div style={{
                                  marginLeft: "auto",
                                  display: "flex",
                                  gap: "10px"
                                }}>
                                  {manual.url && (
                                    <a
                                      href={manual.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      style={{
                                        color: "#007bff",
                                        textDecoration: "none",
                                        fontSize: "12px"
                                      }}
                                    >
                                      View
                                    </a>
                                  )}
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (confirm("Are you sure you want to delete this manual?")) {
                                        const updatedDevices = devices.map(device => {
                                          if (device.id === selectedDevice.id) {
                                            const updatedManuals = [...device.manuals];
                                            updatedManuals.splice(index, 1);
                                            return {
                                              ...device,
                                              manuals: updatedManuals
                                            };
                                          }
                                          return device;
                                        });
                                        setDevices(updatedDevices);
                                        setSelectedDevice(updatedDevices.find(d => d.id === selectedDevice.id));
                                      }
                                    }}
                                    style={{
                                      background: "transparent",
                                      border: "none",
                                      color: "#dc3545",
                                      cursor: "pointer",
                                      padding: "0",
                                      fontSize: "12px"
                                    }}
                                  >
                                    Delete
                                  </button>
                                </div>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p style={{ color: "#666", textAlign: "center" }}>No manuals uploaded</p>
                        )}
                      </div>

                      <div style={{
                        padding: "15px",
                        background: "#fff",
                        borderRadius: "6px",
                        border: "1px solid #ddd"
                      }}>
                        <h4 style={{ margin: "0 0 10px 0", color: "#333" }}>Upload Manual</h4>
                        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                          <input
                            type="text"
                            value={fileUploadName}
                            onChange={(e) => setFileUploadName(e.target.value)}
                            placeholder="Enter file name (e.g., manual.pdf)"
                            style={{
                              flex: 1,
                              padding: "8px",
                              borderRadius: "4px",
                              border: "1px solid #ccc",
                              color: "#000000"
                            }}
                          />
                          <button
                            onClick={handleFileUpload}
                            style={{
                              background: "#007bff",
                              color: "white",
                              border: "none",
                              borderRadius: "4px",
                              padding: "8px 12px",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              gap: "5px"
                            }}
                          >
                            <Upload size={16} />
                            Upload
                          </button>
                        </div>

                        {/* Hidden file input */}
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleFileChange}
                          style={{ display: "none" }}
                        />

                        <div
                          style={{
                            marginTop: "10px",
                            background: "#f5f5f5",
                            padding: "20px",
                            borderRadius: "4px",
                            border: "2px dashed #ccc",
                            textAlign: "center",
                            color: "#666",
                            cursor: "pointer"
                          }}
                          onClick={triggerFileInput}
                          onDrop={handleFileDrop}
                          onDragOver={handleDragOver}
                        >
                          {selectedFile ? (
                            <div>
                              <p style={{ color: "#007bff", fontWeight: "bold" }}>
                                Selected: {selectedFile.name}
                              </p>
                              <p style={{ fontSize: "12px", marginTop: "5px" }}>
                                {(selectedFile.size / 1024).toFixed(2)} KB
                              </p>
                            </div>
                          ) : (
                            <>
                              <p>Drag and drop files here or click to browse</p>
                              <p style={{ fontSize: "12px", marginTop: "5px" }}>
                                Supported formats: PDF, DOC, TXT (Max: 10MB)
                              </p>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                color: "#666"
              }}>
                <p>Select a device to view details</p>
              </div>
            )}
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
                : <p style={{ color: "gray", textAlign: "center" }}>Ask me anything about your devices!</p>}
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

