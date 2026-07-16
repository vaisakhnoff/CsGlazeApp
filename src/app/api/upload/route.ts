import { NextResponse } from "next/server";
import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";
import { prisma } from "@/lib/prisma";
import { uploadImageToCloudinary } from "@/lib/cloudinary";
import { getAdminSession } from "@/lib/session";

// Increase body size limit to 10 MB to handle large mobile photos
export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
  },
};

const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export async function POST(req: Request) {
  try {
    if (!(await getAdminSession())) {
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

    if (file.type && !ALLOWED_IMAGE_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: "Only JPEG, PNG, or WebP images are allowed" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    let imageProcessor = sharp(buffer);

    if (cropData) {
      try {
        const parsedCrop = JSON.parse(cropData as string);

        if (parsedCrop.width && parsedCrop.height) {
          imageProcessor = imageProcessor.extract({
            left: Math.round(parsedCrop.x),
            top: Math.round(parsedCrop.y),
            width: Math.round(parsedCrop.width),
            height: Math.round(parsedCrop.height),
          });
        }
      } catch {
        return NextResponse.json({ error: "Invalid crop data" }, { status: 400 });
      }
    }

    const optimizedBuffer = await imageProcessor
      .rotate()
      .webp({ quality: 82 })
      .toBuffer();

    const uploadId = uuidv4();
    const cloudinaryImage = await uploadImageToCloudinary(optimizedBuffer, uploadId);

    const imageRecord = await prisma.image.create({
      data: {
        url: cloudinaryImage.secureUrl,
        cloudinaryPublicId: cloudinaryImage.publicId,
        altText: altText || file.name,
        category: category || "Uncategorized",
      },
    });

    return NextResponse.json({ success: true, image: imageRecord });
  } catch (error) {
    console.error("Upload error:", error);

    const message =
      error instanceof Error && error.message.includes("Cloudinary is not configured")
        ? error.message
        : "Failed to upload file";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
