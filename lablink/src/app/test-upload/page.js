// src/app/test-upload/page.js
'use client';

import { useState } from 'react';

export default function TestUpload() {
  const [responseMessage, setResponseMessage] = useState('');

  const handleTestUpload = async () => {
    const response = await fetch('/api/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fileName: 'example.txt',
        fileContent: 'SGVsbG8sIFdvcmxkIQ==', // "Hello, World!" in base64
        mimeType: 'text/plain'
      })
    });
    const data = await response.json();
    setResponseMessage(JSON.stringify(data));
  };

  return (
    <div>
      <h1>Test API Upload</h1>
      <button onClick={handleTestUpload}>Test API Upload</button>
      <pre>{responseMessage}</pre>
    </div>
  );
}
