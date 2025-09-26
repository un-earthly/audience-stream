"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, Brain, Search, Eye, EyeOff, Copy, X, Paperclip, Eye as EyeIcon } from "lucide-react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { addMessage } from "@/lib/features/chat/chatSlice";
import { startExecution } from "@/lib/features/chat/stepSlice";
import { StepExecutor } from "@/components/chat/step-executor";
import { MessageRenderer } from "@/components/chat/message-renderer";
import { PastePreviewModal } from "@/components/chat/paste-preview-modal";

export function ChatInterface() {
    const [input, setInput] = useState("");
    const [deepthink, setDeepthink] = useState(false);
    const [webSearch, setWebSearch] = useState(false);
    const [showHints, setShowHints] = useState(true);
    const [isThinking, setIsThinking] = useState(false);
    const [attachments, setAttachments] = useState<Array<{ file: File; url?: string; kind: 'image' | 'file' }>>([]);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [previewText, setPreviewText] = useState("");
    const [previewName, setPreviewName] = useState("pasted-text.txt");
    const [previewMode, setPreviewMode] = useState<'text' | 'image'>('text');
    const [previewImageUrl, setPreviewImageUrl] = useState<string | undefined>(undefined);
    const [pendingAttachIndex, setPendingAttachIndex] = useState<number | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const dispatch = useAppDispatch();
    const { messages, isStreaming } = useAppSelector((state) => state.chat);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, scrollToBottom]);

    // Persist/rehydrate attachments (previews only)
    useEffect(() => {
        try {
            const raw = localStorage.getItem("chat_attachments");
            if (raw) {
                const parsed: Array<{ name: string; size: number; type: string; kind: 'image' | 'file'; dataUrl?: string }> = JSON.parse(raw);
                const restored = parsed.map(p => ({
                    file: new File([""], p.name, { type: p.type, lastModified: Date.now() }),
                    url: p.dataUrl,
                    kind: p.kind,
                }));
                setAttachments(restored);
            }
        } catch { }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        try {
            const serializable = attachments.map(a => ({
                name: a.file.name,
                size: a.file.size,
                type: a.file.type,
                kind: a.kind,
                dataUrl: a.url,
            }));
            localStorage.setItem("chat_attachments", JSON.stringify(serializable));
        } catch { }
    }, [attachments]);

    const generateStepsFromQuery = (_query: string) => {
        return [
            {
                title: "Thinking",
                description: "Considering your request and planning actions",
            },
            {
                title: "Analyzing Context",
                description: "Reviewing connected sources and relevant data",
            },
            {
                title: "Generate Recommendations",
                description: "Producing the campaign answer, JSON, images and sources",
            },
        ];
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

        // Add user message
        dispatch(
            addMessage({
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
            })
        );

        // Show thinking indicator
        setIsThinking(true);

        // Simulate thinking time (shorter, more natural)
        await new Promise((resolve) => setTimeout(resolve, 800));

        // Add assistant message with initial response
        const assistantMessageId = Date.now().toString();
        dispatch(
            addMessage({
                type: "assistant",
                content: "I'll help you with that. Let me analyze your request and create a comprehensive solution.",
                id: assistantMessageId,
                streaming: false,
            })
        );

        setIsThinking(false);
        // Clear attachments after sending
        setAttachments([]);

        // Small delay before starting steps
        await new Promise((resolve) => setTimeout(resolve, 500));

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
            toast.success("Copied to clipboard");
        } catch (err) {
            toast.error("Failed to copy");
        }
    };

    const handleEditFocus = () => {
        textareaRef.current?.focus();
    };

    // Helpers to collect files from paste/drag
    const MAX_FILES = 10;
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    const addFiles = async (files: File[]) => {
        if (!files.length) return;
        if (attachments.length + files.length > MAX_FILES) {
            toast.error(`You can attach up to ${MAX_FILES} files`);
            return;
        }
        const next: Array<{ file: File; url?: string; kind: 'image' | 'file' }> = [];
        for (const f of files) {
            if (f.size > MAX_FILE_SIZE) {
                toast.error(`${f.name} is larger than 10MB`);
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
        setAttachments((prev) => [...prev, ...next]);
    };

    const onPaste = async (e: React.ClipboardEvent) => {
        // If there's large text, auto-convert to text file and attach (do not open modal)
        const text = e.clipboardData?.getData("text");
        if (text) {
            const words = text.trim().split(/\s+/).filter(Boolean);
            const lineCount = text.split(/\r?\n/).length;
            if (words.length > 400 || lineCount > 5) {
                e.preventDefault();
                const defaultName = `pasted-${Date.now()}.txt`;
                try {
                    const blob = new Blob([text], { type: 'text/plain' });
                    const file = new File([blob], defaultName, { type: 'text/plain' });
                    await addFiles([file]);
                    toast.message('Large text attached as file');
                } catch {
                    toast.error('Failed to attach pasted text');
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
        e.preventDefault();
        const dt = e.dataTransfer;
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
        await addFiles(files);
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
                {messages.length === 1 && (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/60 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Sparkles className="size-8 text-primary-foreground" />
                        </div>
                        <h2 className="text-2xl font-semibold mb-2">Welcome to AudienceStream</h2>
                        <p className="text-muted-foreground max-w-md mx-auto">
                            I'm your AI campaign orchestrator. Ask me to create campaigns, analyze audiences,
                            or optimize your marketing strategy.
                        </p>
                    </div>
                )}

                {messages.slice(1).map((message, index) => (
                    <MessageRenderer key={message.id} message={message} index={index} />
                ))}

                {/* Thinking indicator - more subtle */}
                {isThinking && (
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
            <div onDrop={onDrop} onDragOver={onDragOver}>
                <div className="w-full max-w-5xl mx-auto px-4 md:px-0">
                    <div>
                        <form onSubmit={handleSubmit} className="p-2">
                            {/* Attachments preview */}
                            {attachments.length > 0 && (
                                <div className="mb-2 flex flex-wrap items-center gap-2">
                                    {attachments.map((a, idx) => (
                                        <div
                                            key={idx}
                                            className="group relative border rounded-lg bg-muted/30 p-1.5 flex items-center gap-2 cursor-pointer"
                                            title="Preview"
                                            onClick={async () => {
                                                const isText = a.file.type.startsWith('text/') || /\.(txt|md|csv|json|log)$/i.test(a.file.name);
                                                try {
                                                    setPreviewName(a.file.name || 'attachment');
                                                    setPendingAttachIndex(idx);
                                                    if (isText) {
                                                        const txt = await a.file.text().catch(() => '');
                                                        setPreviewMode('text');
                                                        setPreviewText(txt);
                                                        setPreviewImageUrl(undefined);
                                                    } else if (a.kind === 'image') {
                                                        setPreviewMode('image');
                                                        setPreviewImageUrl(a.url);
                                                        setPreviewText('');
                                                    } else {
                                                        return;
                                                    }
                                                    setIsPreviewOpen(true);
                                                } catch { }
                                            }}
                                        >
                                            {a.kind === 'image' ? (
                                                <img src={a.url} alt={a.file.name} className="w-12 h-12 object-cover rounded-md border" />
                                            ) : (
                                                <div className="w-12 h-12 rounded-md border flex items-center justify-center bg-background">
                                                    <Paperclip className="w-4 h-4" />
                                                </div>
                                            )}
                                            <div className="max-w-[10rem]">
                                                <div className="text-[11px] font-medium truncate">{a.file.name}</div>
                                                <div className="text-[10px] text-muted-foreground">{(a.file.size / 1024).toFixed(1)} KB</div>
                                            </div>
                                            <span
                                                role="button"
                                                tabIndex={0}
                                                className="absolute -top-2 -right-2 bg-background border rounded-full p-1 shadow cursor-pointer opacity-0 group-hover:opacity-100 transition"
                                                title="Remove"
                                                onClick={(e) => { e.stopPropagation(); setAttachments(prev => prev.filter((_, i) => i !== idx)); }}
                                                onKeyDown={(e) => { if (e.key === 'Enter') { e.stopPropagation(); setAttachments(prev => prev.filter((_, i) => i !== idx)); } }}
                                            >
                                                <X className="w-3 h-3" />
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="relative">
                                <Textarea
                                    ref={textareaRef}
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    onPaste={onPaste}
                                    placeholder="Ask me to create a campaign, analyze your audience, or optimize your marketing strategy..."
                                    className="min-h-[64px] md:min-h-[80px] max-h-[160px] pr-10 resize-none rounded-lg"
                                    disabled={isStreaming || isThinking}
                                />
                                <button
                                    type="submit"
                                    disabled={!input.trim() || isStreaming || isThinking}
                                    className="absolute right-2 bottom-2 h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow disabled:opacity-60"
                                    aria-label="Send"
                                    title="Send"
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="flex items-center justify-between mt-2 text-[11px] text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    {showHints && (
                                        <div>Press Enter to send, Shift + Enter for new line</div>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    {/* Attach file: click to open picker, paste or drag & drop also supported */}
                                    <span
                                        className="inline-flex items-center gap-1 text-foreground/70 hover:text-foreground cursor-pointer"
                                        title="Attach files"
                                        role="button"
                                        tabIndex={0}
                                        onClick={() => fileInputRef.current?.click()}
                                        onKeyDown={(e) => { if (e.key === 'Enter') fileInputRef.current?.click(); }}
                                    >
                                        <Paperclip className="h-4 w-4" />
                                    </span>
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
                                    <span
                                        role="button"
                                        tabIndex={0}
                                        onClick={() => setDeepthink((v) => !v)}
                                        onKeyDown={(e) => { if (e.key === 'Enter') setDeepthink((v) => !v); }}
                                        className={"inline-flex cursor-pointer items-center transition-colors " + (deepthink ? 'text-foreground' : 'text-foreground/70 hover:text-foreground')}
                                        title="Toggle Deepthink"
                                        aria-label="Toggle Deepthink"
                                    >
                                        <Brain className="h-4 w-4" />
                                    </span>
                                    <span
                                        role="button"
                                        tabIndex={0}
                                        onClick={() => setWebSearch((v) => !v)}
                                        onKeyDown={(e) => { if (e.key === 'Enter') setWebSearch((v) => !v); }}
                                        className={"inline-flex cursor-pointer items-center transition-colors " + (webSearch ? 'text-foreground' : 'text-foreground/70 hover:text-foreground')}
                                        title="Toggle Web Search"
                                        aria-label="Toggle Web Search"
                                    >
                                        <Search className="h-4 w-4" />
                                    </span>
                                    <span
                                        role="button"
                                        tabIndex={0}
                                        onClick={handleCopy}
                                        onKeyDown={(e) => { if (e.key === 'Enter') handleCopy(); }}
                                        className={"inline-flex cursor-pointer items-center transition-colors " + (!input ? 'opacity-50 pointer-events-none' : 'text-foreground/70 hover:text-foreground')}
                                        title="Copy"
                                        aria-label="Copy"
                                    >
                                        <Copy className="h-4 w-4" />
                                    </span>
                                    <span
                                        role="button"
                                        tabIndex={0}
                                        onClick={() => setShowHints((v) => !v)}
                                        onKeyDown={(e) => { if (e.key === 'Enter') setShowHints((v) => !v); }}
                                        className="inline-flex cursor-pointer items-center text-foreground/70 hover:text-foreground transition-colors"
                                        title={showHints ? 'Hide helper text' : 'Show helper text'}
                                        aria-label={showHints ? 'Hide helper text' : 'Show helper text'}
                                    >
                                        {showHints ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </span>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* Pasted text preview modal */}
            <PastePreviewModal
                open={isPreviewOpen}
                name={previewName}
                text={previewText}
                mode={previewMode}
                imageUrl={previewImageUrl}
                onNameChange={setPreviewName}
                onClose={() => { setIsPreviewOpen(false); setPendingAttachIndex(null); }}
                onAttach={() => {
                    try {
                        if (pendingAttachIndex != null) {
                            const newFile = new File([previewText], previewName || 'pasted-text.txt', { type: 'text/plain' });
                            setAttachments((prev) => prev.map((a, i) => i === pendingAttachIndex ? { ...a, file: newFile } : a));
                        }
                        setIsPreviewOpen(false);
                    } catch {
                        // ignore
                    } finally {
                        setPendingAttachIndex(null);
                    }
                }}
            />
        </div>
    );
}