"use client"; // Ensures this runs on the client side in Next.js

import Link from "next/link";
import { Home, MessageSquare, Send, X, Check, Menu } from "lucide-react";
import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction"; // Enables event editing

export default function CalendarPage() {
  const [events, setEvents] = useState([]);
  const [showEquipment, setShowEquipment] = useState(true);
  const [showExperiment, setShowExperiment] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false); // Toggle AI chat visibility
  const [messages, setMessages] = useState([]); // Stores chat messages
  const [newMessage, setNewMessage] = useState(""); // New user input
  const [selectedCalendar, setSelectedCalendar] = useState("fullcalendar");
  const [sidebarOpen, setSidebarOpen] = useState(false); // For mobile sidebar toggle
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0);

  // Track window width for responsive design
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      // Auto-open sidebar on larger screens
      if (window.innerWidth >= 768) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    // Set initial state
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 768;

  const calendarOptions = [
    { label: "Google", value: "google", color: "#0078D4" },
    { label: "Outlook", value: "outlook", color: "#0078D4" },
    { label: "Mac", value: "mac", color: "#0078D4" },
  ];

  // Function to adjust end date for FullCalendar
  const fixEndDate = (dateStr) => {
    const date = new Date(dateStr);
    date.setDate(date.getDate() + 1); // Make the end date inclusive
    return date.toISOString().split("T")[0]; // Format as YYYY-MM-DD
  };

  // Function to add a new event when clicking on a day
  const handleDateClick = (info) => {
    const eventType = prompt("Is this a booking for 'Equipment' or 'Experiment'?");

    // ✅ Handle if the user clicks "Cancel" (prompt returns null)
    if (eventType === null) {
      return; // Simply exit the function without showing an alert
    }

    // ✅ Check if input is empty or invalid
    if (!eventType || (eventType.toLowerCase() !== "equipment" && eventType.toLowerCase() !== "experiment")) {
      alert("Invalid selection! Please enter 'Equipment' or 'Experiment'.");
      return;
    }

    const title = prompt("Enter event title:");
    if (!title) return;

    const startDate = info.dateStr; // Default to clicked date
    const endDateInput = prompt("Enter End Date (YYYY-MM-DD) or leave blank for one day:", startDate);

    // ✅ Handle if user cancels the end date input
    if (endDateInput === null) {
      return; // Exit function if cancelled
    }

    const endDate = fixEndDate(endDateInput || startDate); // Fix end date issue

    const newEvent = {
      id: `${Date.now()}`, // Unique ID for modification
      title: `${eventType}: ${title}`,
      start: startDate,
      end: endDate, // Adjusted end date
      allDay: true,
      eventType: eventType.toLowerCase(),
      backgroundColor: eventType.toLowerCase() === "equipment" ? "blue" : "green",
      borderColor: eventType.toLowerCase() === "equipment" ? "blue" : "green",
    };

    setEvents([...events, newEvent]);
  };


  // Function to modify an existing event
  const handleEventClick = (clickInfo) => {
    const eventId = clickInfo.event.id;
    const updatedTitle = prompt("Modify event title:", clickInfo.event.title);
    if (!updatedTitle) return;

    const updatedStart = prompt("Modify Start Date (YYYY-MM-DD):", clickInfo.event.startStr);
    const updatedEndInput = prompt("Modify End Date (YYYY-MM-DD):", clickInfo.event.endStr || updatedStart);
    const updatedEnd = fixEndDate(updatedEndInput);

    setEvents((prevEvents) =>
      prevEvents.map((event) =>
        event.id === eventId
          ? { ...event, title: updatedTitle, start: updatedStart, end: updatedEnd }
          : event
      )
    );

    // Update FullCalendar event manually to reflect changes instantly
    clickInfo.event.setProp("title", updatedTitle);
    clickInfo.event.setStart(updatedStart);
    clickInfo.event.setEnd(updatedEnd);
  };

  // Dummy AI response function (can be connected to OpenAI API)
  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;

    // Add user message
    const userMessage = { sender: "user", text: newMessage };
    setMessages((prev) => [...prev, userMessage]);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = { sender: "ai", text: `🤖 AI: I found some insights about "${newMessage}"!` };
      setMessages((prev) => [...prev, aiResponse]);
    }, 1000);

    setNewMessage(""); // Clear input
  };

  // Toggle Equipment visibility
  const toggleEquipment = () => {
    setShowEquipment((prev) => !prev);
  };

  // Toggle Experiment visibility
  const toggleExperiment = () => {
    setShowExperiment((prev) => !prev);
  };

  // Toggle sidebar for mobile view
  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  // Sidebar component
  const Sidebar = () => (
    <div 
      style={{ 
        width: isMobile ? "80%" : "250px",
        height: isMobile ? "100vh" : "auto",
        padding: "20px", 
        borderRight: "2px solid #ccc",
        position: isMobile ? "fixed" : "relative",
        left: isMobile ? (sidebarOpen ? "0" : "-100%") : "0",
        top: isMobile ? "0" : "auto",
        background: "white",
        zIndex: isMobile ? "1200" : "1",
        transition: "left 0.3s ease",
        overflowY: "auto"
      }}
    >
      {isMobile && (
        <button 
          onClick={toggleSidebar}
          style={{
            position: "absolute",
            right: "10px",
            top: "10px",
            background: "none",
            border: "none",
            fontSize: "24px",
            cursor: "pointer"
          }}
        >
          <X size={24} />
        </button>
      )}
      
      <h3 style={{ color: "black" }}>📌 LabLink Calendar</h3>
      <table style={{ width: "100%", borderCollapse: "collapse", cursor: "pointer" }}>
        <tbody>
          <tr onClick={toggleEquipment}>
            <td style={{ width: "30px", height: "20px", border: `2px solid ${showEquipment ? "blue" : "black"}`, borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              {showEquipment && <Check size={20} color="blue" />}
            </td>
            <td style={{ paddingLeft: "10px", color: "black" }}>Equipment </td>
          </tr>
          <tr onClick={toggleExperiment}>
            <td style={{ width: "30px", height: "20px", border: `2px solid ${showExperiment ? "green" : "black"}`, borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              {showExperiment && <Check size={20} color="green" />}
            </td>
            <td style={{ paddingLeft: "10px", color: "black" }}>Experiment </td>
          </tr>
        </tbody>
      </table>

      {/* --- Main Calendar chooser --- */}
      <div style={{ height: "5rem" }} />
      <h3 style={{ color: "black" }}>📌 Other Calendars</h3>
      <table style={{ width: "100%", borderCollapse: "collapse", cursor: "pointer", marginBottom: "1rem" }}>
        <tbody>
          {calendarOptions.map(({ label, value, color }) => (
            <tr
              key={value}
              onClick={() => {
                if (selectedCalendar === value) {
                  setSelectedCalendar(null);
                  alert(`Turning off ${label} Calendar`);
                } else {
                  setSelectedCalendar(value);
                  alert(`Switching to ${label} Calendar`);
                }
              }}
            >
              <td
                style={{
                  width: "30px",
                  height: "20px",
                  border: `2px solid ${
                    selectedCalendar === value ? color : "black"
                  }`,
                  borderRadius: "4px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {selectedCalendar === value && (
                  <Check size={16} color={color} />
                )}
              </td>
              <td style={{ paddingLeft: "10px", color: "black" }}>{label}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  // Calculate responsive chat window dimensions
  const getChatWindowStyle = () => {
    return {
      position: "fixed",
      top: isMobile ? "auto" : "70px",
      bottom: isMobile ? "70px" : "auto",
      right: "20px",
      width: isMobile ? "calc(100% - 40px)" : "350px",
      height: isMobile ? "300px" : "400px",
      background: "white",
      border: "2px solid #ccc",
      borderRadius: "8px",
      display: "flex",
      flexDirection: "column",
      zIndex: 1000,
    };
  };

  return (
    <main style={{ display: "flex", flexDirection: isMobile ? "column" : "row", height: "100vh", padding: isMobile ? "10px" : "20px", position: "relative" }}>
      {/* Mobile Menu Button */}
      {isMobile && (
        <button
          onClick={toggleSidebar}
          style={{
            position: "fixed",
            top: "20px",
            left: "20px",
            zIndex: 1100,
            background: "#007bff",
            color: "white",
            border: "none",
            padding: "10px",
            borderRadius: "50%",
            cursor: "pointer",
          }}
        >
          <Menu size={24} />
        </button>
      )}

      {/* Sidebar */}
      {(sidebarOpen || !isMobile) && <Sidebar />}

      {/* Overlay for mobile when sidebar is open */}
      {isMobile && sidebarOpen && (
        <div 
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.5)",
            zIndex: 1100
          }}
          onClick={toggleSidebar}
        />
      )}

      {/* Main Content Area */}
      <div style={{ 
        flex: 1, 
        textAlign: "center",
        marginLeft: isMobile ? 0 : (sidebarOpen ? "20px" : 0),
        marginTop: isMobile ? "60px" : 0,
        transition: "margin-left 0.3s ease",
        width: isMobile ? "100%" : "auto"
      }}>
        {/* Calendar */}
        <div style={{ 
          maxWidth: "900px", 
          margin: "auto", 
          padding: isMobile ? "10px 0" : 0,
          overflowX: "auto" // Allow horizontal scrolling if needed on mobile
        }}>
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView={isMobile ? "dayGridDay" : "dayGridMonth"} // Use day view on mobile
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: isMobile ? 'dayGridDay,dayGridWeek' : 'dayGridMonth,dayGridWeek,dayGridDay'
            }}
            height={isMobile ? "auto" : undefined}
            events={events.filter(event => 
              (showEquipment && event.eventType === "equipment") ||
              (showExperiment && event.eventType === "experiment")
            )}
            dateClick={handleDateClick}
            eventClick={handleEventClick}
            selectable={true}
            editable={true}
            eventResizableFromStart={true}
          />
        </div>
      </div>

      {/* Floating AI Chat Button */}
      <div style={{ 
        position: "fixed", 
        top: isMobile ? "auto" : "20px", 
        bottom: isMobile ? "20px" : "auto",
        right: "20px", 
        zIndex: 1100 
      }}>
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

        {/* AI Chat Window - Responsive */}
        {isChatOpen && (
          <div
            style={getChatWindowStyle()}
            onClick={(e) => e.stopPropagation()} // Prevents click events from reaching the calendar
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
                        marginRight: msg.sender === "user" ? "0" : "auto",
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

      {/* Home Button (Bottom Right) */}
      <div style={{ 
        position: "fixed", 
        bottom: "20px", 
        left: isMobile ? "20px" : "auto", 
        right: isMobile ? "auto" : "20px"
      }}>
        <Link href="/">
          <button style={{ 
            border: "none", 
            background: "#007bff", 
            color: "white",
            cursor: "pointer", 
            fontSize: "24px", 
            padding: "10px",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <Home size={24} />
          </button>
        </Link>
      </div>
    </main>
  );
}