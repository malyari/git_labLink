"use client";

import { useState } from "react";
import Link from "next/link";
import { Home } from "lucide-react";

export default function TrainingPage() {
  const [trainingText, setTrainingText] = useState(""); // Store user input
  const [completedSteps, setCompletedSteps] = useState([]); // Store completed steps

  const steps = [
    "Gather all required equipment.",
    "Set up the workstation.",
    "Prepare the necessary materials.",
    "Follow safety procedures.",
    "Begin the experiment as per instructions.",
    "Record observations and results.",
    "Clean up and store equipment properly."
  ];

  // Handle step completion
  const toggleStep = (index) => {
    setCompletedSteps((prev) =>
      prev.includes(index) ? prev.filter((step) => step !== index) : [...prev, index]
    );
  };

  // Calculate progress percentage
  const progress = (completedSteps.length / steps.length) * 100;

  return (
    <main style={{ textAlign: "center", padding: "50px", position: "relative", height: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Title & Description */}
      <div>
        <h1>🎓 Training/Guidelines</h1>
        <p>Access training materials and instructions for Experiment 1.</p>
      </div>

      {/* Training Content Layout */}
      <div style={{ display: "flex", width: "100%", marginTop: "20px" }}>
        {/* Left Side: Training Guide + Notes Editor */}
        <div style={{ width: "65%", display: "flex", flexDirection: "column", marginLeft: "20px" }}>
          {/* Step-by-Step Guidelines Window */}
          <div
            style={{
              height: "40vh", // Increased height to fit the progress bar
              padding: "15px",
              border: "2px solid #ccc",
              borderRadius: "8px",
              textAlign: "left",
              overflowY: "auto",
              background: "#f9f9f9",
              color: "black",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between", // Aligns the progress bar at the bottom
            }}
          >
            <div>
              <h3>📌 Step-by-Step Guidelines</h3>
              <ul style={{ padding: 0, listStyleType: "none" }}>
                {steps.map((step, index) => (
                  <li
                    key={index}
                    onClick={() => toggleStep(index)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      cursor: "pointer",
                      marginBottom: "10px",
                      fontSize: "16px",
                      color: "black",
                    }}
                  >
                    {/* Circle Step Number */}
                    <div
                      style={{
                        width: "30px",
                        height: "30px",
                        borderRadius: "50%",
                        border: "2px solid black",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginRight: "10px",
                        background: completedSteps.includes(index) ? "green" : "white",
                        color: completedSteps.includes(index) ? "white" : "black",
                        fontWeight: "bold",
                      }}
                    >
                      {index + 1}
                    </div>
                    {step}
                  </li>
                ))}
              </ul>
            </div>

            {/* Progress Bar (Added at the bottom) */}
            <div
              style={{
                width: "100%",
                background: "white", // Empty progress bar
                height: "15px",
                borderRadius: "10px",
                border: "2px solid black", // Black border
                marginTop: "10px",
                position: "relative",
              }}
            >
              <div
                style={{
                  width: `${progress}%`,
                  height: "100%",
                  background: "green",
                  borderRadius: "10px",
                  transition: "width 0.3s ease-in-out",
                }}
              ></div>
            </div>
          </div>

          {/* Training Notes Editor */}
          <div
            style={{
              height: "30vh",
              marginTop: "15px",
              padding: "15px",
              border: "2px solid #ccc",
              borderRadius: "8px",
              textAlign: "left",
              overflowY: "auto",
            }}
          >
            <h3>✍️ Write Your Training Notes</h3>
            <textarea
              value={trainingText}
              onChange={(e) => setTrainingText(e.target.value)}
              placeholder="Type your training notes here..."
              style={{
                width: "100%",
                height: "75%",
                padding: "10px",
                fontSize: "16px",
                border: "1px solid #aaa",
                borderRadius: "5px",
                resize: "none",
              }}
            />
          </div>
        </div>

        {/* Right Side: Ask a Question + Summary Window */}
        <div style={{ width: "30%", marginLeft: "20px", display: "flex", flexDirection: "column", alignItems: "center" }}>
          {/* Ask a Question Button */}
          <button
            style={{
              width: "100%",
              padding: "12px 20px",
              fontSize: "16px",
              cursor: "pointer",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "5px",
              marginBottom: "10px",
            }}
            onClick={() => alert("Ask a question feature coming soon!")}
          >
            ❓ Ask a Question
          </button>

          {/* Training Summary Window (Smaller) */}
          <div
            style={{
              width: "100%",
              height: "64vh",
              padding: "15px",
              border: "2px solid #ccc",
              borderRadius: "8px",
              textAlign: "left",
              overflowY: "auto",
              background: "#f9f9f9",
              color: "black",
            }}
          >
            <h3>📄 Training Summary</h3>
            <p style={{ whiteSpace: "pre-wrap" }}>{trainingText || "Your training summary will appear here..."}</p>
          </div>
        </div>
      </div>

      {/* Back to Experiment 1 Button */}
      <div style={{ position: "absolute", bottom: "20px", left: "20px" }}>
        <Link href="/experiments/experiment-1">
          <button style={{ padding: "12px 20px", fontSize: "16px", cursor: "pointer" }}>
            Back to Experiment 1
          </button>
        </Link>
      </div>

      {/* Home Icon Button */}
      <div style={{ position: "absolute", bottom: "20px", right: "20px" }}>
        <Link href="/">
          <button
            style={{
              border: "none",
              background: "transparent",
              cursor: "pointer",
              fontSize: "24px",
              padding: "10px",
            }}
          >
            <Home size={32} />
          </button>
        </Link>
      </div>
    </main>
  );
}
