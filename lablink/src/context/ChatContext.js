// context/ChatContext.js
"use client";

import { createContext, useState, useContext } from "react";

// Create the context
const ChatContext = createContext();

// Provider component that wraps your app and makes chat context available
export function ChatProvider({ children }) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  // Add a message from user and generate AI response
  const handleSendMessage = (text) => {
    if (text.trim() === "") return;

    // Add user message
    const userMessage = { sender: "user", text: text };
    setMessages((prev) => [...prev, userMessage]);

    // Simulate AI response (replace with actual API call later)
    setTimeout(() => {
      const aiResponse = { sender: "ai", text: `🤖 AI: I found some insights about "${text}"!` };
      setMessages((prev) => [...prev, aiResponse]);
    }, 1000);

    // Clear input
    setNewMessage("");
  };

  // Toggle chat open/closed
  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <ChatContext.Provider 
      value={{ 
        messages, 
        newMessage, 
        setNewMessage, 
        handleSendMessage, 
        isChatOpen, 
        toggleChat 
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

// Custom hook that allows components to access the chat context
export function useChat() {
  return useContext(ChatContext);
}