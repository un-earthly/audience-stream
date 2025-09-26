"use client";
import React from "react";
import { User, Sparkles, Edit3, Copy, Download, Check, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { ChatMessage } from "@/lib/types";
import { StepsCollapsible } from "./steps-collapsible";
import { CampaignConfigurator } from "./campaign-configurator";

interface MessageRendererProps {
    message: ChatMessage;
    index: number;
}

export function MessageRenderer({ message, index }: MessageRendererProps) {
    const dispatch = useAppDispatch();
    const { executions } = useAppSelector((state) => state.steps);
    const execution = executions.find((e) => e.messageId === message.id);
    // Use the full streamed answer stored in tabs for assistant messages
    const tabsForMessage = useAppSelector((s) => s.tabs[message.id]);

    // Debug: log what the renderer receives for this message
    React.useEffect(() => {
        // eslint-disable-next-line no-console
        console.log('[MessageRenderer] update', {
            messageId: message.id,
            type: message.type,
            streaming: message.streaming,
            content: message.content,
            jsonData: message.jsonData,
            tabs: tabsForMessage,
            uiComponent: tabsForMessage?.uiComponent,
            answerLen: tabsForMessage?.answer?.length ?? 0,
        });
    }, [message.id, message.type, message.streaming, message.content, message.jsonData, tabsForMessage]);

    const isUser = message.type === "user";
    const [isEditing, setIsEditing] = React.useState(false);
    const [editValue, setEditValue] = React.useState(message.content);
    const isSystem = message.type === "system";
    const [copied, setCopied] = React.useState(false);

    const copyText = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch (_) {
            // ignore
        }
    };

    const downloadText = (text: string, filenamePrefix = "message") => {
        const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${filenamePrefix}-${message.id}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

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
                    className={`group p-4 ${isUser
                        ? "bg-primary text-primary-foreground"
                        : isSystem
                            ? "bg-muted"
                            : "bg-card"
                        }`}
                >
                    {isUser && (
                        <div className="flex items-start relative justify-between gap-2">
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

                        </div>
                    )}
                    {!isUser && (
                        <div className="prose prose-sm max-w-none dark:prose-invert">
                            {Array.isArray(tabsForMessage?.blocks) && tabsForMessage!.blocks!.length > 0 ? (
                                <div>
                                    {tabsForMessage!.blocks!.map((b, i) => {
                                        switch (b.kind) {
                                            case 'para':
                                                return (
                                                    <p key={`para-${i}`} className="whitespace-pre-wrap">{b.content}</p>
                                                );
                                            case 'artifact_indicator':
                                                return (
                                                    <div key={`artifact-${i}`} className="mt-3">
                                                        <CampaignConfigurator
                                                            jsonData={(tabsForMessage?.uiComponent?.data) ?? (message.jsonData as any)?.uiComponent?.data}
                                                            title={b.title ?? (tabsForMessage?.uiComponent?.title) ?? (message.jsonData as any)?.uiComponent?.title}
                                                            description={b.description ?? (tabsForMessage?.uiComponent?.description) ?? (message.jsonData as any)?.uiComponent?.description}
                                                        />
                                                    </div>
                                                );
                                            case 'summary':
                                                return (
                                                    <div key={`summary-${i}`} className="mt-3">
                                                        <h4 className="mt-2 mb-1">Summary</h4>
                                                        <p className="whitespace-pre-wrap">{b.content}</p>
                                                    </div>
                                                );
                                            case 'suggestions':
                                                return (
                                                    <div key={`sugg-${i}`} className="mt-3">
                                                        <h4 className="mt-2 mb-1">Suggested next steps</h4>
                                                        <ul className="list-disc pl-5">
                                                            {b.suggestions.map((s, idx) => (
                                                                <li key={idx}>{s}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                );
                                            case 'conclusion':
                                                return (
                                                    <p key={`conclusion-${i}`} className="whitespace-pre-wrap">{b.content}</p>
                                                );
                                            default:
                                                return null;
                                        }
                                    })}
                                    {message.streaming && (
                                        <span className="inline-block w-2 h-4 bg-current animate-pulse ml-1 align-middle" />
                                    )}
                                </div>
                            ) : (
                                // Fallback to string answer/content if blocks are not present
                                <div className="whitespace-pre-wrap">
                                    {(tabsForMessage?.answer ?? message.content) || ""}
                                    {message.streaming && (
                                        <span className="inline-block w-2 h-4 bg-current animate-pulse ml-1 align-middle" />
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </Card>



                {/* Timestamp + Actions */}
                <div className="text-xs gap-2 flex items-center justify-between text-muted-foreground mt-2">
                    <div>{new Date(message.timestamp).toLocaleTimeString()}</div>
                    <div className="flex items-center gap-3">
                        {/* Common: Copy */}
                        <span
                            role="button"
                            tabIndex={0}
                            onClick={() => {
                                const textToCopy = isUser ? (isEditing ? editValue : message.content) : (tabsForMessage?.answer ?? message.content);
                                copyText(textToCopy);
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    const textToCopy = isUser ? (isEditing ? editValue : message.content) : (tabsForMessage?.answer ?? message.content);
                                    copyText(textToCopy);
                                }
                            }}
                            title={copied ? "Copied" : "Copy"}
                            aria-label="Copy message"
                            className="inline-flex cursor-pointer items-center text-foreground/70 hover:text-foreground transition-colors"
                        >
                            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </span>

                        {/* Assistant/System: Download */}
                        {!isUser && (
                            <span
                                role="button"
                                tabIndex={0}
                                onClick={() => {
                                    const textToDownload = tabsForMessage?.answer ?? message.content;
                                    downloadText(textToDownload, isSystem ? 'system' : 'assistant');
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        const textToDownload = tabsForMessage?.answer ?? message.content;
                                        downloadText(textToDownload, isSystem ? 'system' : 'assistant');
                                    }
                                }}
                                title="Download"
                                aria-label="Download message"
                                className="inline-flex cursor-pointer items-center text-foreground/70 hover:text-foreground transition-colors"
                            >
                                <Download className="h-4 w-4" />
                            </span>
                        )}

                        {/* User: Edit / Save / Cancel */}
                        {isUser && !isEditing && (
                            <span
                                role="button"
                                tabIndex={0}
                                onClick={() => setIsEditing(true)}
                                onKeyDown={(e) => { if (e.key === 'Enter') setIsEditing(true); }}
                                title="Edit"
                                aria-label="Edit message"
                                className="inline-flex cursor-pointer items-center text-foreground/70 hover:text-foreground transition-colors"
                            >
                                <Edit3 className="h-4 w-4" />
                            </span>
                        )}
                        {isUser && isEditing && (
                            <>
                                <span
                                    role="button"
                                    tabIndex={0}
                                    onClick={() => { setIsEditing(false); setEditValue(message.content); }}
                                    onKeyDown={(e) => { if (e.key === 'Enter') { setIsEditing(false); setEditValue(message.content); } }}
                                    title="Cancel edit"
                                    aria-label="Cancel edit"
                                    className="inline-flex cursor-pointer items-center text-foreground/70 hover:text-foreground transition-colors"
                                >
                                    <X className="h-4 w-4" />
                                </span>
                                <span
                                    role="button"
                                    tabIndex={0}
                                    onClick={() => {
                                        if (editValue.trim().length === 0) return;
                                        dispatch({ type: 'chat/updateMessage', payload: { id: message.id, content: editValue } });
                                        setIsEditing(false);
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            if (editValue.trim().length === 0) return;
                                            dispatch({ type: 'chat/updateMessage', payload: { id: message.id, content: editValue } });
                                            setIsEditing(false);
                                        }
                                    }}
                                    title="Save edit"
                                    aria-label="Save edit"
                                    className="inline-flex cursor-pointer items-center text-foreground/70 hover:text-foreground transition-colors"
                                >
                                    <Check className="h-4 w-4" />
                                </span>
                            </>
                        )}
                    </div>
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