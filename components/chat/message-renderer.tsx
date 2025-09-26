"use client";

import { User, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useAppSelector } from "@/lib/hooks";
import { Message } from "@/lib/features/chat/chatSlice";
import { JsonBlock } from "./JsonBlock";
import { StepsCollapsible } from "./steps-collapsible";

interface MessageRendererProps {
  message: Message;
  index: number;
}

export function MessageRenderer({ message, index }: MessageRendererProps) {
  const { executions } = useAppSelector((state) => state.steps);
  const execution = executions.find((e) => e.messageId === message.id);

  const isUser = message.type === "user";
  const isSystem = message.type === "system";

  return (
    <div className={`flex gap-4 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <div className="flex-shrink-0">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
            {isSystem ? (
              <Sparkles className="w-4 h-4 text-primary-foreground" />
            ) : (
              <Sparkles className="w-4 h-4 text-primary-foreground" />
            )}
          </div>
        </div>
      )}

      <div className={`max-w-[80%] ${isUser ? "order-first" : ""}`}>
        {/* Message content */}
        <Card
          className={`p-4 ${
            isUser
              ? "bg-primary text-primary-foreground"
              : isSystem
              ? "bg-muted"
              : "bg-card"
          }`}
        >
          {message.content && (
            <div className="prose prose-sm max-w-none dark:prose-invert">
              {message.content}
              {message.streaming && (
                <span className="inline-block w-2 h-4 bg-current animate-pulse ml-1" />
              )}
            </div>
          )}
        </Card>

        {/* Steps visualization - Subtle and expandable */}
        {execution && execution.steps.length > 0 && (
          <StepsCollapsible execution={execution} />
        )}

        {/* JSON result */}
        {message.jsonData && (
          <div className="mt-4">
            <JsonBlock data={message.jsonData} />
          </div>
        )}

        {/* Timestamp */}
        <div className="text-xs text-muted-foreground mt-2">
          {new Date(message.timestamp).toLocaleTimeString()}
        </div>
      </div>

      {isUser && (
        <div className="flex-shrink-0">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
            <User className="w-4 h-4 text-primary-foreground" />
          </div>
        </div>
      )}
    </div>
  );
}