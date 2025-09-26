"use client";

import { useState, useRef, useEffect } from "react";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { addMessage, clearChat } from "@/lib/features/chat/chatSlice";
import { startExecution } from "@/lib/features/chat/stepSlice";
import { startStreaming } from "@/lib/features/chat/chatSlice";
import { StepExecutor } from "@/components/chat/step-executor";
import { MessageRenderer } from "@/components/chat/message-renderer";
import { PastePreviewModal } from "@/components/chat/paste-preview-modal";
import { toggleDeepthink, toggleWebSearch, toggleHints, addAttachments as addAttachmentsAction, removeAttachment, clearAttachments, openPreview, closePreview, renameAttachment } from "@/lib/features/chat/uiSlice";
import { ChatComposer } from "@/components/chat/chat-composer";
import { AttachmentPreview } from "@/components/chat/attachment-preview";
import { WelcomeMessage } from "@/components/chat/welcome-message";
import { CHAT_CONFIG, UI_MESSAGES, getRandomResponseTemplate } from "@/lib/constants/chat";
import { createConversation, setActiveConversation, addMessageToConversation, renameConversation } from "@/lib/features/chat/historySlice";
import type { ChatMessage } from "@/lib/types";
import { Textarea } from "@/components/ui/textarea";

export function ChatInterface() {
    const [input, setInput] = useState("");
    const dispatch = useAppDispatch();
    const { messages, isStreaming } = useAppSelector((state) => state.chat);
    const { deepthink, webSearch, showHints, attachments, preview } = useAppSelector((s) => s.chatUi);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { activeConversationId, conversations } = useAppSelector((s) => s.history);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, scrollToBottom]);

    // Hydrate chat panel when switching active conversation
    useEffect(() => {
        if (!activeConversationId) {
            // No active conversation - show empty chat
            dispatch(clearChat());
            return;
        }
        const conv = conversations.find(c => c.id === activeConversationId);
        if (!conv) return;
        // Reset chat slice to initial and then load conversation messages
        dispatch(clearChat());
        for (const m of conv.messages) {
            dispatch(addMessage(m));
        }
        // Scroll after hydration
        setTimeout(scrollToBottom, 0);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeConversationId]);

    const generateStepsFromQuery = (_query: string) => {
        const template = getRandomResponseTemplate();
        return template.steps.map(step => ({ ...step })); // Remove readonly
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isStreaming) return;

        let userMessage = input.trim();
        if (deepthink && !userMessage.toLowerCase().includes('[deepthink]')) {
            userMessage = `${userMessage} [deepthink]`;
        }
        if (webSearch && !userMessage.toLowerCase().includes('[web]')) {
            userMessage = `${userMessage} [web]`;
        }
        setInput("");

        // Reset textarea height
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
        }

        // Ensure there's an active conversation - only create if we don't have one
        let convId = activeConversationId;
        if (!convId) {
            convId = Date.now().toString();
            const titleBase = userMessage.replace(/\s+/g, " ").slice(0, 48);
            const title = titleBase.length > 0 ? titleBase : "New chat";
            dispatch(createConversation({ id: convId, title }));
            dispatch(setActiveConversation(convId));
        }

        // Add user message (Redux chat) and persist to history
        const now = Date.now();
        const userMsg: ChatMessage = {
            id: now.toString(),
            timestamp: now,
            type: "user",
            content: userMessage,
            jsonData: attachments.length
                ? {
                    attachments: attachments.map(a => ({
                        name: a.file.name,
                        size: a.file.size,
                        type: a.file.type,
                        kind: a.kind,
                    })),
                }
                : undefined,
        };
        dispatch(addMessage(userMsg));
        if (convId) {
            dispatch(addMessageToConversation({ conversationId: convId, message: userMsg }));
        }

        // Optional short pause before assistant reply
        await new Promise((resolve) => setTimeout(resolve, CHAT_CONFIG.DELAYS.BEFORE_ASSISTANT_REPLY));

        // Add assistant message with initial response
        const assistantMessageId = (Date.now() + 1).toString();
        const template = getRandomResponseTemplate();
        const assistantMsg: ChatMessage = {
            id: assistantMessageId,
            timestamp: Date.now() + 1,
            type: "assistant",
            content: template.initial,
            streaming: true,
        };
        dispatch(addMessage(assistantMsg));
        if (convId) {
            dispatch(addMessageToConversation({ conversationId: convId, message: assistantMsg }));
        }
        // Begin global streaming for this assistant response
        dispatch(startStreaming(assistantMessageId));
        
        // Auto-title conversation with first assistant response (after delay)
        if (convId) {
            setTimeout(() => {
                const conv = conversations.find(c => c.id === convId);
                if (conv && (conv.title === "New chat" || conv.title.startsWith("New chat"))) {
                    const autoTitle = userMessage.replace(/\s+/g, " ").slice(0, 40).trim();
                    if (autoTitle) {
                        dispatch(renameConversation({ id: convId, title: autoTitle }));
                    }
                }
            }, CHAT_CONFIG.DELAYS.AUTO_TITLE);
        }

        // Clear attachments after sending (Redux)
        dispatch(clearAttachments());

        // Small delay before starting steps
        await new Promise((resolve) => setTimeout(resolve, CHAT_CONFIG.DELAYS.BEFORE_STEPS));

        // Start step execution
        const steps = generateStepsFromQuery(userMessage);
        dispatch(
            startExecution({
                messageId: assistantMessageId,
                steps,
            })
        );
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(input);
            toast.success(UI_MESSAGES.SUCCESS.COPIED);
        } catch (err) {
            toast.error(UI_MESSAGES.ERRORS.COPY_FAILED);
        }
    };


    // Helpers to collect files from paste/drag
    const addFiles = async (files: File[]) => {
        if (!files.length) return;
        if (attachments.length + files.length > CHAT_CONFIG.MAX_FILES) {
            toast.error(UI_MESSAGES.ERRORS.MAX_FILES_EXCEEDED(CHAT_CONFIG.MAX_FILES));
            return;
        }
        const next: Array<{ file: File; url?: string; kind: 'image' | 'file' }> = [];
        for (const f of files) {
            if (f.size > CHAT_CONFIG.MAX_FILE_SIZE) {
                toast.error(UI_MESSAGES.ERRORS.FILE_TOO_LARGE(f.name));
                continue;
            }
            const kind: 'image' | 'file' = f.type.startsWith('image/') ? 'image' : 'file';
            let url: string | undefined;
            if (kind === 'image') {
                // create object URL for runtime, and dataURL for persistence
                url = URL.createObjectURL(f);
                try {
                    const fr = new FileReader();
                    const dataUrl: string = await new Promise((res, rej) => {
                        fr.onload = () => res(String(fr.result));
                        fr.onerror = rej;
                        fr.readAsDataURL(f);
                    });
                    // store dataUrl into url so our persistence effect can save it
                    url = dataUrl;
                } catch { }
            }
            next.push({ file: f, url, kind });
        }
        dispatch(addAttachmentsAction(next));
    };

    const onPaste = async (e: React.ClipboardEvent) => {
        // If there's large text, auto-convert to text file and attach (do not open modal)
        const text = e.clipboardData?.getData("text");
        if (text) {
            const words = text.trim().split(/\s+/).filter(Boolean);
            const lineCount = text.split(/\r?\n/).length;
            if (words.length > CHAT_CONFIG.LARGE_TEXT_THRESHOLD.WORDS || lineCount > CHAT_CONFIG.LARGE_TEXT_THRESHOLD.LINES) {
                e.preventDefault();
                const defaultName = `pasted-${Date.now()}.txt`;
                try {
                    const blob = new Blob([text], { type: 'text/plain' });
                    const file = new File([blob], defaultName, { type: 'text/plain' });
                    await addFiles([file]);
                    toast.message(UI_MESSAGES.SUCCESS.LARGE_TEXT_ATTACHED);
                } catch {
                    toast.error(UI_MESSAGES.ERRORS.PASTE_FAILED);
                }
                return;
            }
        }
        // Otherwise, collect pasted files/images as before
        const items = e.clipboardData?.items;
        if (!items) return;
        const files: File[] = [];
        for (const it of items as any) {
            if (it.kind === 'file') {
                const f = it.getAsFile?.();
                if (f) files.push(f);
            }
        }
        if (files.length) {
            e.preventDefault();
            await addFiles(files);
        }
    };

    const onDrop = async (e: React.DragEvent) => {
        const dt = e.dataTransfer;
        const types = (dt && Array.from(dt.types)) || [];
        const hasFiles = types.includes('Files');
        // Only intercept default behavior if files are present; let text drops fall through
        if (!hasFiles) return;
        e.preventDefault();
        const files: File[] = [];
        if (dt?.items) {
            for (const it of Array.from(dt.items)) {
                if (it.kind === 'file') {
                    const f = it.getAsFile();
                    if (f) files.push(f);
                }
            }
        } else if (dt?.files) {
            for (const f of Array.from(dt.files)) files.push(f);
        }
        if (files.length) await addFiles(files);
    };

    const onDragOver = (e: React.DragEvent) => {
        const types = (e.dataTransfer && Array.from(e.dataTransfer.types)) || [];
        // Only prevent default if files are being dragged, so the drop is allowed
        if (types.includes('Files')) {
            e.preventDefault();
        }
    };

    return (
        <div className="min-h-screen relative flex flex-col">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 pb-4 space-y-6 w-full max-w-5xl mx-auto">
                {messages.length === 1 && <WelcomeMessage />}

                {messages.slice(1).map((message, index) => (
                    <MessageRenderer key={message.id} message={message} index={index} />
                ))}

                {/* Thinking indicator - more subtle */}
                {isStreaming && (
                    <div className="flex items-start gap-4">
                        <div className="size-8 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center flex-shrink-0">
                            <Sparkles className="w-4 h-4 text-primary-foreground" />
                        </div>
                        <div className="flex-1">
                            <div className="bg-muted/50 rounded-lg p-3 max-w-fit">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <div className="flex gap-1">
                                        <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                        <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                        <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                    </div>
                                    <span>Analyzing your request</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Composer - static at bottom */}
            <div onDrop={onDrop} onDragOver={onDragOver} className="sticky bottom-0 z-10 bg-background/95 supports-[backdrop-filter]:bg-background/60 backdrop-blur border-t">
                <div className="w-full max-w-5xl mx-auto px-4 md:px-0 py-4">
                    <div className="space-y-3">
                        <AttachmentPreview
                            attachments={attachments}
                            onPreview={async (index) => {
                                const a = attachments[index];
                                const isText = a.file.type.startsWith('text/') || /\.(txt|md|csv|json|log)$/i.test(a.file.name);
                                try {
                                    if (isText) {
                                        const txt = await a.file.text().catch(() => '');
                                        dispatch(openPreview({ open: true, name: a.file.name || 'attachment', mode: 'text', text: txt, imageUrl: undefined, index }));
                                    } else if (a.kind === 'image') {
                                        dispatch(openPreview({ open: true, name: a.file.name || 'attachment', mode: 'image', text: '', imageUrl: a.url, index }));
                                    }
                                } catch { }
                            }}
                            onRemove={(index) => dispatch(removeAttachment(index))}
                        />
                        
                        <ChatComposer
                            ref={textareaRef}
                            value={input}
                            onChange={setInput}
                            onSubmit={handleSubmit}
                            onPaste={onPaste}
                            onDrop={onDrop}
                            disabled={isStreaming}
                            deepthink={deepthink}
                            webSearch={webSearch}
                            showHints={showHints}
                            onToggleDeepthink={() => dispatch(toggleDeepthink())}
                            onToggleWebSearch={() => dispatch(toggleWebSearch())}
                            onToggleHints={() => dispatch(toggleHints())}
                            onCopy={handleCopy}
                            onAttachFiles={() => fileInputRef.current?.click()}
                        />
                        
                        <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            className="hidden"
                            onChange={(e) => {
                                const files = Array.from(e.target.files || []);
                                addFiles(files);
                                e.currentTarget.value = ""; // reset
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Pasted text preview modal (Redux-driven) */}
            <PastePreviewModal
                open={preview.open}
                name={preview.name}
                text={preview.text || ''}
                mode={preview.mode}
                imageUrl={preview.imageUrl}
                onNameChange={(name) => dispatch(openPreview({ ...preview, name, open: true }))}
                onClose={() => { dispatch(closePreview()); }}
                onAttach={() => {
                    try {
                        if (preview.index != null) {
                            const newFile = new File([preview.text || ''], preview.name || 'pasted-text.txt', { type: 'text/plain' });
                            dispatch(renameAttachment({ index: preview.index, newFile }));
                        }
                    } catch {
                        // ignore
                    } finally {
                        dispatch(closePreview());
                    }
                }}
            />
            {/* Mount the headless step executor to run step flows */}
            <StepExecutor />
        </div>
    );
}