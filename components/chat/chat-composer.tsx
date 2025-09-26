"use client";

import { useState, useRef, forwardRef } from "react";
import { Send, Brain, Search, Eye, EyeOff, Copy, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils/cn";
import { CHAT_CONFIG, UI_MESSAGES } from "@/lib/constants/chat";

interface ChatComposerProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onPaste: (e: React.ClipboardEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  disabled?: boolean;
  deepthink: boolean;
  webSearch: boolean;
  showHints: boolean;
  onToggleDeepthink: () => void;
  onToggleWebSearch: () => void;
  onToggleHints: () => void;
  onCopy: () => void;
  onAttachFiles: () => void;
  className?: string;
}

export const ChatComposer = forwardRef<HTMLTextAreaElement, ChatComposerProps>(
  ({
    value,
    onChange,
    onSubmit,
    onPaste,
    onDrop,
    disabled = false,
    deepthink,
    webSearch,
    showHints,
    onToggleDeepthink,
    onToggleWebSearch,
    onToggleHints,
    onCopy,
    onAttachFiles,
    className,
  }, ref) => {
    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        onSubmit(e);
      }
    };

    const handleTextDrop = (e: React.DragEvent) => {
      const types = (e.dataTransfer && Array.from(e.dataTransfer.types)) || [];
      // If files are included, let the parent handler manage it
      if (types.includes('Files')) return;
      const text = e.dataTransfer.getData('text');
      if (text) {
        // Prevent default so we can control insertion
        e.preventDefault();
        onChange(value + (value && !value.endsWith('\n') ? '\n' : '') + text);
      }
    };

    return (
      <div className={cn("relative", className)}>
        <form onSubmit={onSubmit} className="space-y-3">
          <div className="relative">
            <Textarea
              ref={ref}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={handleKeyDown}
              onPaste={onPaste}
              onDrop={handleTextDrop}
              placeholder={UI_MESSAGES.PLACEHOLDERS.CHAT_INPUT}
              className={cn(
                "min-h-16 md:min-h-20 max-h-40 pr-12 resize-none",
                "focus:ring-2 focus:ring-primary/20 focus:border-primary"
              )}
              style={{
                minHeight: `${CHAT_CONFIG.TEXTAREA.MIN_HEIGHT}px`,
              }}
              disabled={disabled}
            />
            <Button
              type="submit"
              size="sm"
              disabled={!value.trim() || disabled}
              className="absolute right-2 bottom-2 h-8 w-8 p-0 rounded-full shadow-sm"
            >
              <Send className="h-4 w-4" />
              <span className="sr-only">Send message</span>
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {showHints && (
                <Badge variant="secondary" className="text-xs">
                  Press Enter to send, Shift + Enter for new line
                </Badge>
              )}
            </div>

            <TooltipProvider>
              <div className="flex items-center gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={onAttachFiles}
                      className="h-8 w-8 p-0"
                    >
                      <Paperclip className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Attach files</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={onToggleDeepthink}
                      className={cn(
                        "h-8 w-8 p-0",
                        deepthink && "bg-primary/10 text-primary"
                      )}
                    >
                      <Brain className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Toggle Deepthink</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={onToggleWebSearch}
                      className={cn(
                        "h-8 w-8 p-0",
                        webSearch && "bg-primary/10 text-primary"
                      )}
                    >
                      <Search className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Toggle Web Search</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={onCopy}
                      disabled={!value}
                      className="h-8 w-8 p-0"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Copy text</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={onToggleHints}
                      className="h-8 w-8 p-0"
                    >
                      {showHints ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {showHints ? 'Hide helper text' : 'Show helper text'}
                  </TooltipContent>
                </Tooltip>
              </div>
            </TooltipProvider>
          </div>
        </form>
      </div>
    );
  }
);

ChatComposer.displayName = "ChatComposer";
