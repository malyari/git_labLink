import { NextResponse } from "next/server";
import { uploadFile } from "../../lib/googleCloud";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Convert file to Buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    const fileData = {
      buffer,
      originalname: file.name,
    };

    const fileUrl = await uploadFile(fileData);

    // Ensure URL is properly returned
    if (!fileUrl || typeof fileUrl !== "string" || !fileUrl.startsWith("http")) {
      return NextResponse.json({ error: "Invalid file URL" }, { status: 500 });
    }

    return NextResponse.json({ url: fileUrl }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
