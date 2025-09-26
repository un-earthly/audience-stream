"use client";

import { X } from "lucide-react";

export interface PastePreviewModalProps {
  open: boolean;
  name: string;
  mode: 'text' | 'image';
  text?: string;
  imageUrl?: string;
  onNameChange: (v: string) => void;
  onClose: () => void;
  onAttach: () => void;
}

export function PastePreviewModal({ open, name, mode, text, imageUrl, onNameChange, onClose, onAttach }: PastePreviewModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl rounded-2xl bg-background border shadow-2xl overflow-hidden">
          <div className="p-4 border-b flex items-center justify-between">
            <div className="text-sm font-medium">{mode === 'image' ? 'Preview Image' : 'Preview Text'}</div>
            <button
              className="p-1 rounded-md hover:bg-muted"
              aria-label="Close"
              onClick={onClose}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="p-4 space-y-3">
            <div className="flex items-center gap-2">
              <label htmlFor="previewName" className="text-xs text-muted-foreground">Filename</label>
              <input
                id="previewName"
                className="flex-1 text-sm px-2 py-1 rounded-md border bg-background"
                value={name}
                onChange={(e) => onNameChange(e.target.value)}
              />
            </div>
            {mode === 'text' ? (
              <div className="h-64 rounded-md border overflow-auto bg-muted/20 p-2">
                <pre className="text-xs whitespace-pre-wrap break-words">{text}</pre>
              </div>
            ) : (
              <div className="h-64 rounded-md border overflow-hidden bg-muted/20 flex items-center justify-center">
                {imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={imageUrl} alt="Preview" className="max-h-full max-w-full object-contain" />
                ) : null}
              </div>
            )}
          </div>
          <div className="p-4 border-t flex items-center justify-end gap-2">
            <button
              className="px-3 py-1.5 text-sm rounded-md border hover:bg-muted"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="px-3 py-1.5 text-sm rounded-md bg-primary text-primary-foreground hover:opacity-90"
              onClick={onAttach}
            >
              Attach
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
