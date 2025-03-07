import { google } from "googleapis";

export async function GET(req) {
  try {
    // Authenticate with Google API
    const auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON),
      scopes: ["https://www.googleapis.com/auth/gmail.readonly"],
    });

    const gmail = google.gmail({ version: "v1", auth });

    // Fetch the latest 5 emails
    const res = await gmail.users.messages.list({
      userId: "me",
      maxResults: 5,
    });

    if (!res.data.messages) {
      return new Response(JSON.stringify({ message: "No new emails found." }), { status: 200 });
    }

    // Get the details of the latest email
    const messageId = res.data.messages[0].id;
    const message = await gmail.users.messages.get({
      userId: "me",
      id: messageId,
    });

    const emailSnippet = message.data.snippet; // The preview text of the email
    console.log(`📩 Latest Email: ${emailSnippet}`);

    return new Response(JSON.stringify({ latestEmail: emailSnippet }), { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching Gmail messages:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch emails." }), { status: 500 });
  }
}
