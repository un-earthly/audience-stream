"use client";

import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { StepsCollapsible } from "./steps-collapsible";
import { Brain, Clock, Copy, Eye, EyeOff, ThumbsUp, ThumbsDown, Check, ChevronDown, FileJson } from "lucide-react";
import { setFeedback, setAnswer, appendThoughts, appendSources, appendImages, setTabs } from "@/lib/features/chat/tabsSlice";
import { CampaignConfigurator } from "./campaign-configurator";
import { toast } from "sonner";
import { getRandomCampaignChunks, getRandomLoremText } from "@/lib/constants/chat";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Button } from "@/components/ui/button";
import { startExecution, updateStepStatus, nextStep, completeExecution } from "@/lib/features/chat/stepSlice";
import { startStreaming, stopStreaming } from "@/lib/features/chat/chatSlice";
interface MessageTabsProps {
  messageId: string;
  jsonData?: unknown;
}

export function MessageTabs({ messageId, jsonData }: MessageTabsProps) {
  const tabs = useAppSelector((s) => s.tabs[messageId]);
  const { executions } = useAppSelector((s) => s.steps);
  const execution = executions.find((e) => e.messageId === messageId);
  const dispatch = useAppDispatch();
  const [value, setValue] = useState<string>("answer");
  const [showThoughts, setShowThoughts] = useState<boolean>(true);
  const { isStreaming, currentStreamingId } = useAppSelector((s) => s.chat);
  // Keep latest state snapshots in refs for timers
  const executionsRef = useRef(executions);
  const chatRef = useRef({ isStreaming, currentStreamingId });
  useEffect(() => { executionsRef.current = executions; }, [executions]);
  useEffect(() => { chatRef.current = { isStreaming, currentStreamingId }; }, [isStreaming, currentStreamingId]);
  const thinkingActive = isStreaming && currentStreamingId === messageId;
  const [copied, setCopied] = useState(false);

  // Refs to manage mock streaming lifecycle
  const answerBufferRef = useRef<string>(tabs?.answer ?? "");
  const answerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const thoughtsIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const stepTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearAllTimers = () => {
    if (answerIntervalRef.current) {
      clearInterval(answerIntervalRef.current);
      answerIntervalRef.current = null;
    }
    if (thoughtsIntervalRef.current) {
      clearInterval(thoughtsIntervalRef.current);
      thoughtsIntervalRef.current = null;
    }
    stepTimersRef.current.forEach((t) => clearTimeout(t));
    stepTimersRef.current = [];
  };

  // Kick off a mock streaming process for this message
  const startMockStream = () => {
    // Prevent double-starts
    if (thinkingActive) return;

    // Reset tabs for this message and start streaming
    dispatch(setTabs({ messageId, data: { answer: "", images: [], sources: [], thoughts: [] } }));
    answerBufferRef.current = "";
    dispatch(startStreaming(messageId));

    // Start steps execution
    const steps = [
      { title: "Analyze prompt", description: "Understanding user intent" },
      { title: "Fetch data", description: "Gathering relevant signals" },
      { title: "Generate response", description: "Composing answer and assets" },
    ];
    dispatch(startExecution({ messageId, steps }));

    // We need the latest execution id from store after startExecution. We'll poll it briefly.
    const getExecutionId = () => {
      const ex = executionsRef.current.find((e) => e.messageId === messageId);
      return ex?.id;
    };

    // Steps progression simulation
    const scheduleSteps = () => {
      const execId = getExecutionId();
      if (!execId) return;
      // Step 1 running -> complete
      stepTimersRef.current.push(setTimeout(() => {
        const execIdNow = getExecutionId();
        if (!execIdNow) return;
        // Get first step id from store
        const exNow = executionsRef.current.find((e) => e.id === execIdNow);
        const step1 = exNow?.steps?.[0];
        if (step1) {
          dispatch(updateStepStatus({ executionId: execIdNow, stepId: step1.id, status: "running", progress: 25 }));
        }
      }, 300));

      stepTimersRef.current.push(setTimeout(() => {
        const execIdNow = getExecutionId();
        if (!execIdNow) return;
        const exNow = executionsRef.current.find((e) => e.id === execIdNow);
        const step1 = exNow?.steps?.[0];
        if (step1) {
          dispatch(updateStepStatus({ executionId: execIdNow, stepId: step1.id, status: "completed", progress: 100 }));
          dispatch(nextStep(execIdNow));
        }
      }, 1200));

      // Step 2
      stepTimersRef.current.push(setTimeout(() => {
        const execIdNow = getExecutionId();
        if (!execIdNow) return;
        const exNow = executionsRef.current.find((e) => e.id === execIdNow);
        const step2 = exNow?.steps?.[1];
        if (step2) {
          dispatch(updateStepStatus({ executionId: execIdNow, stepId: step2.id, status: "running", progress: 20 }));
        }
      }, 1500));

      stepTimersRef.current.push(setTimeout(() => {
        const execIdNow = getExecutionId();
        if (!execIdNow) return;
        const exNow = executionsRef.current.find((e) => e.id === execIdNow);
        const step2 = exNow?.steps?.[1];
        if (step2) {
          dispatch(updateStepStatus({ executionId: execIdNow, stepId: step2.id, status: "completed", progress: 100 }));
          dispatch(nextStep(execIdNow));
        }
      }, 2600));

      // Step 3
      stepTimersRef.current.push(setTimeout(() => {
        const execIdNow = getExecutionId();
        if (!execIdNow) return;
        const exNow = executionsRef.current.find((e) => e.id === execIdNow);
        const step3 = exNow?.steps?.[2];
        if (step3) {
          dispatch(updateStepStatus({ executionId: execIdNow, stepId: step3.id, status: "running", progress: 30 }));
        }
      }, 2900));

      stepTimersRef.current.push(setTimeout(() => {
        const execIdNow = getExecutionId();
        if (!execIdNow) return;
        const exNow = executionsRef.current.find((e) => e.id === execIdNow);
        const step3 = exNow?.steps?.[2];
        if (step3) {
          dispatch(updateStepStatus({ executionId: execIdNow, stepId: step3.id, status: "completed", progress: 100 }));
          dispatch(completeExecution(execIdNow));
        }
      }, 4200));
    };

    // Answer streaming simulation with dynamic content
    const campaignChunks = getRandomCampaignChunks();
    const loremChunks = Array.from({ length: 5 }, () => getRandomLoremText(3) + ' ');
    const chunks = [...campaignChunks, ...loremChunks];
    let idx = 0;
    answerIntervalRef.current = setInterval(() => {
      const chatState = chatRef.current;
      if (!chatState.isStreaming || chatState.currentStreamingId !== messageId) {
        // Stop if streaming was cancelled elsewhere
        if (answerIntervalRef.current) clearInterval(answerIntervalRef.current);
        return;
      }
      if (idx >= chunks.length) {
        if (answerIntervalRef.current) {
          clearInterval(answerIntervalRef.current);
          answerIntervalRef.current = null;
        }
        // Append sources and images at the end
        dispatch(appendSources({ messageId, sources: [
          { title: "Marketing signals report", url: "https://example.com/report", source: "Internal" },
          { title: "Industry trends Q3", url: "https://example.com/trends", source: "Analyst" },
        ]}));
        dispatch(appendImages({ messageId, images: [
          "https://images.unsplash.com/photo-1551836022-d5d88e9218df?ixlib=rb-4.0.3",
          "https://images.unsplash.com/photo-1529336953121-ad71687a4a7b?ixlib=rb-4.0.3",
        ] }));
        // Stop overall streaming when everything is done (a bit after steps complete)
        stepTimersRef.current.push(setTimeout(() => {
          dispatch(stopStreaming());
        }, 800));
        return;
      }
      answerBufferRef.current += chunks[idx++];
      dispatch(setAnswer({ messageId, answer: answerBufferRef.current }));
    }, Math.random() * 200 + 100); // Faster, more dynamic interval

    // Thoughts streaming simulation with dynamic content
    const thoughtPhrases = [
      "Analyzing customer behavior patterns",
      "Processing engagement metrics",
      "Optimizing channel selection",
      "Generating personalized content",
      "Calculating conversion probabilities",
      "Refining audience segments",
      "Testing message variations",
      "Evaluating campaign timing",
      "Assessing budget allocation",
      "Monitoring performance indicators"
    ];
    let t = 0;
    thoughtsIntervalRef.current = setInterval(() => {
      // Randomly select from available phrases
      const randomIndex = Math.floor(Math.random() * thoughtPhrases.length);
      const phrase = thoughtPhrases[randomIndex];
      
      // Occasionally add lorem ipsum for longer thoughts
      const finalPhrase = Math.random() > 0.7 
        ? `${phrase} - ${getRandomLoremText(1).slice(0, 50)}...`
        : phrase;
      
      dispatch(appendThoughts({ messageId, thoughts: [{ text: finalPhrase, ts: Date.now() }] }));
      t += 1;
    }, Math.random() * 400 + 400); // Vary the interval between 400-800ms

    // Schedule steps after the store has the execution
    setTimeout(scheduleSteps, 50);
  };

  // Cleanup on unmount or when message changes
  useEffect(() => {
    return () => {
      clearAllTimers();
    };
  }, []);

  // Stop local timers if streaming stops externally
  useEffect(() => {
    if (!thinkingActive) {
      clearAllTimers();
    }
  }, [thinkingActive]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(tabs?.answer ?? "");
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (_) {
      // ignore
    }
  };

  return (
    <Tabs value={value} onValueChange={setValue} className="mt-4">
      <TabsList>
        <TabsTrigger value="answer">Answer</TabsTrigger>
        <TabsTrigger value="images">Images</TabsTrigger>
        <TabsTrigger value="sources">Sources</TabsTrigger>
        <TabsTrigger value="steps">Steps</TabsTrigger>
      </TabsList>

      <TabsContent value="answer">
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between gap-2">
            <div className="text-sm font-medium">AI Answer</div>
            <div className="flex items-center gap-3">
              {/* Feedback icons */}
              <span
                role="button"
                tabIndex={0}
                title="Thumbs up"
                aria-label="Thumbs up"
                className={`inline-flex cursor-pointer items-center transition-colors ${tabs?.feedback === 'up' ? 'text-foreground' : 'text-foreground/70 hover:text-foreground'}`}
                onClick={() => { dispatch(setFeedback({ messageId, feedback: tabs?.feedback === 'up' ? null : 'up' })); toast.success(tabs?.feedback === 'up' ? 'Removed feedback' : 'Thanks for the thumbs up!'); }}
                onKeyDown={(e) => { if (e.key === 'Enter') { dispatch(setFeedback({ messageId, feedback: tabs?.feedback === 'up' ? null : 'up' })); toast.success(tabs?.feedback === 'up' ? 'Removed feedback' : 'Thanks for the thumbs up!'); } }}
              >
                <ThumbsUp className="w-4 h-4" />
              </span>
              <span
                role="button"
                tabIndex={0}
                title="Thumbs down"
                aria-label="Thumbs down"
                className={`inline-flex cursor-pointer items-center transition-colors ${tabs?.feedback === 'down' ? 'text-foreground' : 'text-foreground/70 hover:text-foreground'}`}
                onClick={() => { dispatch(setFeedback({ messageId, feedback: tabs?.feedback === 'down' ? null : 'down' })); toast.message(tabs?.feedback === 'down' ? 'Removed feedback' : 'Thanks for the feedback!'); }}
                onKeyDown={(e) => { if (e.key === 'Enter') { dispatch(setFeedback({ messageId, feedback: tabs?.feedback === 'down' ? null : 'down' })); toast.message(tabs?.feedback === 'down' ? 'Removed feedback' : 'Thanks for the feedback!'); } }}
              >
                <ThumbsDown className="w-4 h-4" />
              </span>

              {/* Copy */}
              <span
                role="button"
                tabIndex={0}
                title={copied ? 'Copied' : 'Copy answer'}
                aria-label="Copy answer"
                className="inline-flex cursor-pointer items-center text-foreground/70 hover:text-foreground transition-colors"
                onClick={handleCopy}
                onKeyDown={(e) => { if (e.key === 'Enter') handleCopy(); }}
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </span>

            </div>
          </div>
          {/* Dev helper to trigger mock streaming when there's no answer */}
          {!thinkingActive && !(tabs?.answer && tabs.answer.length > 0) && (
            <div className="flex items-center justify-between">
              <div className="text-xs text-muted-foreground">No answer yet. Start a mock stream to preview the UI.</div>
              <Button size="sm" variant="secondary" onClick={startMockStream}>Start mock stream</Button>
            </div>
          )}
          {/* Thinking / Thoughts block with inline toggle */}
          {tabs?.thoughts && tabs.thoughts.length > 0 && (
            <Collapsible className="text-xs border rounded-md p-2 bg-muted/30">
              <CollapsibleTrigger className="w-full">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2 font-medium">
                    <Brain className="w-3 h-3" />
                    <span>{thinkingActive ? 'Thinking' : 'Thoughts'}</span>
                  </div>
                  <ChevronDown className="w-3 h-3" />
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <ul className="space-y-1">
                  {tabs.thoughts.map((t, i) => (
                    <li key={i} className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="w-3 h-3 opacity-70" />
                      <span className="truncate">{t.text}</span>
                      <span className="ml-auto tabular-nums opacity-70">{new Date(t.ts).toLocaleTimeString()}</span>
                    </li>
                  ))}
                </ul>
              </CollapsibleContent>
            </Collapsible>
          )}
          <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
            {tabs?.answer ?? "Generating answer..."}
          </div>
          {tabs?.summary && (
            <div className="mt-3 prose prose-sm dark:prose-invert max-w-none">
              <h4 className="mt-2 mb-1">Summary</h4>
              <p className="whitespace-pre-wrap">{tabs.summary}</p>
            </div>
          )}
          {tabs?.suggestions && tabs.suggestions.length > 0 && (
            <div className="mt-3 prose prose-sm dark:prose-invert max-w-none">
              <h4 className="mt-2 mb-1">Suggested next steps</h4>
              <ul className="list-disc pl-5">
                {tabs.suggestions.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </TabsContent>

      <TabsContent value="images">
        <Card className="p-3">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {(tabs?.images ?? []).map((src, i) => (
              <img key={i} src={`${src}&auto=format&fit=crop&w=480&q=70`} alt="" className="rounded-md border aspect-video object-cover" />
            ))}
            {!tabs?.images?.length && (
              <div className="text-sm text-muted-foreground">No images yet.</div>
            )}
          </div>
        </Card>
      </TabsContent>

      <TabsContent value="sources">
        <Card className="p-4 space-y-2">
          {(tabs?.sources ?? []).map((s, i) => (
            <div key={i} className="flex items-center justify-between text-sm">
              <a href={s.url} target="_blank" rel="noreferrer" className="text-primary hover:underline truncate max-w-[80%]">
                {s.title}
              </a>
              {s.source && <span className="text-xs text-muted-foreground">{s.source}</span>}
            </div>
          ))}
          {!tabs?.sources?.length && (
            <div className="text-sm text-muted-foreground">No sources yet.</div>
          )}
        </Card>
      </TabsContent>

      <TabsContent value="steps">
        {execution ? (
          <StepsCollapsible execution={execution} />
        ) : (
          <div className="text-sm text-muted-foreground">No steps available.</div>
        )}
      </TabsContent>
    </Tabs>
  );
}
