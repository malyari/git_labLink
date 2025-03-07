"use client";

import { useState } from "react";
import Link from "next/link";
import { Home, FlaskConical, Plus, Copy, Trash } from "lucide-react"; // Import icons

export default function ExperimentsPage() {
  const [experiments, setExperiments] = useState(["Experiment 1"]); // Default experiment

  // Add a new experiment
  const addExperiment = () => {
    const newExperimentName = `Experiment ${experiments.length + 1}`;
    setExperiments([...experiments, newExperimentName]);
  };

  // Copy an experiment
  const copyExperiment = () => {
    if (experiments.length > 0) {
      const lastExperiment = experiments[experiments.length - 1];
      const copiedExperiment = `${lastExperiment} (Copy)`;
      setExperiments([...experiments, copiedExperiment]);
    }
  };

  // Delete last experiment
  const deleteExperiment = () => {
    if (experiments.length > 0) {
      const confirmDelete = window.confirm("Are you sure you want to delete the last experiment?");
      if (confirmDelete) {
        setExperiments(experiments.slice(0, -1)); // Remove last experiment
      }
    }
  };

  return (
    <main style={{ textAlign: "center", padding: "50px", position: "relative", height: "100vh" }}>
      <h1>🧪 Experiments</h1>
      <p>Track and manage your scientific experiments efficiently!</p>

      {/* Action Buttons */}
      <div style={{ display: "flex", justifyContent: "center", gap: "15px", marginTop: "20px" }}>
        <button
          onClick={addExperiment}
          style={{
            padding: "10px 15px",
            fontSize: "14px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "5px",
          }}
        >
          <Plus size={16} />
          Add New Experiment
        </button>

        <button
          onClick={copyExperiment}
          style={{
            padding: "10px 15px",
            fontSize: "14px",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "5px",
          }}
        >
          <Copy size={16} />
          Copy Experiment
        </button>

        <button
          onClick={deleteExperiment}
          style={{
            padding: "10px 15px",
            fontSize: "14px",
            backgroundColor: "#dc3545",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "5px",
          }}
        >
          <Trash size={16} />
          Delete
        </button>
      </div>

      {/* Experiments List */}
      <div
        style={{
          marginTop: "40px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "10px",
        }}
      >
        {experiments.length > 0 ? (
          experiments.map((experiment, index) => (
            <Link key={index} href={`/experiments/experiment-${index + 1}`} style={{ textDecoration: "none" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "12px 20px",
                  fontSize: "16px",
                  backgroundColor: "#f0f0f0",
                  borderRadius: "5px",
                  cursor: "pointer",
                  width: "250px",
                  justifyContent: "center",
                  color: "black", 
                  fontWeight: "bold", 
                }}
              >
                <FlaskConical size={20} style={{ color: "#007bff" }} />
                {experiment}
              </div>
            </Link>
          ))
        ) : (
          <p style={{ color: "gray" }}>No experiments available.</p>
        )}
      </div>

      {/* Home Icon Button (Bottom-right) */}
      <div style={{ position: "absolute", bottom: "20px", right: "20px" }}>
        <Link href="/">
          <button style={{ border: "none", background: "transparent", cursor: "pointer", fontSize: "24px", padding: "10px" }}>
            <Home size={32} />
          </button>
        </Link>
      </div>
    </main>
  );
}
