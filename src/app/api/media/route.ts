import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { deleteImageFromCloudinary } from "@/lib/cloudinary";
import { getAdminSession } from "@/lib/session";
import { unlink } from "fs/promises";
import path from "path";

async function authCheck() {
  return Boolean(await getAdminSession());
}

export async function GET() {
  try {
    if (!(await authCheck())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const images = await prisma.image.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ images });
  } catch {
    return NextResponse.json({ error: "Failed to fetch media" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    if (!(await authCheck())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing image id" }, { status: 400 });
    }

    const image = await prisma.image.findUnique({ where: { id } });
    if (!image) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    if (image.cloudinaryPublicId) {
      await deleteImageFromCloudinary(image.cloudinaryPublicId);
    }

    await prisma.image.delete({ where: { id } });

    // Legacy local uploads can still be removed if older records exist.
    if (image.url.startsWith("/uploads/")) {
      const filePath = path.join(process.cwd(), "public", image.url);
      try {
        await unlink(filePath);
      } catch {
        // File may already be missing.
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Media delete error:", err);
    return NextResponse.json({ error: "Failed to delete image" }, { status: 500 });
  }
}
