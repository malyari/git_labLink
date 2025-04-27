import { google } from 'googleapis';
import { Readable } from 'stream';

export async function POST(request) {
  try {
    const { fileName, fileContent, mimeType, folder } = await request.json();

    if (!fileName || !fileContent || !mimeType) {
      return new Response(
        JSON.stringify({ message: 'Missing required parameters' }),
        { status: 400 }
      );
    }

    // Set up Google authentication
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        // Replace any escaped newline characters with actual newlines
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/drive.file'],
    });

    const drive = google.drive({ version: 'v3', auth });

    // Convert the file content from base64 to a Buffer and then a stream
    const fileBuffer = Buffer.from(fileContent, 'base64');
    const fileStream = Readable.from(fileBuffer);

    // Map folder names to Google Drive folder IDs
    const folderMapping = {
      Equipment: '1UDXRUKos519IxqgtNjI7k8VSsikZA6-d', // Equipment folder ID
      Samples: '10YvG1tGFDKpa-Q5gi_8mFS8xAhLfF_Tv', // Samples folder ID from env variable
      // You can also hardcode the Samples folder ID if preferred
      // Samples: 'your-samples-folder-id-here',
    };

    // Build the request body
    let requestBody = {
      name: fileName,
      mimeType: mimeType,
    };

    // If a valid folder is provided, include it as the parent folder
    if (folder && folderMapping[folder]) {
      requestBody.parents = [folderMapping[folder]];
    } else {
      // If no valid folder is provided, return an error
      return new Response(
        JSON.stringify({ 
          message: 'Invalid folder specified',
          validFolders: Object.keys(folderMapping)
        }),
        { status: 400 }
      );
    }

    // Create the file on Google Drive
    const createResponse = await drive.files.create({
      requestBody,
      media: {
        mimeType: mimeType,
        body: fileStream,
      },
    });

    const fileId = createResponse.data.id;
    console.log(`File created with ID: ${fileId} in folder: ${folder}`);

    // Update file permissions so anyone with the link can view it
    await drive.permissions.create({
      fileId: fileId,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    });

    // Get the file metadata to retrieve the web view link
    const fileData = await drive.files.get({
      fileId: fileId,
      fields: 'id, webViewLink, name',
    });

    return new Response(
      JSON.stringify({
        fileId: fileData.data.id,
        webViewLink: fileData.data.webViewLink,
        name: fileData.data.name,
        folder: folder
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error uploading file:", error);
    return new Response(
      JSON.stringify({
        message: 'Error uploading file',
        error: error.message,
      }),
      { status: 500 }
    );
  }
}