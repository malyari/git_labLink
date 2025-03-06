"use client"; // Ensures this runs on the client side in Next.js

import Link from "next/link";
import { Home } from "lucide-react";
import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction"; // Enables event editing

export default function CalendarPage() {
  const [events, setEvents] = useState([]);

  // Function to add a new event
  const handleDateClick = (info) => {
    const title = prompt("Enter event title:");
    if (title) {
      const newEvent = { title, start: info.dateStr };
      setEvents([...events, newEvent]);
    }
  };

  return (
    <main style={{ textAlign: "center", padding: "50px", position: "relative", height: "100vh" }}>
      <h1>📅 Calendar Page</h1>
      <p>Manage your experiments and equipment schedule here!</p>

      {/* FullCalendar Component */}
      <div style={{ maxWidth: "900px", margin: "auto" }}>
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={events}
          dateClick={handleDateClick} // Allow adding events
          editable={true} // Enable drag-and-drop editing
        />
      </div>

      {/* Home Icon Button (Bottom-right) */}
      <div style={{ position: "absolute", bottom: "20px", right: "20px" }}>
        <Link href="/">
          <button style={{
            border: "none",
            background: "transparent",
            cursor: "pointer",
            fontSize: "24px",
            padding: "10px"
          }}>
            <Home size={32} />
          </button>
        </Link>
      </div>
    </main>
  );
}




