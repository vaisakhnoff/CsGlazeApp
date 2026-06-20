"use client";

import React, { useState, useRef, useCallback } from "react";
import ReactCrop, { type Crop, centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { X, Upload, Crop as CropIcon, Check, ImagePlus } from "lucide-react";

interface UploadedImage {
  id: string;   // DB Image id
  url: string;
}

interface Props {
  onImagesChange: (ids: string[]) => void;
  initialImages?: UploadedImage[];
}

function centerAspectCrop(w: number, h: number) {
  return centerCrop(makeAspectCrop({ unit: "%", width: 90 }, 16 / 9, w, h), w, h);
}

export function ImageCropUploader({ onImagesChange, initialImages = [] }: Props) {
  const [uploaded, setUploaded]         = useState<UploadedImage[]>(initialImages);
  const [cropSrc, setCropSrc]           = useState<string | null>(null);   // data URL of pending file
  const [pendingFile, setPendingFile]   = useState<File | null>(null);
  const [crop, setCrop]                 = useState<Crop>();
  const [uploading, setUploading]       = useState(false);
  const [error, setError]               = useState<string | null>(null);
  const imgRef                          = useRef<HTMLImageElement>(null);
  const fileInputRef                    = useRef<HTMLInputElement>(null);

  const ALLOWED = ["image/jpeg", "image/png", "image/webp"];
  const MAX_MB  = 5;

  const openFile = () => fileInputRef.current?.click();

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!ALLOWED.includes(file.type)) { setError("Only JPEG, PNG or WebP images are allowed."); return; }
    if (file.size > MAX_MB * 1024 * 1024) { setError(`Image must be under ${MAX_MB} MB.`); return; }
    setError(null);
    setPendingFile(file);
    const reader = new FileReader();
    reader.onload = () => setCropSrc(reader.result as string);
    reader.readAsDataURL(file);
  };

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth: w, naturalHeight: h } = e.currentTarget;
    setCrop(centerAspectCrop(w, h));
  };

  const getCroppedBlob = useCallback((): Promise<Blob> => {
    const img = imgRef.current;
    if (!img || !crop) return Promise.reject("No crop");
    const canvas  = document.createElement("canvas");
    const scaleX  = img.naturalWidth  / img.width;
    const scaleY  = img.naturalHeight / img.height;
    // Convert % crop to pixels
    const pixelCrop = crop.unit === "%"
      ? { x: (crop.x / 100) * img.naturalWidth, y: (crop.y / 100) * img.naturalHeight,
          width: (crop.width / 100) * img.naturalWidth, height: (crop.height / 100) * img.naturalHeight }
      : { x: crop.x * scaleX, y: crop.y * scaleY, width: crop.width * scaleX, height: crop.height * scaleY };
    canvas.width  = pixelCrop.width;
    canvas.height = pixelCrop.height;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(img, pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height, 0, 0, pixelCrop.width, pixelCrop.height);
    return new Promise((res, rej) => canvas.toBlob(b => b ? res(b) : rej("canvas empty"), "image/jpeg", 0.9));
  }, [crop]);

  const confirmCrop = async () => {
    if (!pendingFile) return;
    setUploading(true);
    setError(null);
    try {
      const blob = await getCroppedBlob();
      const fd   = new FormData();
      fd.append("file", blob, pendingFile.name);
      const res  = await fetch("/api/upload", { method: "POST", body: fd });
      if (!res.ok) throw new Error("Upload failed");
      const data: { image: UploadedImage } = await res.json();
      const next = [...uploaded, data.image];
      setUploaded(next);
      onImagesChange(next.map(i => i.id));
      setCropSrc(null);
      setPendingFile(null);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const remove = (id: string) => {
    const next = uploaded.filter(i => i.id !== id);
    setUploaded(next);
    onImagesChange(next.map(i => i.id));
  };

  return (
    <div className="space-y-3">
      {/* Thumbnails */}
      {uploaded.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {uploaded.map((img, idx) => (
            <div key={img.id} className="relative group w-20 h-20 rounded-lg overflow-hidden border border-[#c7c7c7]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.url} alt={`upload-${idx}`} className="w-full h-full object-cover" />
              {idx === 0 && (
                <span className="absolute bottom-0 left-0 right-0 text-center text-[9px] bg-black/60 text-white py-0.5">Cover</span>
              )}
              <button
                type="button"
                onClick={() => remove(img.id)}
                className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={10} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Crop modal */}
      {cropSrc && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#f6f6f6] border border-[#c7c7c7] rounded-xl p-5 w-full max-w-xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-black font-medium text-sm">
                <CropIcon size={15} /> Crop Image
              </span>
              <button type="button" onClick={() => { setCropSrc(null); setPendingFile(null); }} className="text-[#888] hover:text-black">
                <X size={18} />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-auto flex justify-center">
              <ReactCrop crop={crop} onChange={c => setCrop(c)} aspect={16 / 9}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img ref={imgRef} src={cropSrc} onLoad={onImageLoad} alt="crop-preview" className="max-w-full" />
              </ReactCrop>
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => { setCropSrc(null); setPendingFile(null); }}
                className="px-4 py-2 text-sm text-[#888] hover:text-black transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmCrop}
                disabled={uploading}
                className="px-4 py-2 text-sm bg-black text-white rounded-md font-medium flex items-center gap-2 hover:bg-[#222] disabled:opacity-50"
              >
                {uploading ? "Uploading…" : <><Check size={14} /> Use This Crop</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add button */}
      <button
        type="button"
        onClick={openFile}
        disabled={!!cropSrc}
        className="flex items-center gap-2 px-4 py-2.5 border border-dashed border-[#999] rounded-lg text-[#888] hover:text-black hover:border-black transition-colors text-sm disabled:opacity-40"
      >
        <ImagePlus size={16} />
        {uploaded.length === 0 ? "Add Images" : "Add Another Image"}
      </button>

      <input ref={fileInputRef} type="file" accept={ALLOWED.join(",")} className="hidden" onChange={onFileSelect} />

      {error && <p className="text-red-400 text-xs flex items-center gap-1"><Upload size={11} />{error}</p>}
    </div>
  );
}
