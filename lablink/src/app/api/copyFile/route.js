// app/api/copyFile/route.js
import { NextResponse } from 'next/server';
import { google } from 'googleapis';

// Initialize Google Drive service
const initDriveService = async () => {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/drive'],
  });

  const drive = google.drive({ version: 'v3', auth });
  return drive;
};

export async function POST(request) {
  try {
    const body = await request.json();
    const { fileId, newName } = body;
    
    if (!fileId) {
      return NextResponse.json({ 
        success: false, 
        message: 'File ID is required' 
      }, { status: 400 });
    }

    // Initialize Google Drive API
    const drive = await initDriveService();

    // First, get the file metadata to get its MIME type and other properties
    const fileMetadata = await drive.files.get({
      fileId: fileId,
      fields: 'id,name,mimeType,parents'
    });

    // Create a copy of the file in the same folder
    const response = await drive.files.copy({
      fileId: fileId,
      requestBody: {
        name: newName || `Copy of ${fileMetadata.data.name}`,
        // Use the same parent folder as the original file
        parents: fileMetadata.data.parents
      }
    });

    // Return the new file's information
    return NextResponse.json({ 
      success: true, 
      file: {
        id: response.data.id,
        name: response.data.name,
        url: `https://drive.google.com/uc?export=view&id=${response.data.id}`
      }
    });
    
  } catch (error) {
    console.error('Error in copyFile API:', error);
    return NextResponse.json({ 
      success: false,
      message: 'Error processing request', 
      error: error.message 
    }, { status: 500 });
  }
}