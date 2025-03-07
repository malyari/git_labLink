"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { Home, Camera, Trash } from "lucide-react"; // Import Trash icon
import Image from "next/image";

export default function EquipmentSetupPage() {
  const [images, setImages] = useState([]);
  const fileInputRef = useRef(null);

  // Handle image selection
  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    const imageUrls = files.map((file) => URL.createObjectURL(file));
    setImages((prevImages) => [...prevImages, ...imageUrls]);
  };

  // Open file selector when clicking the camera button
  const openFileSelector = () => {
    fileInputRef.current.click();
  };

  // Handle right-click to delete an image
  const handleDeleteImage = (event, index) => {
    event.preventDefault(); // Prevent the default right-click menu
    const confirmDelete = window.confirm("Are you sure you want to delete this photo?");
    if (confirmDelete) {
      setImages((prevImages) => prevImages.filter((_, i) => i !== index));
    }
  };

  return (
    <main style={{ textAlign: "center", padding: "50px", position: "relative", height: "100vh" }}>
      <h1>🔧 Equipment & Setup</h1>
      <p>Configure and set up the necessary equipment for Experiment 1.</p>

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
        capture="environment"
        multiple
        style={{ display: "none" }}
      />

      {/* Image Preview Section */}
      {images.length > 0 && (
        <div
          style={{
            marginTop: "20px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))",
            gap: "10px",
          }}
        >
          {images.map((src, index) => (
            <div
              key={index}
              style={{ position: "relative", width: "100px", height: "100px", cursor: "pointer" }}
              onContextMenu={(event) => handleDeleteImage(event, index)} // Right-click to delete
            >
              <Image src={src} alt={`Uploaded ${index}`} width={100} height={100} style={{ borderRadius: "8px" }} />
            </div>
          ))}
        </div>
      )}

      {/* Back to Experiment 1 Button (Bottom-left) */}
      <div style={{ position: "absolute", bottom: "20px", left: "20px" }}>
        <Link href="/experiments/experiment-1">
          <button style={{
            padding: "12px 20px",
            fontSize: "16px",
            cursor: "pointer"
          }}>
            Back to Experiment 1
          </button>
        </Link>
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
