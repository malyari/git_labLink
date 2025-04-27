// src/app/layout.js
"use client";

import { ChatProvider } from "../context/ChatContext";
import AIChat from "../components/AIChat";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ChatProvider>
          {children}
          <AIChat />
        </ChatProvider>
      </body>
    </html>
  );
}