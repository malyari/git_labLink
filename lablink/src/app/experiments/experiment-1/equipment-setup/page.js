"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Home, Camera, Folder } from "lucide-react";
import Image from "next/image";

export default function EquipmentSetupPage() {
  const [images, setImages] = useState({
    Equipment: [],
    Samples: [],
    "Set-Up": [],
  }); // Store images per folder

  const [currentFolder, setCurrentFolder] = useState("Equipment"); // Default folder
  const fileInputRef = useRef(null);

  // Folder list
  const folders = ["Equipment", "Samples", "Set-Up"];

  // Handle folder click to change active view
  const handleFolderClick = (folder) => {
    setCurrentFolder(folder);
  };

  // NEW: Function to convert a file to a base64 string
  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64Data = reader.result.split(",")[1]; // remove data URL prefix
        resolve(base64Data);
      };
      reader.onerror = (error) => reject(error);
    });

  // Modified handleImageUpload: Update local state AND upload to Google Drive
  const handleImageUpload = async (event) => {
    const files = Array.from(event.target.files);
    const imageUrls = files.map((file) => URL.createObjectURL(file));

    // Update local preview state for the current folder
    setImages((prevImages) => ({
      ...prevImages,
      [currentFolder]: [...(prevImages[currentFolder] || []), ...imageUrls],
    }));

    // For each file, convert to base64 and upload to Google Drive
    for (const file of files) {
      try {
        const base64Data = await toBase64(file);
        const payload = {
          fileName: file.name,
          fileContent: base64Data,
          mimeType: file.type,
          folder: currentFolder, // Uses the currently selected folder ("Equipment", etc.)
        };

        const res = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        console.log("Uploaded file data:", data);
      } catch (error) {
        console.error("Error uploading file to Google Drive:", error);
      }
    }
  };

  // NEW: Fetch persisted images from Google Drive when the current folder is "Equipment"
  useEffect(() => {
    if (currentFolder === "Equipment") {
      fetch("/api/listEquipment")
        .then((res) => res.json())
        .then((data) => {
          if (data.files) {
            // Create image URLs from file IDs (publicly accessible because permissions were set)
            const persistedImages = data.files.map(
              (file) => `https://drive.google.com/uc?export=view&id=${file.id}`
            );
            setImages((prevImages) => ({
              ...prevImages,
              Equipment: persistedImages,
            }));
          }
        })
        .catch((error) => {
          console.error("Error fetching persisted images:", error);
        });
    }
  }, [currentFolder]);

  // Open file selector when clicking the camera button
  const openFileSelector = () => {
    fileInputRef.current.click();
  };

  // Handle right-click to delete an image from the selected folder (local preview only)
  const handleDeleteImage = (event, index) => {
    event.preventDefault();
    const confirmDelete = window.confirm("Are you sure you want to delete this photo?");
    if (confirmDelete) {
      setImages((prevImages) => ({
        ...prevImages,
        [currentFolder]: prevImages[currentFolder].filter((_, i) => i !== index),
      }));
    }
  };

  return (
    <main
      style={{
        textAlign: "center",
        padding: "20px",
        position: "relative",
        height: "100vh",
      }}
    >
      <h1>🔧 Set-Up & Equipment</h1>
      <p>Manage your experimental setup and materials.</p>

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
              <Folder
                size={20}
                style={{ marginRight: "10px", fill: "darkorange", color: "darkorange" }}
              />{" "}
              {folder}
            </li>
          ))}
        </ul>
        <h4 style={{ color: "black" }}>📂 Viewing: {currentFolder}</h4>
      </div>

      {/* Camera Button */}
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
        <Camera size={30} />
      </button>

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageUpload}
        accept="image/*"
        multiple
        style={{ display: "none" }}
      />

      {/* Image Preview Section - Only show images for the selected folder */}
      {images[currentFolder]?.length > 0 && (
        <div
          style={{
            marginTop: "20px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))",
            gap: "10px",
          }}
        >
          {images[currentFolder].map((src, index) => (
            <div
              key={index}
              style={{
                position: "relative",
                width: "100px",
                height: "100px",
                cursor: "pointer",
              }}
              onContextMenu={(event) => handleDeleteImage(event, index)}
            >
              <Image
                src={src}
                alt={`Uploaded ${index}`}
                width={100}
                height={100}
                style={{ borderRadius: "8px" }}
              />
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
