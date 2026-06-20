"use client";

import React, { useState, useEffect } from "react";
import { UploadCloud, Image as ImageIcon, Copy, Trash2, Check, AlertCircle } from "lucide-react";
import Image from "next/image";

type ImageRecord = { id: string; url: string; altText: string | null };

type Toast = { id: number; message: string; type: "success" | "error" };

export default function MediaLibraryPage() {
  const [images, setImages] = useState<ImageRecord[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const addToast = (message: string, type: "success" | "error") => {
    const id = Date.now();
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500);
  };

  useEffect(() => {
    fetch("/api/media")
      .then((r) => r.json())
      .then((data) => {
        if (data.images) setImages(data.images);
      })
      .catch(() => addToast("Failed to load media library.", "error"));
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploadError(null);
    setIsUploading(true);
    setUploadProgress(20);

    const formData = new FormData();
    formData.append("file", files[0]);
    formData.append("category", "General");

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      setUploadProgress(80);
      const data = await res.json();

      if (data.success) {
        setImages((prev) => [data.image, ...prev]);
        addToast("Image uploaded successfully.", "success");
      } else {
        setUploadError(data.error || "Upload failed.");
        addToast(data.error || "Upload failed.", "error");
      }
    } catch {
      setUploadError("Upload failed. Please try again.");
      addToast("Upload failed. Please try again.", "error");
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      // Reset input so the same file can be re-selected
      e.target.value = "";
    }
  };

  const copyToClipboard = async (img: ImageRecord) => {
    try {
      await navigator.clipboard.writeText(img.url);
      setCopiedId(img.id);
      addToast("URL copied to clipboard!", "success");
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      addToast("Failed to copy URL.", "error");
    }
  };

  const handleDelete = async (img: ImageRecord) => {
    if (!confirm(`Delete "${img.altText || img.url}"? This cannot be undone.`)) return;
    setDeletingId(img.id);
    try {
      const res = await fetch(`/api/media?id=${img.id}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok && data.success) {
        setImages((prev) => prev.filter((i) => i.id !== img.id));
        addToast("Image deleted.", "success");
      } else {
        addToast(data.error || "Delete failed.", "error");
      }
    } catch {
      addToast("Delete failed. Please try again.", "error");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Toast notifications */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium shadow-lg pointer-events-auto animate-in slide-in-from-right-4 duration-300 ${
              t.type === "success"
                ? "bg-white border border-green-500/30 text-green-700"
                : "bg-white border border-red-500/30 text-red-600"
            }`}
          >
            {t.type === "success" ? <Check size={15} /> : <AlertCircle size={15} />}
            {t.message}
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-black tracking-tight">Media Library</h1>
          <p className="text-[#888] mt-2">Manage all your uploaded images and assets.</p>
        </div>

        <div className="relative">
          <input
            type="file"
            accept="image/*"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={handleFileUpload}
            disabled={isUploading}
          />
          <div className="flex items-center gap-2 px-4 py-2 bg-black text-white text-sm font-medium rounded-md hover:bg-[#222] transition-colors">
            <UploadCloud size={16} />
            {isUploading ? "Uploading..." : "Upload Image"}
          </div>
        </div>
      </div>

      {isUploading && (
        <div className="w-full bg-[#f6f6f6] rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-black h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${uploadProgress}%` }}
          />
        </div>
      )}

      {uploadError && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
          <AlertCircle size={15} />
          {uploadError}
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {images.length === 0 ? (
          <div className="col-span-full py-12 text-center text-[#666] border border-dashed border-[#c7c7c7] rounded-xl flex flex-col items-center gap-2">
            <ImageIcon size={32} />
            <p>No media files uploaded yet.</p>
          </div>
        ) : (
          images.map((img) => (
            <div
              key={img.id}
              className="group relative aspect-square rounded-xl overflow-hidden bg-[#f6f6f6] border border-[#d6d6d6]"
            >
              <Image
                src={img.url}
                alt={img.altText || "Uploaded image"}
                fill
                className="object-cover transition-transform group-hover:scale-105 duration-500"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <button
                  onClick={() => copyToClipboard(img)}
                  className="p-2 bg-white/10 hover:bg-white text-white hover:text-black rounded-full backdrop-blur-sm transition-colors"
                  title="Copy URL"
                >
                  {copiedId === img.id ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
                </button>
                <button
                  onClick={() => handleDelete(img)}
                  disabled={deletingId === img.id}
                  className="p-2 bg-red-500/20 hover:bg-red-500 text-white rounded-full backdrop-blur-sm transition-colors disabled:opacity-50"
                  title="Delete Image"
                >
                  <Trash2 size={16} className={deletingId === img.id ? "animate-pulse" : ""} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
