"use client";

import { X, Paperclip, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils/cn";
import type { AttachmentItem } from "@/lib/features/chat/uiSlice";

interface AttachmentPreviewProps {
  attachments: AttachmentItem[];
  onPreview: (index: number) => void;
  onRemove: (index: number) => void;
  className?: string;
}

export function AttachmentPreview({ 
  attachments, 
  onPreview, 
  onRemove, 
  className 
}: AttachmentPreviewProps) {
  if (attachments.length === 0) return null;

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {attachments.map((attachment, index) => (
        <Card key={index} className="group relative overflow-hidden">
          <CardContent className="p-0">
            <div
              className="flex items-center gap-2 p-2 cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => onPreview(index)}
            >
              {attachment.kind === 'image' && attachment.url ? (
                <div className="relative">
                  <img 
                    src={attachment.url} 
                    alt={attachment.file.name}
                    className="w-12 h-12 object-cover rounded border"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded" />
                </div>
              ) : (
                <div className="w-12 h-12 rounded border flex items-center justify-center bg-muted">
                  <Paperclip className="w-4 h-4 text-muted-foreground" />
                </div>
              )}
              
              <div className="flex-1 min-w-0 max-w-32">
                <div className="text-sm font-medium truncate">
                  {attachment.file.name}
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {(attachment.file.size / 1024).toFixed(1)} KB
                  </Badge>
                  {attachment.kind === 'image' && (
                    <Badge variant="secondary" className="text-xs">
                      Image
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <TooltipProvider>
              <div className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="h-6 w-6 p-0 rounded-full shadow-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemove(index);
                      }}
                    >
                      <X className="h-3 w-3" />
                      <span className="sr-only">Remove attachment</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Remove attachment</TooltipContent>
                </Tooltip>
              </div>
            </TooltipProvider>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
