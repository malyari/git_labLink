// pages/api/copyFile.js
import { google } from 'googleapis';
import { getAuthClient } from '../../utils/googleAuth';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { fileId, newFileName, targetFolder } = req.body;

  if (!fileId) {
    return res.status(400).json({ error: 'File ID is required' });
  }

  try {
    const auth = await getAuthClient();
    const drive = google.drive({ version: 'v3', auth });
    
    // Get the file metadata
    const fileMetadata = await drive.files.get({
      fileId: fileId,
      fields: 'name,mimeType'
    });
    
    // Create a copy
    const response = await drive.files.copy({
      fileId: fileId,
      requestBody: {
        name: newFileName || fileMetadata.data.name,
        // You can add folder information here if needed
      }
    });
    
    return res.status(200).json({ 
      id: response.data.id,
      name: response.data.name
    });
  } catch (error) {
    console.error('Error copying file:', error);
    return res.status(500).json({ error: 'Failed to copy file' });
  }
}