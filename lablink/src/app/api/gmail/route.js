import { google } from "googleapis";
import fs from "fs";
import path from "path";

export async function GET(req) {
  const auth = new google.auth.GoogleAuth({
    keyFile: "path-to-your-service-account.json",
    scopes: ["https://www.googleapis.com/auth/gmail.readonly"],
  });

  const gmail = google.gmail({ version: "v1", auth });

  // Get the latest email
  const res = await gmail.users.messages.list({
    userId: "me",
    maxResults: 5,
  });

  const messageId = res.data.messages[0].id;
  const message = await gmail.users.messages.get({
    userId: "me",
    id: messageId,
  });

  const emailText = message.data.snippet;
  console.log(`📩 Received Email: ${emailText}`);

  // Process attachments (if image is found)
  const attachments = message.data.payload.parts?.filter(part => part.mimeType.startsWith("image/"));
  if (attachments.length > 0) {
    const attachmentId = attachments[0].body.attachmentId;
    const attachmentRes = await gmail.users.messages.attachments.get({
      userId: "me",
      messageId,
      id: attachmentId,
    });

    const imageData = attachmentRes.data.data;
    const savePath = "public/uploads/experiments/experiment-1/equipment-setup/";
    fs.mkdirSync(savePath, { recursive: true });
    fs.writeFileSync(path.join(savePath, `${Date.now()}.jpg`), Buffer.from(imageData, "base64"));
    console.log(`✅ Image saved!`);
  }

  return new Response("Email processed");
}
