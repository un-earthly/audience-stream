"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { addMessage } from "@/lib/features/chat/chatSlice";
import { startExecution } from "@/lib/features/chat/stepSlice";
import { StepExecutor } from "@/components/chat/step-executor";
import { MessageRenderer } from "@/components/chat/message-renderer";

export function ChatInterface() {
    const [input, setInput] = useState("");
    const [isThinking, setIsThinking] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const dispatch = useAppDispatch();
    const { messages, isStreaming } = useAppSelector((state) => state.chat);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, scrollToBottom]);

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

        const userMessage = input.trim();
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

    return (
        <div className="flex flex-col  h-full">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {messages.length === 1 && (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/60 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Sparkles className="w-8 h-8 text-primary-foreground" />
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
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center flex-shrink-0">
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

            {/* Input */}
            <div className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-6">
                <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
                    <div className="relative">
                        <Textarea
                            ref={textareaRef}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Ask me to create a campaign, analyze your audience, or optimize your marketing strategy..."
                            className="min-h-[60px] max-h-[200px] pr-12 resize-none"
                            disabled={isStreaming || isThinking}
                        />
                        <Button
                            type="submit"
                            size="icon"
                            disabled={!input.trim() || isStreaming || isThinking}
                            className="absolute right-2 bottom-2 h-8 w-8"
                        >
                            <Send className="w-4 h-4" />
                        </Button>
                    </div>
                    <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
                        <div>Press Enter to send, Shift + Enter for new line</div>
                        <div>Powered by AI</div>
                    </div>
                </form>
            </div>

            {/* Step Executor */}
            <StepExecutor />
        </div>
    );
}