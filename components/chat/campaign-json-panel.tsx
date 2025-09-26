"use client";

import { X, GripVertical, Copy, Download } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { closeJsonPanel } from "@/lib/features/chat/uiSlice";
import { cn } from "@/lib/utils/cn";
import { useState, useRef, useEffect } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";

export function CampaignJsonPanel() {
  const dispatch = useAppDispatch();
  const { isJsonPanelOpen, jsonPanelData } = useAppSelector((state) => state.chatUi);
  const [width, setWidth] = useState(500);
  const [isResizing, setIsResizing] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      
      const newWidth = window.innerWidth - e.clientX;
      if (newWidth >= 300 && newWidth <= 800) {
        setWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  return (
    <div 
      ref={panelRef}
      className={cn(
        "fixed top-16 right-0 bg-background border-l shadow-lg z-40 transition-transform duration-300 ease-in-out",
        isJsonPanelOpen ? "translate-x-0" : "translate-x-full"
      )}
      style={{ 
        width: `${width}px`, 
        height: 'calc(100vh - 4rem)' 
      }}
    >
      {/* Resize handle */}
      <div 
        className="absolute left-0 top-0 w-1 h-full bg-border hover:bg-primary/50 cursor-col-resize flex items-center justify-center group"
        onMouseDown={() => setIsResizing(true)}
      >
        <div className="absolute left-0 w-4 h-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <GripVertical className="w-3 h-3 text-muted-foreground" />
        </div>
      </div>

      <div className="h-full flex flex-col pl-1">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h2 className="text-lg font-semibold">Campaign Configuration</h2>
            <p className="text-sm text-muted-foreground">Live updates from AI generation</p>
          </div>
          <div className="flex items-center gap-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => {
                      try {
                        const text = JSON.stringify(jsonPanelData, null, 2);
                        navigator.clipboard.writeText(text);
                        toast.success("Copied configuration");
                      } catch {
                        toast.error("Copy failed");
                      }
                    }}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Copy</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => {
                      try {
                        const blob = new Blob([JSON.stringify(jsonPanelData, null, 2)], { type: 'application/json' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        const name = (jsonPanelData as any)?.campaign?.name || 'campaign-config';
                        a.href = url;
                        a.download = `${name.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.json`;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                        toast.message("Downloaded configuration");
                      } catch {
                        toast.error("Download failed");
                      }
                    }}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Download</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => dispatch(closeJsonPanel())}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <ScrollArea className="flex-1 p-4">
          <pre className="text-xs whitespace-pre-wrap font-mono bg-muted/30 p-4 rounded-lg">
            {JSON.stringify(jsonPanelData, null, 2)}
          </pre>
        </ScrollArea>
      </div>
    </div>
  );
}
