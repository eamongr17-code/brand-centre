import { NextRequest, NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { r2, R2_BUCKET, R2_PUBLIC_URL } from "@/lib/r2";

// Allow large file uploads (design assets, zip files, etc.)
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const safeName = file.name.replace(/[^a-z0-9.\-_]/gi, "_");
    const key = `${Date.now()}-${safeName}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    await r2.send(
      new PutObjectCommand({
        Bucket: R2_BUCKET,
        Key: key,
        Body: buffer,
        ContentType: file.type || "application/octet-stream",
      })
    );

    return NextResponse.json({ url: `${R2_PUBLIC_URL}/${key}` });
  } catch (err) {
    console.error("R2 upload error:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
