"use client";

import { useState, useRef } from "react";
import { Upload, X, FileAudio, FileVideo, Loader2, CheckCircle2 } from "lucide-react";

interface FileUploadProps {
  meetingId?: string;
  onUploadComplete?: (result: {
    url: string;
    path: string;
    filename: string;
    size: number;
    mimeType: string;
  }) => void;
  onUploadError?: (error: string) => void;
}

export function FileUpload({ meetingId, onUploadComplete, onUploadError }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadResult, setUploadResult] = useState<{
    success: boolean;
    data?: { url: string; filename: string; size: number };
  } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const supportedTypes = [
    "audio/mpeg",
    "audio/wav",
    "audio/mp4",
    "audio/webm",
    "video/mp4",
    "video/webm",
    "video/quicktime",
  ];

  const maxSize = 500 * 1024 * 1024; // 500MB

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const validateFile = (file: File): string | null => {
    if (!supportedTypes.includes(file.type)) {
      return "Unsupported file type. Please upload MP3, WAV, M4A, MP4, WebM, or MOV files.";
    }
    if (file.size > maxSize) {
      return "File too large. Maximum size is 500MB.";
    }
    return null;
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      const error = validateFile(file);
      if (error) {
        onUploadError?.(error);
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const error = validateFile(file);
      if (error) {
        onUploadError?.(error);
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      if (meetingId) {
        formData.append("meetingId", meetingId);
      }

      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/upload`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Upload failed");
      }

      const result = await response.json();
      setUploadResult(result);
      onUploadComplete?.(result.data);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Upload failed";
      onUploadError?.(message);
    } finally {
      setIsUploading(false);
    }
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setUploadResult(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const getFileIcon = () => {
    if (selectedFile?.type.startsWith("audio/")) {
      return <FileAudio className="h-8 w-8 text-blue-500" />;
    }
    return <FileVideo className="h-8 w-8 text-purple-500" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {!selectedFile ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragging
              ? "border-primary bg-primary/5"
              : "border-gray-300 hover:border-primary hover:bg-gray-50"
          }`}
        >
          <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-lg font-medium mb-2">
            Drop your file here, or click to browse
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            Support for MP3, WAV, M4A, MP4, WebM, MOV
          </p>
          <p className="text-xs text-muted-foreground">Maximum file size: 500MB</p>
          <input
            ref={inputRef}
            type="file"
            accept="audio/*,video/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      ) : (
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              {getFileIcon()}
              <div>
                <p className="font-medium truncate max-w-[200px]">
                  {selectedFile.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {formatFileSize(selectedFile.size)}
                </p>
              </div>
            </div>
            {!isUploading && !uploadResult && (
              <button
                onClick={clearSelection}
                className="p-1 hover:bg-accent rounded"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {isUploading && (
            <div className="mb-4">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-sm text-center mt-2">
                <Loader2 className="h-4 w-4 inline animate-spin mr-2" />
                Uploading... {uploadProgress}%
              </p>
            </div>
          )}

          {uploadResult?.success ? (
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle2 className="h-5 w-5" />
              <span>Upload successful!</span>
            </div>
          ) : (
            !isUploading && (
              <button
                onClick={handleUpload}
                className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                Upload File
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
}
