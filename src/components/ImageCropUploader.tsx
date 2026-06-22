"use client";

import React, { useState, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import ReactCrop, {
  type PercentCrop,
  centerCrop,
  convertToPixelCrop,
  makeAspectCrop,
} from "react-image-crop";
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

function centerAspectCrop(w: number, h: number): PercentCrop {
  return centerCrop(makeAspectCrop({ unit: "%", width: 90 }, 16 / 9, w, h), w, h);
}

export function ImageCropUploader({ onImagesChange, initialImages = [] }: Props) {
  const [uploaded, setUploaded]         = useState<UploadedImage[]>(initialImages);
  const [cropSrc, setCropSrc]           = useState<string | null>(null);   // data URL of pending file
  const [pendingFile, setPendingFile]   = useState<File | null>(null);
  const [crop, setCrop]                 = useState<PercentCrop>();
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
    const pixelCrop = convertToPixelCrop(crop, img.naturalWidth, img.naturalHeight);
    canvas.width  = Math.round(pixelCrop.width);
    canvas.height = Math.round(pixelCrop.height);
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(
      img,
      Math.round(pixelCrop.x),
      Math.round(pixelCrop.y),
      Math.round(pixelCrop.width),
      Math.round(pixelCrop.height),
      0,
      0,
      canvas.width,
      canvas.height
    );
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

      {/* Crop modal — rendered in document.body to escape overflow-hidden parents */}
      {cropSrc && createPortal(
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm sm:p-8">
          <div className="flex max-h-[90dvh] w-full max-w-4xl flex-col overflow-hidden rounded-xl border border-[#c7c7c7] bg-[#f6f6f6] shadow-2xl">
            <div className="flex h-14 flex-shrink-0 items-center justify-between border-b border-[#d6d6d6] px-4 sm:px-6">
              <span className="flex min-w-0 items-center gap-2 text-sm font-medium text-black">
                <CropIcon size={15} /> Crop Image
              </span>
              <button
                type="button"
                onClick={() => { setCropSrc(null); setPendingFile(null); }}
                className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md text-[#888] hover:bg-[#eeeeee] hover:text-black"
                aria-label="Close crop dialog"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex min-h-0 flex-1 items-center justify-center overflow-hidden bg-[#222] p-4 sm:p-6">
              <ReactCrop
                crop={crop}
                onChange={(_, percentCrop) => setCrop(percentCrop)}
                aspect={16 / 9}
                className="max-h-[70dvh] max-w-full"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  ref={imgRef}
                  src={cropSrc}
                  onLoad={onImageLoad}
                  alt="crop-preview"
                  className="block max-h-[70dvh] max-w-full object-contain"
                />
              </ReactCrop>
            </div>

            <div className="flex flex-shrink-0 items-center justify-end gap-3 border-t border-[#d6d6d6] bg-white px-4 py-3 sm:px-6">
              <button
                type="button"
                onClick={() => { setCropSrc(null); setPendingFile(null); }}
                disabled={uploading}
                className="px-4 py-2 text-sm text-[#666] transition-colors hover:text-black disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmCrop}
                disabled={uploading}
                className="flex min-w-[140px] items-center justify-center gap-2 rounded-md bg-black px-5 py-2.5 text-sm font-medium text-white hover:bg-[#222] disabled:opacity-60"
              >
                {uploading ? "Uploading…" : <><Check size={14} /> Use This Crop</>}
              </button>
            </div>
          </div>
        </div>,
        document.body
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
