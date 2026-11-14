"use client";
import React, { useId, useRef, useState } from "react";
import type { ChangeEvent, DragEvent, KeyboardEvent } from "react";

/** Shared, accessible uploader for all Visual Verse file-picking workflows.
 * Actual uploads remain the caller's responsibility (Supabase storage for Console).
 */
export type FileUploadProps = {
  onChange: (files: File[]) => void;
  accept?: string;
  maxFiles?: number;
  maxSizeBytes?: number;
  disabled?: boolean;
  className?: string;
};

const DEFAULT_LIMIT = 25 * 1024 * 1024;
function allowedFile(file: File, accept: string): boolean {
  if (!accept) return true;
  return accept.split(",").some((part) => {
    const token = part.trim().toLowerCase();
    if (!token) return false;
    if (token.startsWith(".")) return file.name.toLowerCase().endsWith(token);
    if (token.endsWith("/*")) return file.type.toLowerCase().startsWith(token.slice(0, -1));
    return file.type.toLowerCase() === token;
  });
}
function formatSize(bytes: number) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}
export function FileUpload({
  onChange, accept = "", maxFiles = 5, maxSizeBytes = DEFAULT_LIMIT,
  disabled = false, className = "",
}: FileUploadProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");
  const input = useRef<HTMLInputElement>(null);
  const hintId = useId();

  function update(next: File[]) {
    setFiles(next);
    onChange(next);
  }
  function select(items: File[]) {
    if (disabled) return;
    const unique = new Map<string, File>();
    const candidates = maxFiles === 1 ? items.slice(0, 1) : files.concat(items);
    for (const file of candidates) {
      unique.set(file.name + ":" + file.size + ":" + file.lastModified, file);
    }
    const accepted: File[] = [];
    let rejected = "";
    for (const file of unique.values()) {
      if (!allowedFile(file, accept)) { rejected = "That file type is not supported."; continue; }
      if (file.size <= 0) { rejected = "Empty files cannot be uploaded."; continue; }
      if (file.size > maxSizeBytes) { rejected = "Each file must be under " + formatSize(maxSizeBytes) + "."; continue; }
      if (accepted.length >= maxFiles) { rejected = "Select up to " + maxFiles + " file" + (maxFiles === 1 ? "" : "s") + "."; continue; }
      accepted.push(file);
    }
    setError(rejected);
    update(accepted);
  }
  function onPick(event: ChangeEvent<HTMLInputElement>) {
    select(Array.from(event.target.files ?? []));
    event.target.value = "";
  }
  function onDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragging(false);
    select(Array.from(event.dataTransfer.files ?? []));
  }
  function onKey(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (!disabled) input.current?.click();
    }
  }
  return (
    <div className={"vv-file-upload " + className} data-disabled={disabled}>
      <input
        ref={input} type="file" accept={accept || undefined}
        multiple={maxFiles > 1} disabled={disabled} hidden onChange={onPick}
        aria-label="Choose files to upload"
      />
      <div
        className={"vv-upload-dropzone" + (dragging ? " vv-upload-dragging" : "")}
        role="button" tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled} aria-describedby={hintId}
        onClick={() => { if (!disabled) input.current?.click(); }}
        onKeyDown={onKey}
        onDragOver={(event) => { event.preventDefault(); if (!disabled) setDragging(true); }}
        onDragLeave={(event) => { event.preventDefault(); setDragging(false); }}
        onDrop={onDrop}
      >
        <div className="vv-upload-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 16V4m0 0-4 4m4-4 4 4"/>
            <path d="M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3"/>
          </svg>
        </div>
        <strong>{dragging ? "Drop your files here" : "Drag & drop your files"}</strong>
        <p id={hintId}>or click to browse your device</p>
        <span className="vv-upload-hint">Up to {maxFiles} file{maxFiles === 1 ? "" : "s"} · {formatSize(maxSizeBytes)} max each</span>
      </div>
      {files.length > 0 && (
        <div className="vv-upload-selection" aria-label="Selected files">
          {files.map((file) => (
            <div className="vv-upload-file" key={file.name + file.size + file.lastModified}>
              <span className="vv-upload-file-icon" aria-hidden="true">▤</span>
              <span className="vv-upload-file-details"><strong title={file.name}>{file.name}</strong><small>{formatSize(file.size)}</small></span>
              <button
                type="button" className="vv-upload-remove" disabled={disabled}
                aria-label={"Remove " + file.name}
                onClick={() => { setError(""); update(files.filter((item) => item !== file)); }}
              >×</button>
            </div>
          ))}
        </div>
      )}
      <p className="vv-upload-message" role="status" aria-live="polite">
        {error || (files.length ? files.length + " file" + (files.length === 1 ? "" : "s") + " ready to upload" : "")}
      </p>
    </div>
  );
}
