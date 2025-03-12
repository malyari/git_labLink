"use client"; // Ensures this runs on the client side in Next.js

import Link from "next/link";
import { Home, MessageSquare, Send, X } from "lucide-react";
import { useState } from "react";
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

  // Function to adjust end date for FullCalendar
  const fixEndDate = (dateStr) => {
    const date = new Date(dateStr);
    date.setDate(date.getDate() + 1); // Make the end date inclusive
    return date.toISOString().split("T")[0]; // Format as YYYY-MM-DD
  };

  // Function to add a new event when clicking on a day
  const handleDateClick = (info) => {
    const eventType = prompt("Is this a booking for 'Equipment' or 'Experiment'?");
    if (!eventType || (eventType.toLowerCase() !== "equipment" && eventType.toLowerCase() !== "experiment")) {
      alert("Invalid selection! Please enter 'Equipment' or 'Experiment'.");
      return;
    }

    const title = prompt("Enter event title:");
    if (!title) return;

    const startDate = info.dateStr; // Default to clicked date
    const endDateInput = prompt("Enter End Date (YYYY-MM-DD) or leave blank for one day:", startDate);
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

  return (
    <main style={{ display: "flex", height: "100vh", padding: "20px" }}>
      {/* Sidebar (Left Side) */}
      <div style={{ width: "250px", padding: "20px", borderRight: "2px solid #ccc" }}>
        <h3>📌 Calendars</h3>
        <table style={{ width: "100%", borderCollapse: "collapse", cursor: "pointer" }}>
          <tbody>
            <tr onClick={toggleEquipment}>
              <td style={{ backgroundColor: showEquipment ? "blue" : "lightgray", width: "30px", height: "20px", borderRadius: "4px" }}></td>
              <td style={{ paddingLeft: "10px" }}>Equipment {showEquipment ? "(Shown)" : "(Hidden)"}</td>
            </tr>
            <tr onClick={toggleExperiment}>
              <td style={{ backgroundColor: showExperiment ? "green" : "lightgray", width: "30px", height: "20px", borderRadius: "4px" }}></td>
              <td style={{ paddingLeft: "10px" }}>Experiment {showExperiment ? "(Shown)" : "(Hidden)"}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, textAlign: "center" }}>
        <h1>📅 Calendar Page</h1>
        <p>Manage your experiments and equipment schedule here!</p>

        {/* Calendar */}
        <div style={{ maxWidth: "900px", margin: "auto" }}>
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
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

      {/* Floating AI Chat Button (Top Right) */}
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

        {/* AI Chat Window - Now Fully Functional */}
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
              zIndex: 1000, // Ensure it appears above other elements
            }}
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

      {/* Home Button (Bottom Right) */}
      <div style={{ position: "fixed", bottom: "20px", right: "20px" }}>
        <Link href="/">
          <button style={{ border: "none", background: "transparent", cursor: "pointer", fontSize: "24px", padding: "10px" }}>
            <Home size={32} />
          </button>
        </Link>
      </div>
    </main>
  );
}
