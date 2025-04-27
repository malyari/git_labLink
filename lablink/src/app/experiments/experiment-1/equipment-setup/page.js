"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Home, Camera, Folder, Edit, Trash, Copy, Scissors, X, Check, Menu, ChevronLeft, MoreVertical, XCircle, Plus, FolderPlus } from "lucide-react";
import Image from "next/image";

export default function EquipmentSetupPage() {
  const [folderStructure, setFolderStructure] = useState({
    Folders: {
      Equipment: {},
      Samples: {},
      SetUp: {},
    },
  });

  const [currentFolder, setCurrentFolder] = useState("Equipment");
  const [contextMenu, setContextMenu] = useState({ show: false, x: 0, y: 0, item: null, key: "" });
  const [clipboard, setClipboard] = useState({ action: "", folder: "", key: "", item: null });
  const [renaming, setRenaming] = useState({ active: false, key: "", value: "" });
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [touchTimer, setTouchTimer] = useState(null);
  const [showItemActions, setShowItemActions] = useState(null); // Tracks which item shows mobile actions
  const fileInputRef = useRef(null);
  const renameInputRef = useRef(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [enlargedImage, setEnlargedImage] = useState({ show: false, url: "", name: "", isLoading: false, id: null});
  const [addingFolder, setAddingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [folderContextMenu, setFolderContextMenu] = useState({ show: false, x: 0, y: 0, folderName: "" });
  const newFolderInputRef = useRef(null);


  // Detect mobile devices
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      // Auto-hide sidebar on mobile
      if (window.innerWidth < 768) {
        setSidebarVisible(false);
      } else {
        setSidebarVisible(true);
      }
    };
    
    // Check on initial load
    checkMobile();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Render the sidebar with folder options
  const renderSidebar = () => {
    return (
      <div style={{ width: "100%" }}>
        <div style={{ padding: "10px 15px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ margin: 0, color: "#333" }}>📁 Folders</h3>
          <button
            onClick={handleAddFolderClick}
            style={{
              border: "none",
              background: "transparent",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              color: "#007bff"
            }}
          >
            <FolderPlus size={18} />
          </button>
        </div>
        
        {addingFolder && (
          <div style={{ padding: "5px 15px 10px", marginBottom: "5px" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <input
                ref={newFolderInputRef}
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddFolder()}
                placeholder="New folder name"
                style={{
                  flex: 1,
                  padding: "6px 8px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                  color: "black"
                }}
              />
              <button
                onClick={handleAddFolder}
                style={{
                  marginLeft: "5px",
                  border: "none",
                  background: "#007bff",
                  color: "white",
                  padding: "6px 10px",
                  borderRadius: "4px",
                  cursor: "pointer"
                }}
              >
                <Check size={16} />
              </button>
            </div>
          </div>
        )}
        
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
              justifyContent: "space-between",
              borderLeft: currentFolder === folderName ? "3px solid #007bff" : "3px solid transparent",
            }}
            onContextMenu={(e) => handleFolderContextMenu(e, folderName)}
          >
            <div 
              style={{ display: "flex", alignItems: "center" }}
              onClick={() => {
                setCurrentFolder(folderName);
                // On mobile, hide sidebar after selection
                if (isMobile) {
                  setSidebarVisible(false);
                }
              }}
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
          // Use the file ID as the key instead of the file name
          persistedImages[file.id] = {
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

  const fetchSamplesImages = async () => {
  try {
    const res = await fetch("/api/listSamples");
    const data = await res.json();
    if (data.files) {
      const persistedImages = {};
      data.files.forEach((file) => {
        // Use the file ID as the key instead of the file name
        persistedImages[file.id] = {
          url: `https://drive.google.com/uc?export=view&id=${file.id}`,
          id: file.id,
          originalName: file.name || `image_${file.id}.jpeg`
        };
      });
      setFolderStructure((prevStructure) => {
        const updated = { ...prevStructure };
        updated.Folders.Samples = persistedImages;
        return updated;
      });
    }
  } catch (error) {
    console.error("Error fetching persisted samples images:", error);
  }
};

  useEffect(() => {
    if (currentFolder === "Equipment") {
      fetchPersistedImages();
    } else if (currentFolder === "Samples") {
      fetchSamplesImages();
    }
  }, [currentFolder]);


  useEffect(() => {
    if (addingFolder && newFolderInputRef.current) {
      newFolderInputRef.current.focus();
    }
  }, [addingFolder]);


  useEffect(() => {
    // Close context menu and mobile actions when clicking outside
    const handleClickOutside = (e) => {
      if (contextMenu.show) {
        setContextMenu({ show: false, x: 0, y: 0, item: null, key: "" });
      }

      if (folderContextMenu.show) {
        setFolderContextMenu({ show: false, x: 0, y: 0, folderName: "" });
      }
      
      // Only close the mobile actions if we clicked outside the item
      if (showItemActions) {
        // Check if the click was inside an item with the mobile-menu-container class
        const clickedOnMenu = e.target.closest('.mobile-menu-container');
        if (!clickedOnMenu) {
          setShowItemActions(null);
        }
      }
    };

    
    // Close rename input when clicking outside and confirm the rename
    const handleClickOutsideRename = (e) => {
      if (renaming.active && renameInputRef.current && !renameInputRef.current.contains(e.target)) {
        // Confirm the rename when clicking outside
        handleRenameConfirm();
      }
    };

    // Close enlarged image modal when clicking outside
    const handleClickOutsideModal = (e) => {
      if (enlargedImage.show && 
          e.target.id !== 'enlarged-image-container' && 
          !e.target.closest('#enlarged-image-inner')) {
        setEnlargedImage({ show: false, url: "", name: "" });
      }
    };

    const handleClickOutsideNewFolder = (e) => {
      if (addingFolder && newFolderInputRef.current && !newFolderInputRef.current.contains(e.target)) {
        if (newFolderName.trim()) {
          handleAddFolder();
        } else {
          setAddingFolder(false);
        }
      }
    };

    window.addEventListener("click", handleClickOutside);
    window.addEventListener("click", handleClickOutsideRename);
    window.addEventListener("click", handleClickOutsideModal);
    window.addEventListener("click", handleClickOutsideNewFolder);
    
    // Handle escape key for modal
    const handleEscKey = (e) => {
      if (e.key === 'Escape' && enlargedImage.show) {
        setEnlargedImage({ show: false, url: "", name: "" });
      }
    };
    
    window.addEventListener('keydown', handleEscKey);
    
    return () => {
      window.removeEventListener("click", handleClickOutside);
      window.removeEventListener("click", handleClickOutsideRename);
      window.removeEventListener("click", handleClickOutsideModal);
      window.removeEventListener("click", handleClickOutsideNewFolder);
      window.removeEventListener('keydown', handleEscKey);
    };
  }, [contextMenu.show, renaming.active, showItemActions, enlargedImage.show]);

  // Make sure to clear timers when unmounting
  useEffect(() => {
    return () => {
      if (touchTimer) clearTimeout(touchTimer);
    };
  }, [touchTimer]);

  const renderNameField = (key, image) => {
    if (renaming.active && renaming.key === key) {
      return (
        <div style={{ display: "flex", alignItems: "center" }}>
          <input
            ref={renameInputRef}
            type="text"
            value={renaming.value}
            onChange={(e) => setRenaming({...renaming, value: e.target.value})}
            onKeyDown={(e) => e.key === "Enter" && handleRenameConfirm()}
            onBlur={() => handleRenameConfirm()}
            style={{ 
              width: "100%",
              padding: "4px",
              border: "1px solid #007bff",
              borderRadius: "4px"
            }}
          />
        </div>
      );
    } else {
      return image.originalName || key.replace(/^(local_|image_)/, '').replace(/\.[^/.]+$/, '');
    }
  };

  const handleImageUpload = async (event) => {
    const files = Array.from(event.target.files);
    
    for (const file of files) {
      try {
        // Create local preview with original filename
        const url = URL.createObjectURL(file);
        const fileName = file.name;
        
        // Generate a unique temporary key for the file
        const tempId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        setFolderStructure((prevStructure) => {
          const updated = { ...prevStructure };
          updated.Folders[currentFolder][tempId] = { 
            url, 
            originalName: fileName,
            isLocal: true,
            tempId: tempId // Store the temp ID for later reference
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
        
        // Remove the temporary item once we've refreshed from the server
        if (currentFolder === "Equipment" || currentFolder === "Samples") {
          // Remove the temp item first to avoid duplicates
          setFolderStructure((prevStructure) => {
            const updated = { ...prevStructure };
            delete updated.Folders[currentFolder][tempId];
            return updated;
          });
          
          // Then fetch the updated list from the server
          if (currentFolder === "Equipment") {
            fetchPersistedImages();
          } else if (currentFolder === "Samples") {
            fetchSamplesImages();
          }
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
      
      if ((currentFolder === "Equipment" || currentFolder === "Samples") && image.id) {
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
            if (currentFolder === "Equipment") {
              fetchPersistedImages();
            } else if (currentFolder === "Samples") {
              fetchSamplesImages();
            }
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


  const handleAddFolderClick = () => {
    setAddingFolder(true);
    setNewFolderName("");
  };

  const handleAddFolder = () => {
    const trimmedName = newFolderName.trim();
    if (trimmedName) {
      // Check if folder name already exists before updating
      if (folderStructure.Folders[trimmedName]) {
        alert(`Folder "${trimmedName}" already exists.`);
        return;
      }
      
      setFolderStructure(prevStructure => {
        const updated = { ...prevStructure };
        // Add new folder with empty content
        updated.Folders[trimmedName] = {};
        return updated;
      });
      setAddingFolder(false);
      setNewFolderName("");
    }
  };

  const handleFolderContextMenu = (e, folderName) => {
    e.preventDefault();
    setFolderContextMenu({
      show: true,
      x: e.pageX,
      y: e.pageY,
      folderName: folderName
    });
  };

  const handleDeleteFolder = (folderName) => {
    if (Object.keys(folderStructure.Folders).length <= 1) {
      alert("Cannot delete the last folder.");
      return;
    }

    const confirmDelete = window.confirm(`Are you sure you want to delete the folder "${folderName}" and all its contents?`);
    if (confirmDelete) {
      setFolderStructure(prevStructure => {
        const updated = { ...prevStructure };
        delete updated.Folders[folderName];
        return updated;
      });
      
      // If we deleted the current folder, switch to the first available folder
      if (currentFolder === folderName) {
        const remainingFolders = Object.keys(folderStructure.Folders).filter(f => f !== folderName);
        if (remainingFolders.length > 0) {
          setCurrentFolder(remainingFolders[0]);
        }
      }
      
      setFolderContextMenu({ show: false, x: 0, y: 0, folderName: "" });
    }
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

  const handlePasteImage = async () => {
    if (!clipboard.key || !clipboard.item) {
      console.log("Nothing in clipboard");
      return;
    }
    
    console.log("Pasting from clipboard:", clipboard);
    
    // Create a unique name for display purposes
    let newFileName = clipboard.item.originalName || clipboard.key;
    let counter = 1;
    
    // Check if file with same name exists in target folder
    while (Object.values(folderStructure.Folders[currentFolder]).some(
      item => item.originalName === newFileName
    )) {
      const nameParts = newFileName.split('.');
      const ext = nameParts.length > 1 ? `.${nameParts.pop()}` : '';
      const baseName = nameParts.join('.');
      newFileName = `${baseName} (${counter})${ext}`;
      counter++;
    }
    
    // Generate a new ID
    const newId = `copy_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // If we're pasting to Equipment or Samples folder and the item has an ID (it's in Google Drive)
    if ((currentFolder === "Equipment" || currentFolder === "Samples") && clipboard.item.id) {
      try {
        // First show a temporary copy with loading indicator
        const tempId = `temp_${Date.now()}`;
        setFolderStructure(prevStructure => {
          const updated = { ...prevStructure };
          updated.Folders[currentFolder][tempId] = {
            url: clipboard.item.url, 
            id: tempId,
            originalName: `${newFileName} (copying...)`,
            isLoading: true
          };
          return updated;
        });
        
        // Call API to duplicate the file in Google Drive
        const res = await fetch("/api/copyFile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            fileId: clipboard.item.id,
            newName: newFileName,
            targetFolder: currentFolder // Pass the target folder to the API
          }),
        });
        
        const data = await res.json();
        console.log("File copy response:", data);
        
        if (data.success && data.file && data.file.id) {
          // Remove temporary item
          setFolderStructure(prevStructure => {
            const updated = { ...prevStructure };
            delete updated.Folders[currentFolder][tempId];
            return updated;
          });
          
          setFolderStructure(prevStructure => {
            const updated = { ...prevStructure };
            updated.Folders[currentFolder][data.file.id] = {
              url: data.file.url || `https://drive.google.com/uc?export=view&id=${data.file.id}`,
              id: data.file.id,
              originalName: data.file.name || newFileName
            };
            return updated;
          });
        } else {
          // Handle error case
          setFolderStructure(prevStructure => {
            const updated = { ...prevStructure };
            delete updated.Folders[currentFolder][tempId];
            return updated;
          });
          console.error("Error copying file:", data.message);
        }
      } catch (error) {
        console.error("Error copying file to Google Drive:", error);
      }
    } 
    // For other folders, we'll create a placeholder image
    else {
      // Show loading state first
      setFolderStructure(prevStructure => {
        const updated = { ...prevStructure };
        updated.Folders[currentFolder][newId] = {
          url: clipboard.item.url, // Temporary
          id: newId,
          originalName: `${newFileName} (preparing...)`,
          isLoading: true
        };
        return updated;
      });
      
      // For copied images, use a placeholder colored box as fallback
      // This ensures something is always visible even if URL can't be displayed
      setFolderStructure(prevStructure => {
        const updated = { ...prevStructure };
        
        // Create a colored placeholder with the first letter
        const firstLetter = newFileName.charAt(0).toUpperCase();
        const color = getRandomColor();
        
        // Use a data URL with SVG for the placeholder
        const svgPlaceholder = `
          <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
            <rect width="200" height="200" fill="${color}" />
            <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="white" font-size="80">
              ${firstLetter}
            </text>
          </svg>
        `;
        
        const dataUrl = `data:image/svg+xml;base64,${btoa(svgPlaceholder)}`;
        
        updated.Folders[currentFolder][newId] = {
          url: dataUrl,
          id: newId,
          originalName: newFileName,
          isPasted: true,
          sourceUrl: clipboard.item.url // Keep original URL for reference
        };
        
        // For cut operations, remove the original
        if (clipboard.action === "cut") {
          delete updated.Folders[clipboard.folder][clipboard.key];
        }
        
        return updated;
      });
    }
    
    // Always clear clipboard after paste
    setClipboard({ action: "", folder: "", key: "", item: null });
  };


  // Add this helper function to generate random colors
  const getRandomColor = () => {
    // Use a limited set of good-looking colors
    const colors = [
      "#3498db", // Blue
      "#2ecc71", // Green
      "#e74c3c", // Red
      "#f39c12", // Orange
      "#9b59b6", // Purple
      "#1abc9c", // Turquoise
      "#34495e", // Dark Blue
      "#d35400"  // Dark Orange
    ];
    
    return colors[Math.floor(Math.random() * colors.length)];
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

  // Handle touch start events for long-press detection
  const handleTouchStart = (e, item, key) => {
  // Don't start long-press detection if we're touching a button
  if (e.target.closest('.mobile-actions') || e.target.closest('.mobile-menu-container > div > div')) {
    return;
  }

  // Clear any existing touch timer
  if (touchTimer) clearTimeout(touchTimer);

  // Start a new timer for long press
  const timer = setTimeout(() => {
    // Calculate position for context menu
    const touch = e.touches[0];
    
    setContextMenu({
      show: true,
      x: Math.min(touch.clientX, window.innerWidth - 150),
      y: Math.min(touch.clientY, window.innerHeight - 200),
      item: item,
      key: key
    });
  }, 700); // Slightly longer threshold to allow taps to work better

  setTouchTimer(timer);
  };

  // Handle touch end events
  const handleTouchEnd = (e, item) => {
    if (touchTimer) {
      clearTimeout(touchTimer);
      setTouchTimer(null);
      
      const tapDuration = e.timeStamp - e.target.dataset.touchStartTime;
      if (tapDuration < 500 && !contextMenu.show && !showItemActions) {
        e.preventDefault();
        
        // Use the same URL formatting logic as handleImageClick
        let imageUrl = item.url;
        if (item.id && imageUrl.includes('drive.google.com')) {
          imageUrl = `https://drive.google.com/uc?export=view&id=${item.id}`;
        }
        
        // Reset image states
        setImageLoaded(false);
        setLoadError(false);
        
        setEnlargedImage({
          show: true,
          url: imageUrl,
          name: item.originalName || 'Image',
          isLoading: true
        });
      }
    }
  };

  // Updated touch start with better timing
  const handleTouchStartWithTracking = (e, item, key) => {
    // Store touch start time for tap detection
    e.target.dataset.touchStartTime = e.timeStamp;
    handleTouchStart(e, item, key);
  };

  // Toggle mobile action buttons
  const toggleItemActions = (key) => {
    if (showItemActions === key) {
      setShowItemActions(null);
    } else {
      setShowItemActions(key);
    }
  };

  // Function to handle image click to enlarge
  const handleImageClick = (e, image) => {
    // Skip if clicking on buttons or action menu
    if (e.target.closest('.mobile-actions') || 
        e.target.closest('.mobile-menu-container > div > div') || 
        contextMenu.show || 
        showItemActions) {
      return;
    }
    
    e.stopPropagation();
    
    if (touchTimer) {
      clearTimeout(touchTimer);
      setTouchTimer(null);
    }
    
    // Determine the correct URL to use
    let imageUrl = image.url;
    
    // Special handling for Google Drive images - try a different approach
    if (image.id && imageUrl.includes('drive.google.com')) {
      // Format 1: Try the thumbnail URL first (more reliable but lower quality)
      imageUrl = `https://drive.google.com/thumbnail?id=${image.id}&sz=w1000`;
    }
    
    console.log("Opening image:", imageUrl); // Debug log
    
    // Reset image states when opening a new image
    setImageLoaded(false);
    setLoadError(false);
    
    setEnlargedImage({
      show: true,
      url: imageUrl,
      name: image.originalName || 'Image',
      isLoading: true,
      id: image.id // Store ID for potential fallback options
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

  // Render enlarged image modal
  const renderEnlargedImageModal = () => {
      if (!enlargedImage.show) return null;
      
      // Handle image load error by trying alternative formats
      const handleImageError = () => {
            console.error("Error loading image, trying fallback");
            setLoadError(true);
            
            // If we have an ID, we could try alternative URLs here
            if (enlargedImage.id) {
              console.log("Could try alternative URL formats here");
              // We could set a different URL here if needed
            }
          };
      
      return (
        <div 
          id="enlarged-image-container"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1001,
            cursor: 'pointer'
          }}
          onClick={() => setEnlargedImage({ show: false, url: "", name: "" })}
        >
          <div 
            id="enlarged-image-inner"
            style={{
              position: 'relative',
              width: '90%',
              maxWidth: '90vw', 
              maxHeight: '85vh',
              background: '#fff',
              borderRadius: '8px',
              overflow: 'hidden',
              boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
              cursor: 'default',
              display: 'flex',
              flexDirection: 'column'
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Close button */}
            <div style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              zIndex: 1002,
              background: 'rgba(255,255,255,0.7)',
              borderRadius: '50%',
              padding: '5px',
              cursor: 'pointer'
            }}
            onClick={() => setEnlargedImage({ show: false, url: "", name: "" })}
            >
              <XCircle size={28} color="#333" />
            </div>
            
            {/* Image container */}
            <div style={{ 
              padding: '20px', 
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '300px'
            }}>
              {/* Regular img tag for direct image viewing */}
              {!loadError ? (
                <img 
                  src={enlargedImage.url}
                  alt={enlargedImage.name}
                  style={{ 
                    maxWidth: '100%', 
                    maxHeight: '70vh',
                    objectFit: 'contain',
                    display: imageLoaded ? 'block' : 'none' // Only show once loaded
                  }}
                  onLoad={() => {
                    console.log("Image loaded successfully");
                    setImageLoaded(true);
                  }}
                  onError={handleImageError}
                />
              ) : (
                <div style={{
                  padding: '20px',
                  textAlign: 'center',
                  color: '#333'
                }}>
                  {/* Display a simpler fallback when Google Drive image fails */}
                  <div style={{
                    width: '200px',
                    height: '200px',
                    background: '#f0f0f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 20px auto',
                    borderRadius: '8px'
                  }}>
                    <Camera size={64} color="#999" />
                  </div>
                  <p>Image preview unavailable</p>
                  <p style={{fontSize: '0.9em', marginTop: '5px'}}>
                    Try viewing this image in the Google Drive interface.
                  </p>
                </div>
              )}
              
              {/* Loading indicator */}
              {!imageLoaded && !loadError && (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '30px'
                }}>
                  <div style={{ 
                    border: '4px solid #f3f3f3',
                    borderTop: '4px solid #3498db',
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    animation: 'spin 1s linear infinite',
                    marginBottom: '15px'
                  }}></div>
                  <p>Loading image...</p>
                  <style jsx>{`
                    @keyframes spin {
                      0% { transform: rotate(0deg); }
                      100% { transform: rotate(360deg); }
                    }
                  `}</style>
                </div>
              )}
              
              {/* Image caption */}
              <h3 style={{ 
                margin: '15px 0 0 0',
                color: '#333',
                fontWeight: 'normal',
                fontSize: '16px'
              }}>
                {enlargedImage.name}
              </h3>
            </div>
          </div>
        </div>
      );
    };

  const renderFolderContextMenu = () => {
    if (!folderContextMenu.show) return null;
    
    const menuStyles = {
      position: 'fixed',
      top: `${folderContextMenu.y}px`,
      left: `${folderContextMenu.x}px`,
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
          style={{ ...menuItemStyles, color: 'red' }}
          onClick={() => handleDeleteFolder(folderContextMenu.folderName)}
        >
          <Trash size={14} /> Delete Folder
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
          gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
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
            onContextMenu={(e)     => handleContextMenu(e, image, key)}
            onTouchStart={(e)       => handleTouchStartWithTracking(e, image, key)}
            onTouchEnd={(e)         => handleTouchEnd(e, image)}
            onClick={(e)            => handleImageClick(e, image)} 
            className="mobile-menu-container"
          >

            <div 
              style={{ height: "120px", position: "relative", cursor: "pointer" }}
              onClick={(e) => handleImageClick(e, image)}
              className="image-container"
            >
            {image.isLoading ? (
              <div style={{ 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center", 
                height: "100%", 
                background: "#f5f5f5" 
              }}>
                {/* Loading spinner code - keep this unchanged */}
                <div style={{ 
                  border: "4px solid #f3f3f3", 
                  borderTop: "4px solid #3498db", 
                  borderRadius: "50%", 
                  width: "30px", 
                  height: "30px", 
                  animation: "spin 1s linear infinite" 
                }}></div>
                <style jsx>{`
                  @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                  }
                `}</style>
              </div>
            ) : (
              // This is the new conditional rendering part
              image.isPasted ? (
                <img
                  src={image.url}
                  alt={image.originalName || key}
                  style={{ 
                    width: "100%", 
                    height: "100%", 
                    objectFit: "cover"
                  }}
                  onClick={(e) => handleImageClick(e, image)}
                />
              ) : (
                // Regular Next.js Image for standard items
                <Image
                  src={image.url}
                  alt={image.originalName || key}
                  fill
                  style={{ objectFit: "cover" }}
                  onClick={(e) => handleImageClick(e, image)}
                />
              )
            )}
              
              {/* Mobile action button */}
              {isMobile && (
                <div 
                  style={{
                    position: "absolute",
                    top: "5px",
                    right: "5px",
                    background: "rgba(255,255,255,0.7)",
                    borderRadius: "50%",
                    width: "30px",
                    height: "30px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 5
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleItemActions(key);
                  }}
                >
                  <MoreVertical size={18} color="#333" />
                </div>
              )}
              
              {/* Mobile action buttons that appear when menu button is clicked */}
              {isMobile && showItemActions === key && (
                <div style={{
                  position: "absolute",
                  top: "5px",
                  right: "40px",
                  background: "white",
                  borderRadius: "4px",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
                  zIndex: 10,
                  padding: "5px"
                }}>
                  {/* Your mobile action menu items remain unchanged */}
                  <div 
                    style={{
                      padding: "8px",
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      cursor: "pointer",
                      borderBottom: "1px solid #eee",
                      color: "#333"
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRenameStart(key, image.originalName);
                      setShowItemActions(null);
                    }}
                  >
                    <Edit size={16} /> Rename
                  </div>
                  <div 
                    style={{
                      padding: "8px",
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      cursor: "pointer",
                      borderBottom: "1px solid #eee",
                      color: "#333"
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopyImage(key, image);
                      setShowItemActions(null);
                    }}
                  >
                    <Copy size={16} /> Copy
                  </div>
                  <div 
                    style={{
                      padding: "8px",
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      cursor: "pointer",
                      borderBottom: "1px solid #eee",
                      color: "#333"
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCutImage(key, image);
                      setShowItemActions(null);
                    }}
                  >
                    <Scissors size={16} /> Cut
                  </div>
                  <div 
                    style={{
                      padding: "8px",
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      cursor: "pointer",
                      color: "red"
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteImage(image, key);
                      setShowItemActions(null);
                    }}
                  >
                    <Trash size={16} /> Delete
                  </div>
                </div>
              )}
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
              {renderNameField(key, image)}
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
        padding: "10px",
        position: "relative",
        height: "100vh",
      }}
    >
      <h1>🔧 Set-Up & Equipment</h1>
      <p>Manage your experimental setup and materials.</p>

      <div style={{ 
        display: "flex", 
        height: "70vh", 
        margin: "10px auto",
        border: "2px solid #ccc",
        borderRadius: "8px",
        overflow: "hidden",
        background: "#f9f9f9",
        maxWidth: "100%",
        position: "relative"
      }}>
        {/* Mobile toggle menu button */}
        {isMobile && (
          <button
            onClick={() => setSidebarVisible(!sidebarVisible)}
            style={{
              position: "absolute",
              top: "10px",
              left: "10px",
              zIndex: 100,
              background: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              width: "36px",
              height: "36px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer"
            }}
          >
            <Menu size={20} />
          </button>
        )}
        
        {/* Folder navigation sidebar - conditionally shown on mobile */}
        <div style={{ 
          width: isMobile ? (sidebarVisible ? "80%" : "0") : "220px",
          borderRight: "1px solid #ddd",
          overflowY: "auto",
          background: "#f0f0f0",
          transition: "width 0.3s ease",
          position: isMobile ? "absolute" : "relative",
          height: "100%",
          zIndex: isMobile ? "50" : "1",
          boxShadow: isMobile && sidebarVisible ? "2px 0 5px rgba(0,0,0,0.2)" : "none"
        }}>
          {(sidebarVisible || !isMobile) && (
            <>
              <h3 style={{ padding: "15px 15px 5px", color: "#333", margin: 0 }}>📁 Folders</h3>
              {renderSidebar()}
            </>
          )}
        </div>
        
        {/* Content area - full width on mobile when sidebar is hidden */}
        <div style={{ 
          flex: 1, 
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          marginLeft: isMobile && sidebarVisible ? "80%" : 0,
          transition: "margin-left 0.3s ease",
          width: isMobile && sidebarVisible ? "100%" : "auto"
        }}>
          <h3 style={{ 
            padding: "15px", 
            margin: 0, 
            borderBottom: "1px solid #ddd",
            color: "#333",
            display: "flex",
            alignItems: "center",
            paddingLeft: isMobile ? "60px" : "15px" // Make room for the menu button
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
          bottom: isMobile ? "15px" : "20px",
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
          width: "56px",
          height: "56px",
          boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
        }}
      >
        <Camera size={28} />
      </button>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageUpload}
        accept="image/*"
        multiple
        style={{ display: "none" }}
      />

      {/* Only show navigation buttons if not in mobile view or conditionally */}
      <div style={{ 
        position: "absolute", 
        bottom: "20px", 
        left: "10px"
      }}>
        <Link href="/experiments/experiment-1">
          <button style={{ 
            padding: "12px 20px", 
            fontSize: "16px", 
            cursor: "pointer",
            background: "transparent",
            border: "none",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}>
            <ChevronLeft size={20} />
            Experiment 1
          </button>
        </Link>
      </div>

      <div style={{ 
        position: "absolute", 
        bottom: "20px", 
        right: "10px" 
      }}>
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
    {renderEnlargedImageModal()}
    {renderFolderContextMenu()}
    </main>
  );
}