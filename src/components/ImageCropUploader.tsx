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
import { X, Upload, Crop as CropIcon, Check, ImagePlus, RectangleHorizontal, RectangleVertical, Maximize } from "lucide-react";

interface UploadedImage {
  id: string;
  url: string;
}

interface Props {
  onImagesChange: (ids: string[]) => void;
  initialImages?: UploadedImage[];
}

type AspectOption = "free" | "landscape" | "portrait" | "square";

const ASPECT_VALUES: Record<AspectOption, number | undefined> = {
  free: undefined,
  landscape: 16 / 9,
  portrait: 3 / 4,
  square: 1,
};

function makeCenteredCrop(w: number, h: number, aspect: number | undefined): PercentCrop {
  if (!aspect) {
    // Free crop — select 90% of image
    return { unit: "%", x: 5, y: 5, width: 90, height: 90 };
  }
  return centerCrop(makeAspectCrop({ unit: "%", width: 90 }, aspect, w, h), w, h);
}

export function ImageCropUploader({ onImagesChange, initialImages = [] }: Props) {
  const [uploaded, setUploaded]         = useState<UploadedImage[]>(initialImages);
  const [cropSrc, setCropSrc]           = useState<string | null>(null);
  const [pendingFile, setPendingFile]   = useState<File | null>(null);
  const [crop, setCrop]                 = useState<PercentCrop>();
  const [aspectMode, setAspectMode]     = useState<AspectOption>("free");
  const [uploading, setUploading]       = useState(false);
  const [error, setError]               = useState<string | null>(null);
  const [imgDimensions, setImgDimensions] = useState<{ w: number; h: number } | null>(null);
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
    setAspectMode("free");
    const reader = new FileReader();
    reader.onload = () => setCropSrc(reader.result as string);
    reader.readAsDataURL(file);
  };

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth: w, naturalHeight: h } = e.currentTarget;
    setImgDimensions({ w, h });
    setCrop(makeCenteredCrop(w, h, ASPECT_VALUES[aspectMode]));
  };

  const switchAspect = (mode: AspectOption) => {
    setAspectMode(mode);
    if (imgDimensions) {
      setCrop(makeCenteredCrop(imgDimensions.w, imgDimensions.h, ASPECT_VALUES[mode]));
    }
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
    return new Promise((res, rej) => canvas.toBlob(b => b ? res(b) : rej("canvas empty"), "image/webp", 0.9));
  }, [crop]);

  const confirmCrop = async () => {
    if (!pendingFile) return;
    setUploading(true);
    setError(null);
    try {
      const blob = await getCroppedBlob();
      const fd   = new FormData();
      fd.append("file", blob, pendingFile.name.replace(/\.\w+$/, ".webp"));
      const res  = await fetch("/api/upload", { method: "POST", body: fd });
      if (!res.ok) {
        // Try to get the real error message from the server
        let errMsg = "Upload failed";
        try {
          const errData = await res.json() as { error?: string };
          if (res.status === 401) {
            errMsg = "Session expired — please log out and log back in.";
          } else if (errData.error) {
            errMsg = errData.error;
          }
        } catch { /* ignore JSON parse failure */ }
        throw new Error(errMsg);
      }
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
              {/* Always visible on mobile (touch has no hover); desktop gets hover highlight */}
              <button
                type="button"
                onClick={() => remove(img.id)}
                className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/70 text-white flex items-center justify-center transition-opacity md:opacity-0 md:group-hover:opacity-100"
                aria-label="Remove image"
              >
                <X size={11} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Crop modal */}
      {cropSrc && createPortal(
        <div style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.85)", padding: "1rem", backdropFilter: "blur(4px)" }}>
          <div className="flex max-h-[90dvh] w-full max-w-4xl flex-col overflow-hidden rounded-xl border border-[#444] bg-[#1a1a1a] shadow-2xl">
            {/* Header */}
            <div className="flex h-14 flex-shrink-0 items-center justify-between border-b border-[#333] px-4 sm:px-6">
              <span className="flex min-w-0 items-center gap-2 text-sm font-medium text-white">
                <CropIcon size={15} /> Crop Image
              </span>
              <button
                type="button"
                onClick={() => { setCropSrc(null); setPendingFile(null); }}
                className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md text-[#888] hover:bg-[#333] hover:text-white"
                aria-label="Close crop dialog"
              >
                <X size={18} />
              </button>
            </div>

            {/* Aspect Ratio Selector */}
            <div className="flex items-center gap-2 px-4 sm:px-6 py-3 border-b border-[#333] bg-[#222] overflow-x-auto">
              <span className="text-xs text-[#888] flex-shrink-0 mr-1">Ratio:</span>
              {([
                { mode: "free" as const, label: "Free", icon: Maximize },
                { mode: "landscape" as const, label: "16:9", icon: RectangleHorizontal },
                { mode: "portrait" as const, label: "3:4", icon: RectangleVertical },
                { mode: "square" as const, label: "1:1", icon: CropIcon },
              ]).map(({ mode, label, icon: Icon }) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => switchAspect(mode)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex-shrink-0 ${
                    aspectMode === mode
                      ? "bg-white text-black"
                      : "bg-[#333] text-[#aaa] hover:text-white hover:bg-[#444]"
                  }`}
                >
                  <Icon size={13} />
                  {label}
                </button>
              ))}
            </div>

            {/* Crop Area */}
            <div className="flex min-h-0 flex-1 items-center justify-center overflow-hidden bg-[#111] p-4 sm:p-6">
              <ReactCrop
                crop={crop}
                onChange={(_, percentCrop) => setCrop(percentCrop)}
                aspect={ASPECT_VALUES[aspectMode]}
                className="max-h-[60dvh] max-w-full"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  ref={imgRef}
                  src={cropSrc}
                  onLoad={onImageLoad}
                  alt="crop-preview"
                  className="block max-h-[60dvh] max-w-full object-contain"
                />
              </ReactCrop>
            </div>

            {/* Footer */}
            <div className="flex flex-shrink-0 items-center justify-between gap-3 border-t border-[#333] bg-[#1a1a1a] px-4 py-3 sm:px-6">
              <span className="text-xs text-[#666] hidden sm:block">
                {aspectMode === "free" ? "Free crop — keeps original proportions" : `Locked to ${aspectMode}`}
              </span>
              <div className="flex items-center gap-3 ml-auto">
                <button
                  type="button"
                  onClick={() => { setCropSrc(null); setPendingFile(null); }}
                  disabled={uploading}
                  className="px-4 py-2 text-sm text-[#aaa] transition-colors hover:text-white disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmCrop}
                  disabled={uploading}
                  className="flex min-w-[120px] items-center justify-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-medium text-black hover:bg-[#eee] disabled:opacity-60 transition-colors"
                >
                  {uploading ? "Uploading…" : <><Check size={14} /> Crop & Upload</>}
                </button>
              </div>
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
