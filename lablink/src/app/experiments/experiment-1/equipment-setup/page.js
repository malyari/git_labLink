"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Home, Camera, Folder, Edit, Trash, Copy, Scissors, X, Check } from "lucide-react";
import Image from "next/image";

export default function EquipmentSetupPage() {
  const [folderStructure, setFolderStructure] = useState({
    Folders: {
      Equipment: {},
      Samples: {},
      "Set-up": {},
    },
  });

  const [currentFolder, setCurrentFolder] = useState("Equipment");
  const [contextMenu, setContextMenu] = useState({ show: false, x: 0, y: 0, item: null, key: "" });
  const [clipboard, setClipboard] = useState({ action: "", folder: "", key: "", item: null });
  const [renaming, setRenaming] = useState({ active: false, key: "", value: "" });
  const fileInputRef = useRef(null);
  const renameInputRef = useRef(null);

  // Render the sidebar with folder options
  const renderSidebar = () => {
    return (
      <div style={{ width: "100%" }}>
        {Object.entries(folderStructure.Folders).map(([folderName, content]) => (
          <div
            key={folderName}
            style={{
              cursor: "pointer",
              padding: "12px 15px",
              backgroundColor: currentFolder === folderName ? "#ddd" : "transparent",
              fontWeight: currentFolder === folderName ? "bold" : "normal",
              color: "black",
              display: "flex",
              alignItems: "center",
              borderLeft: currentFolder === folderName ? "3px solid #007bff" : "3px solid transparent",
            }}
            onClick={() => setCurrentFolder(folderName)}
          >
            <Folder
              size={20}
              style={{ 
                marginRight: "10px", 
                fill: currentFolder === folderName ? "#007bff" : "darkorange", 
                color: currentFolder === folderName ? "#007bff" : "darkorange" 
              }}
            />
            {folderName}
          </div>
        ))}
      </div>
    );
  };

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64Data = reader.result.split(",")[1];
        resolve(base64Data);
      };
      reader.onerror = (error) => reject(error);
    });

  const fetchPersistedImages = async () => {
    try {
      const res = await fetch("/api/listEquipment");
      const data = await res.json();
      if (data.files) {
        const persistedImages = {};
        data.files.forEach((file) => {
          persistedImages[file.name || `image_${file.id}.jpeg`] = {
            url: `https://drive.google.com/uc?export=view&id=${file.id}`,
            id: file.id,
            originalName: file.name || `image_${file.id}.jpeg`
          };
        });
        setFolderStructure((prevStructure) => {
          const updated = { ...prevStructure };
          updated.Folders.Equipment = persistedImages;
          return updated;
        });
      }
    } catch (error) {
      console.error("Error fetching persisted images:", error);
    }
  };

  useEffect(() => {
    if (currentFolder === "Equipment") {
      fetchPersistedImages();
    }
  }, [currentFolder]);

  useEffect(() => {
    // Close context menu when clicking outside
    const handleClickOutside = () => {
      if (contextMenu.show) {
        setContextMenu({ show: false, x: 0, y: 0, item: null, key: "" });
      }
    };
    
    // Close rename input when clicking outside and not on the confirm button
    const handleClickOutsideRename = (e) => {
      if (renaming.active && renameInputRef.current && !renameInputRef.current.contains(e.target)) {
        const isConfirmButton = e.target.closest('[data-confirm-rename="true"]');
        if (!isConfirmButton) {
          setRenaming({ active: false, key: "", value: "" });
        }
      }
    };

    window.addEventListener("click", handleClickOutside);
    window.addEventListener("click", handleClickOutsideRename);
    
    return () => {
      window.removeEventListener("click", handleClickOutside);
      window.removeEventListener("click", handleClickOutsideRename);
    };
  }, [contextMenu.show, renaming.active]);

  const handleImageUpload = async (event) => {
    const files = Array.from(event.target.files);
    
    for (const file of files) {
      try {
        // Create local preview with original filename
        const url = URL.createObjectURL(file);
        const fileName = file.name;
        
        setFolderStructure((prevStructure) => {
          const updated = { ...prevStructure };
          updated.Folders[currentFolder][fileName] = { 
            url, 
            originalName: fileName,
            isLocal: true 
          };
          return updated;
        });
        
        // Upload to server
        const base64Data = await toBase64(file);
        const payload = {
          fileName: file.name,
          fileContent: base64Data,
          mimeType: file.type,
          folder: currentFolder,
        };

        const res = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        console.log("Uploaded file data:", data);
        
        if (currentFolder === "Equipment") {
          fetchPersistedImages();
        }
      } catch (error) {
        console.error("Error uploading file to Google Drive:", error);
      }
    }
  };

  const handleDeleteImage = async (image, key) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this photo?");
    if (confirmDelete) {
      // Close the context menu
      setContextMenu({ show: false, x: 0, y: 0, item: null, key: "" });
      
      if (currentFolder === "Equipment" && image.id) {
        try {
          const res = await fetch("/api/deleteFile", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ fileId: image.id }),
          });
          const data = await res.json();
          console.log("Deletion response:", data);
          
          // Also delete from local state
          setFolderStructure((prevStructure) => {
            const updated = { ...prevStructure };
            delete updated.Folders[currentFolder][key];
            return updated;
          });
          
          // Refresh from API after a short delay
          setTimeout(() => {
            fetchPersistedImages();
          }, 300);
        } catch (error) {
          console.error("Error deleting file from Google Drive:", error);
        }
      } else {
        // For non-persisted files, just remove from state
        setFolderStructure((prevStructure) => {
          const updated = { ...prevStructure };
          delete updated.Folders[currentFolder][key];
          return updated;
        });
      }
      
      // Clear clipboard if the deleted item was there
      if (clipboard.key === key && clipboard.folder === currentFolder) {
        setClipboard({ action: "", folder: "", key: "", item: null });
      }
    }
  };
  
  const handleRenameStart = (key, originalName) => {
    setRenaming({
      active: true,
      key: key,
      value: originalName || key
    });
    setContextMenu({ show: false, x: 0, y: 0, item: null, key: "" });
    
    // Focus the input after it's rendered
    setTimeout(() => {
      if (renameInputRef.current) {
        renameInputRef.current.focus();
      }
    }, 50);
  };
  
  const handleRenameConfirm = async () => {
    if (!renaming.active || !renaming.key || !renaming.value.trim()) return;
    
    const oldKey = renaming.key;
    const newName = renaming.value.trim();
    const currentFolderContent = folderStructure.Folders[currentFolder];
    const item = currentFolderContent[oldKey];
    
    if (!item) return;
    
    // For Google Drive files, update the name on the server
    if (item.id) {
      try {
        // Implement API call to rename file on Google Drive
        // For now, we'll just update it locally
        console.log(`Renaming file with ID ${item.id} to ${newName}`);
      } catch (error) {
        console.error("Error renaming file:", error);
      }
    }
    
    // Update local state
    setFolderStructure(prevStructure => {
      const updated = { ...prevStructure };
      
      // Create a new entry with the new name
      const updatedItem = { ...item, originalName: newName };
      
      // Add new entry and remove old one
      updated.Folders[currentFolder][newName] = updatedItem;
      if (oldKey !== newName) {
        delete updated.Folders[currentFolder][oldKey];
      }
      
      return updated;
    });
    
    // Reset renaming state
    setRenaming({ active: false, key: "", value: "" });
  };
  
  const handleCopyImage = (key, item) => {
    console.log("Copying to clipboard:", item);
    setClipboard({
      action: "copy",
      folder: currentFolder,
      key: key,
      item: JSON.parse(JSON.stringify(item)) // Make a deep copy
    });
    setContextMenu({ show: false, x: 0, y: 0, item: null, key: "" });
  };
  
  const handleCutImage = (key, item) => {
    console.log("Cutting to clipboard:", item);
    setClipboard({
      action: "cut",
      folder: currentFolder,
      key: key,
      item: JSON.parse(JSON.stringify(item)) // Make a deep copy
    });
    setContextMenu({ show: false, x: 0, y: 0, item: null, key: "" });
  };
  
  const handlePasteImage = () => {
    if (!clipboard.key || !clipboard.item) {
      console.log("Nothing in clipboard");
      return;
    }
    
    console.log("Pasting from clipboard:", clipboard);
    
    setFolderStructure(prevStructure => {
      const updated = JSON.parse(JSON.stringify(prevStructure)); // Deep clone
      
      // Create a unique name if the same file already exists in the target folder
      let newKey = clipboard.item.originalName || clipboard.key;
      let counter = 1;
      
      while (updated.Folders[currentFolder][newKey]) {
        const nameParts = newKey.split('.');
        const ext = nameParts.length > 1 ? `.${nameParts.pop()}` : '';
        const baseName = nameParts.join('.');
        newKey = `${baseName} (${counter})${ext}`;
        counter++;
      }
      
      // Create a completely new item to avoid reference issues
      const newItem = {
        url: clipboard.item.url,
        id: clipboard.item.id,
        originalName: newKey,
        isLocal: clipboard.item.isLocal
      };
      
      // Add the item to the current folder
      updated.Folders[currentFolder][newKey] = newItem;
      
      // For cut operations, remove the original
      if (clipboard.action === "cut") {
        delete updated.Folders[clipboard.folder][clipboard.key];
      }
      
      console.log("Updated structure:", updated);
      return updated;
    });
    
    // Always clear clipboard after paste to prevent multiple pastes
    setClipboard({ action: "", folder: "", key: "", item: null });
  };

  const openFileSelector = () => {
    fileInputRef.current.click();
  };
  
  const handleContextMenu = (e, item, key) => {
    e.preventDefault();
    setContextMenu({
      show: true,
      x: e.pageX,
      y: e.pageY,
      item: item,
      key: key
    });
  };

  // Render context menu
  const renderContextMenu = () => {
    if (!contextMenu.show) return null;
    
    const menuStyles = {
      position: 'fixed',
      top: `${contextMenu.y}px`,
      left: `${contextMenu.x}px`,
      background: 'white',
      border: '1px solid #ccc',
      borderRadius: '4px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
      zIndex: 1000,
      minWidth: '120px'
    };
    
    const menuItemStyles = {
      padding: '8px 12px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      color: '#333',
      transition: 'background 0.2s'
    };
    
    return (
      <div style={menuStyles} onClick={e => e.stopPropagation()}>
        <div 
          style={{ ...menuItemStyles, ':hover': { background: '#f0f0f0' } }}
          onClick={() => handleRenameStart(contextMenu.key, contextMenu.item.originalName)}
        >
          <Edit size={14} /> Rename
        </div>
        <div 
          style={{ ...menuItemStyles, ':hover': { background: '#f0f0f0' } }}
          onClick={() => handleCopyImage(contextMenu.key, contextMenu.item)}
        >
          <Copy size={14} /> Copy
        </div>
        <div 
          style={{ ...menuItemStyles, ':hover': { background: '#f0f0f0' } }}
          onClick={() => handleCutImage(contextMenu.key, contextMenu.item)}
        >
          <Scissors size={14} /> Cut
        </div>
        <div 
          style={{ ...menuItemStyles, ':hover': { background: '#f0f0f0' }, color: 'red' }}
          onClick={() => handleDeleteImage(contextMenu.item, contextMenu.key)}
        >
          <Trash size={14} /> Delete
        </div>
      </div>
    );
  };

  // Render content based on current folder
  const renderFolderContent = () => {
    if (!folderStructure.Folders[currentFolder] || 
        Object.entries(folderStructure.Folders[currentFolder]).length === 0) {
      return (
        <div style={{ padding: "20px", textAlign: "center", color: "#666" }}>
          <p>No files in this folder</p>
          {clipboard.key && (
            <button 
              onClick={handlePasteImage}
              style={{ 
                padding: "8px 12px", 
                background: "#007bff", 
                color: "white", 
                border: "none", 
                borderRadius: "4px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                margin: "10px auto"
              }}
            >
              Paste {clipboard.action === "cut" ? "moved" : "copied"} item
            </button>
          )}
        </div>
      );
    }

    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
          gap: "15px",
          padding: "15px",
          position: "relative"
        }}
      >
        {clipboard.key && (
          <button 
            onClick={handlePasteImage}
            style={{ 
              position: "absolute",
              top: "15px",
              right: "15px",
              padding: "8px 12px", 
              background: "#007bff", 
              color: "white", 
              border: "none", 
              borderRadius: "4px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              zIndex: 10
            }}
          >
            Paste {clipboard.action === "cut" ? "moved" : "copied"} item
          </button>
        )}
        
        {Object.entries(folderStructure.Folders[currentFolder]).map(([key, image], index) => (
          <div
            key={index}
            style={{
              position: "relative",
              width: "100%",
              borderRadius: "8px",
              overflow: "hidden",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              background: "#fff",
            }}
            onContextMenu={(e) => handleContextMenu(e, image, key)}
          >
            <div style={{ height: "120px", position: "relative", cursor: "pointer" }}>
              <Image
                src={image.url}
                alt={image.originalName || key}
                fill
                style={{ objectFit: "cover" }}
              />
            </div>
            <div style={{ 
              padding: "8px", 
              overflow: "hidden", 
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              fontSize: "14px",
              color: "#333",
              position: "relative"
            }}>
              {renaming.active && renaming.key === key ? (
                <div style={{ display: "flex", alignItems: "center" }}>
                  <input
                    ref={renameInputRef}
                    type="text"
                    value={renaming.value}
                    onChange={(e) => setRenaming({...renaming, value: e.target.value})}
                    onKeyDown={(e) => e.key === "Enter" && handleRenameConfirm()}
                    style={{ 
                      width: "calc(100% - 35px)",
                      padding: "4px",
                      border: "1px solid #007bff",
                      borderRadius: "4px"
                    }}
                  />
                  <button 
                    data-confirm-rename="true"
                    onClick={handleRenameConfirm}
                    style={{ 
                      marginLeft: "5px", 
                      cursor: "pointer",
                      border: "none",
                      background: "#007bff",
                      color: "white",
                      borderRadius: "4px", 
                      display: "flex",
                      padding: "4px"
                    }}
                  >
                    <Check size={14} />
                  </button>
                </div>
              ) : (
                image.originalName || key.replace(/^(local_|image_)/, '').replace(/\.[^/.]+$/, '')
              )}
            </div>
          </div>
        ))}
      </div>
    );
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

      <div style={{ 
        display: "flex", 
        height: "70vh", 
        margin: "20px auto",
        border: "2px solid #ccc",
        borderRadius: "8px",
        overflow: "hidden",
        background: "#f9f9f9",
        maxWidth: "90%"
      }}>
        {/* Folder navigation sidebar */}
        <div style={{ 
          width: "250px", 
          borderRight: "1px solid #ddd",
          overflowY: "auto",
          background: "#f0f0f0"
        }}>
          <h3 style={{ padding: "15px 15px 5px", color: "#333", margin: 0 }}>📁 Folders</h3>
          {renderSidebar()}
        </div>
        
        {/* Content area */}
        <div style={{ 
          flex: 1, 
          overflowY: "auto",
          display: "flex",
          flexDirection: "column"
        }}>
          <h3 style={{ 
            padding: "15px", 
            margin: 0, 
            borderBottom: "1px solid #ddd",
            color: "#333",
            display: "flex",
            alignItems: "center"
          }}>
            <Folder size={20} style={{ marginRight: "10px", color: "darkorange" }} />
            {currentFolder}
          </h3>
          {renderFolderContent()}
        </div>
      </div>

      {/* Right-click context menu */}
      {renderContextMenu()}

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
          boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
        }}
      >
        <Camera size={30} />
      </button>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageUpload}
        accept="image/*"
        multiple
        style={{ display: "none" }}
      />

      <div style={{ position: "absolute", bottom: "20px", left: "20px" }}>
        <Link href="/experiments/experiment-1">
          <button style={{ padding: "12px 20px", fontSize: "16px", cursor: "pointer" }}>
            Back to Experiment 1
          </button>
        </Link>
      </div>

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