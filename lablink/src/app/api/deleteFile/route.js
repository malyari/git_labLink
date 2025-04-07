import { google } from "googleapis";

export async function DELETE(request) {
  try {
    const { fileId } = await request.json();
    if (!fileId) {
      return new Response(JSON.stringify({ message: "Missing fileId" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/drive"],
    });

    const drive = google.drive({ version: "v3", auth });
    await drive.files.delete({ fileId });

    return new Response(
      JSON.stringify({ message: "File deleted" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error deleting file:", error);
    return new Response(
      JSON.stringify({ message: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
