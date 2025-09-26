"use client";
import React from "react";
import { User, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { ChatMessage } from "@/lib/types";
import { StepsCollapsible } from "./steps-collapsible";
import { MessageTabs } from "./message-tabs";

interface MessageRendererProps {
    message: ChatMessage;
    index: number;
}

export function MessageRenderer({ message, index }: MessageRendererProps) {
    const dispatch = useAppDispatch();
    const { executions } = useAppSelector((state) => state.steps);
    const execution = executions.find((e) => e.messageId === message.id);

    const isUser = message.type === "user";
    const [isEditing, setIsEditing] = React.useState(false);
    const [editValue, setEditValue] = React.useState(message.content);
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
                    className={`p-4 ${isUser
                        ? "bg-primary text-primary-foreground"
                        : isSystem
                            ? "bg-muted"
                            : "bg-card"
                        }`}
                >
                    {isUser && (
                        <div className="flex items-start justify-between gap-2">
                            {!isEditing ? (
                                <div className="prose prose-sm max-w-none dark:prose-invert">
                                    {message.content}
                                </div>
                            ) : (
                                <Textarea
                                    className="w-full text-sm"
                                    value={editValue}
                                    onChange={(e) => setEditValue(e.target.value)}
                                    rows={3}
                                />
                            )}
                            <div className="flex-shrink-0">
                                {!isEditing ? (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="text-xs"
                                        onClick={() => setIsEditing(true)}
                                    >
                                        Edit
                                    </Button>
                                ) : (
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="text-xs"
                                            onClick={() => {
                                                setIsEditing(false);
                                                setEditValue(message.content);
                                            }}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            className="text-xs"
                                            onClick={() => {
                                                if (editValue.trim().length === 0) return;
                                                dispatch({
                                                    type: 'chat/updateMessage',
                                                    payload: { id: message.id, content: editValue }
                                                });
                                                setIsEditing(false);
                                            }}
                                        >
                                            Save
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                    {!isUser && message.content && (
                        <div className="prose prose-sm max-w-none dark:prose-invert">
                            {message.content}
                            {message.streaming && (
                                <span className="inline-block w-2 h-4 bg-current animate-pulse ml-1" />
                            )}
                        </div>
                    )}
                </Card>

                {/* Steps visualization - only render standalone if tabs are not shown */}
                {execution && execution.steps.length > 0 && isUser && (
                    <StepsCollapsible execution={execution} />
                )}

                {/* Perplexity-like tabs */}
                {!isUser && (
                    <div className="mt-4">
                        <MessageTabs messageId={message.id} jsonData={message.jsonData} />
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