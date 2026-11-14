"use client";
import React, { useState } from "react";
import { FileUpload } from "@/components/ui/file-upload";
import "./file-upload.css";

/** Reusable demo wrapper based on the requested FileUploadDemo API.
 * In production, the parent submits selected files to the intended backend.
 */
export function FileUploadDemo() {
  const [files, setFiles] = useState<File[]>([]);
  const handleFileUpload = (selected: File[]) => {
    setFiles(selected);
  };
  return (
    <div className="w-full max-w-4xl mx-auto min-h-96 border border-dashed bg-white dark:bg-black border-neutral-200 dark:border-neutral-800 rounded-lg">
      <FileUpload onChange={handleFileUpload} />
      <p className="sr-only" aria-live="polite">{files.length} files selected</p>
    </div>
  );
}
