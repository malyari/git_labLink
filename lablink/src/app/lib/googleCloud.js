import { Storage } from "@google-cloud/storage";
import path from "path";

// Path to your service account key JSON
const keyPath = path.join(process.cwd(), "config/service-account.json");

// Initialize Google Cloud Storage
const storage = new Storage({ keyFilename: keyPath });
const bucketName = "your-bucket-name"; // Replace with your actual bucket name
const bucket = storage.bucket(bucketName);

export async function uploadFile(file) {
  return new Promise((resolve, reject) => {
    const blob = bucket.file(file.originalname);
    const blobStream = blob.createWriteStream({
      resumable: false,
      public: true, // Ensure public access
    });

    blobStream.on("error", (err) => reject(err));
    blobStream.on("finish", async () => {
      try {
        await blob.makePublic(); // Make the file publicly accessible
        const publicUrl = `https://storage.googleapis.com/${bucketName}/${blob.name}`;
        resolve(publicUrl);
      } catch (err) {
        reject(err);
      }
    });

    blobStream.end(file.buffer);
  });
}
