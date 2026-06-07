import { NextResponse } from "next/server";
import { mkdir } from "fs/promises";
import path from "path";
import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/session";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("admin_session")?.value;
    const session = await verifySession(sessionCookie);

    if (!session?.auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const cropData = formData.get("crop"); // Optional crop params
    const category = formData.get("category") as string;
    const altText = formData.get("altText") as string;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = path.extname(file.name) || ".jpg";
    const filename = `${uuidv4()}${ext}`;
    
    const uploadDir = path.join(process.cwd(), "public/uploads");
    await mkdir(uploadDir, { recursive: true });

    const filepath = path.join(uploadDir, filename);

    // Process image with Sharp
    let imageProcessor = sharp(buffer);

    // If crop data is provided (from react-image-crop)
    if (cropData) {
      const parsedCrop = JSON.parse(cropData as string);
      // parsedCrop expected to have { x, y, width, height }
      if (parsedCrop.width && parsedCrop.height) {
        imageProcessor = imageProcessor.extract({
          left: Math.round(parsedCrop.x),
          top: Math.round(parsedCrop.y),
          width: Math.round(parsedCrop.width),
          height: Math.round(parsedCrop.height),
        });
      }
    }

    // Optimize
    await imageProcessor
      .webp({ quality: 80 }) // convert to webp for better performance
      .toFile(filepath.replace(ext, ".webp"));

    const finalUrl = `/uploads/${filename.replace(ext, ".webp")}`;

    // Save to DB
    const imageRecord = await prisma.image.create({
      data: {
        url: finalUrl,
        altText: altText || file.name,
        category: category || "Uncategorized",
      },
    });

    return NextResponse.json({ success: true, image: imageRecord });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
  }
}
