import crypto from "crypto";

type CloudinaryUploadResult = {
  public_id: string;
  secure_url: string;
};

type CloudinaryDestroyResult = {
  result: string;
};

const CLOUDINARY_UPLOAD_URL = "https://api.cloudinary.com/v1_1";
const DEFAULT_FOLDER = "cs-glaze";

function getCloudinaryConfig() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error(
      "Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET."
    );
  }

  return { cloudName, apiKey, apiSecret };
}

function getUploadFolder() {
  return process.env.CLOUDINARY_FOLDER?.trim() || DEFAULT_FOLDER;
}

function signCloudinaryParams(params: Record<string, string | number | boolean>, apiSecret: string) {
  const payload = Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== null && value !== "")
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  return crypto.createHash("sha1").update(`${payload}${apiSecret}`).digest("hex");
}

export async function uploadImageToCloudinary(buffer: Buffer, publicId: string) {
  const { cloudName, apiKey, apiSecret } = getCloudinaryConfig();
  const timestamp = Math.round(Date.now() / 1000);
  const folder = getUploadFolder();
  const params = { folder, public_id: publicId, timestamp };
  const signature = signCloudinaryParams(params, apiSecret);

  const formData = new FormData();
  const fileBytes = new Uint8Array(buffer);
  formData.append("file", new Blob([fileBytes], { type: "image/webp" }), `${publicId}.webp`);
  formData.append("api_key", apiKey);
  formData.append("timestamp", String(timestamp));
  formData.append("folder", folder);
  formData.append("public_id", publicId);
  formData.append("signature", signature);

  const response = await fetch(`${CLOUDINARY_UPLOAD_URL}/${cloudName}/image/upload`, {
    method: "POST",
    body: formData,
  });

  const data = (await response.json()) as Partial<CloudinaryUploadResult> & {
    error?: { message?: string };
  };

  if (!response.ok || !data.secure_url || !data.public_id) {
    throw new Error(data.error?.message || "Cloudinary upload failed.");
  }

  return {
    publicId: data.public_id,
    secureUrl: data.secure_url,
  };
}

export async function deleteImageFromCloudinary(publicId: string) {
  const { cloudName, apiKey, apiSecret } = getCloudinaryConfig();
  const timestamp = Math.round(Date.now() / 1000);
  const params = { invalidate: true, public_id: publicId, timestamp };
  const signature = signCloudinaryParams(params, apiSecret);

  const formData = new FormData();
  formData.append("api_key", apiKey);
  formData.append("timestamp", String(timestamp));
  formData.append("public_id", publicId);
  formData.append("invalidate", "true");
  formData.append("signature", signature);

  const response = await fetch(`${CLOUDINARY_UPLOAD_URL}/${cloudName}/image/destroy`, {
    method: "POST",
    body: formData,
  });

  const data = (await response.json()) as Partial<CloudinaryDestroyResult> & {
    error?: { message?: string };
  };

  if (!response.ok || (data.result && !["ok", "not found"].includes(data.result))) {
    throw new Error(data.error?.message || "Cloudinary delete failed.");
  }
}
