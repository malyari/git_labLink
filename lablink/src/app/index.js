// pages/index.js
import { useState } from 'react';

export default function Home() {
  const [file, setFile] = useState(null);
  const [uploadedUrl, setUploadedUrl] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Handle file selection
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Upload file to the API endpoint
  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error('Upload failed');
      }

      const data = await res.json();
      setUploadedUrl(data.url);
    } catch (error) {
      console.error(error);
      alert('Upload failed. Check the console for details.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Upload a File to Google Cloud Storage</h1>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={uploading}>
        {uploading ? 'Uploading...' : 'Upload'}
      </button>

      {uploadedUrl && (
        <div style={{ marginTop: '2rem' }}>
          <h2>Uploaded File:</h2>
          <img src={uploadedUrl} alt="Uploaded file" style={{ maxWidth: '100%' }} />
          <p>
            URL: <a href={uploadedUrl} target="_blank" rel="noopener noreferrer">{uploadedUrl}</a>
          </p>
        </div>
      )}
    </div>
  );
}
