"use client";

import React, { useState, useEffect } from "react";
import { UploadCloud, Image as ImageIcon, Copy, Trash2 } from "lucide-react";
import Image from "next/image";

type ImageRecord = { id: string; url: string; altText: string | null };

export default function MediaLibraryPage() {
  const [images, setImages] = useState<ImageRecord[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // In a real app we would fetch these via a Server Component or SWR.
  // We'll fetch them on mount here.
  useEffect(() => {
    fetch("/api/media")
      .then(r => r.json())
      .then(data => {
        if (data.images) setImages(data.images);
      });
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadProgress(20);

    const formData = new FormData();
    formData.append("file", files[0]);
    formData.append("category", "General");
    
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      setUploadProgress(80);
      const data = await res.json();
      
      if (data.success) {
        setImages((prev) => [data.image, ...prev]);
      }
    } catch (error) {
      console.error("Upload failed", error);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    // Could add a toast notification here
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
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
        <div className="w-full bg-[#f6f6f6] rounded-full h-1.5 mb-4 overflow-hidden">
          <div 
            className="bg-black h-1.5 rounded-full transition-all duration-300" 
            style={{ width: `${uploadProgress}%` }}
          />
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
            <div key={img.id} className="group relative aspect-square rounded-xl overflow-hidden bg-[#f6f6f6] border border-[#d6d6d6]">
              <Image 
                src={img.url} 
                alt={img.altText || "Uploaded image"} 
                fill 
                className="object-cover transition-transform group-hover:scale-105 duration-500"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <button 
                  onClick={() => copyToClipboard(img.url)}
                  className="p-2 bg-white/10 hover:bg-white text-white hover:text-black rounded-full backdrop-blur-sm transition-colors"
                  title="Copy URL"
                >
                  <Copy size={16} />
                </button>
                <button 
                  className="p-2 bg-red-500/20 hover:bg-red-500 text-white rounded-full backdrop-blur-sm transition-colors"
                  title="Delete Image"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
