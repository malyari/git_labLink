"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { Home, Folder, Upload } from "lucide-react";
import Image from "next/image";

export default function DataAnalysisPage() {
  const [files, setFiles] = useState({
    Data: [],
    Analysis: [],
  }); // Store files per folder

  const [currentFolder, setCurrentFolder] = useState("Data"); // Default folder
  const fileInputRef = useRef(null);

  // Folder list
  const folders = ["Data", "Analysis"];

  // Handle folder click to change active view
  const handleFolderClick = (folder) => {
    setCurrentFolder(folder);
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

  return (
    <main style={{ textAlign: "center", padding: "20px", position: "relative", height: "100vh" }}>
      <h1>📊 Data & Analysis</h1>
      <p>Review experiment data, run analyses, and generate insights.</p>

      {/* Folder Selection Window */}
      <div
        style={{
          border: "2px solid #ccc",
          padding: "15px",
          width: "45%",
          height: "70vh",
          position: "absolute",
          right: "20px",
          top: "100px",
          textAlign: "left",
          background: "#f9f9f9",
          borderRadius: "8px",
          overflowY: "auto",
        }}
      >
        <h3 style={{ color: "black" }}>📁 Folders</h3>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {folders.map((folder) => (
            <li
              key={folder}
              style={{
                cursor: "pointer",
                padding: "10px",
                borderBottom: "1px solid #ddd",
                display: "flex",
                alignItems: "center",
                backgroundColor: currentFolder === folder ? "#ddd" : "transparent",
                fontWeight: currentFolder === folder ? "bold" : "normal",
                color: "black",
              }}
              onClick={() => handleFolderClick(folder)}
            >
              <Folder size={20} style={{ marginRight: "10px", fill: "darkorange", color: "darkorange" }} /> {folder}
            </li>
          ))}
        </ul>
        <h4 style={{ color: "black" }}>📂 Viewing: {currentFolder}</h4>
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
          width: "60px",
          height: "60px",
        }}
      >
        <Upload size={30} />
      </button>

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        multiple
        style={{ display: "none" }}
      />

      {/* File Preview Section - Only show files for the selected folder */}
      {files[currentFolder]?.length > 0 && (
        <div
          style={{
            marginTop: "20px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))",
            gap: "10px",
          }}
        >
          {files[currentFolder].map((src, index) => (
            <div
              key={index}
              style={{ position: "relative", width: "100px", height: "100px", cursor: "pointer" }}
              onContextMenu={(event) => handleDeleteFile(event, index)} // Right-click to delete
            >
              <Image src={src} alt={`Uploaded ${index}`} width={100} height={100} style={{ borderRadius: "8px" }} />
            </div>
          ))}
        </div>
      )}

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
