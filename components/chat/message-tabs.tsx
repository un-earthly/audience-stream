"use client";

import { useState } from "react";
import { useAppSelector } from "@/lib/hooks";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StepsCollapsible } from "./steps-collapsible";
import { Brain, Clock } from "lucide-react";

interface MessageTabsProps {
  messageId: string;
  jsonData?: unknown;
}

export function MessageTabs({ messageId, jsonData }: MessageTabsProps) {
  const tabs = useAppSelector((s) => s.tabs[messageId]);
  const { executions } = useAppSelector((s) => s.steps);
  const execution = executions.find((e) => e.messageId === messageId);
  const [value, setValue] = useState<string>("answer");
  const [showThoughts, setShowThoughts] = useState<boolean>(true);
  const { isStreaming, currentStreamingId } = useAppSelector((s) => s.chat);
  const thinkingActive = isStreaming && currentStreamingId === messageId;

  return (
    <Tabs value={value} onValueChange={setValue} className="mt-4">
      <TabsList>
        <TabsTrigger value="answer">Answer</TabsTrigger>
        <TabsTrigger value="images">Images</TabsTrigger>
        <TabsTrigger value="sources">Sources</TabsTrigger>
        <TabsTrigger value="steps">Steps</TabsTrigger>
      </TabsList>

      <TabsContent value="answer">
        <Card className="p-4 space-y-4">
          <div className="flex items-center justify-between gap-2">
            <div className="text-sm font-medium">AI Answer</div>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => navigator.clipboard.writeText(tabs?.answer ?? "")}
              >
                Copy
              </Button>
              {tabs?.thoughts && tabs.thoughts.length > 0 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => setShowThoughts((v) => !v)}
                >
                  {showThoughts ? 'Hide thoughts' : 'Show thoughts'}
                </Button>
              )}
            </div>
          </div>
          {/* Thinking / Thoughts block with inline toggle */}
          {tabs?.thoughts && tabs.thoughts.length > 0 && (
            <div className="text-xs border rounded-md p-2 bg-muted/30">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2 font-medium">
                  <Brain className="w-3 h-3" />
                  <span>{thinkingActive ? 'Thinking' : 'Thoughts'}</span>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-6 px-2 py-0"
                  onClick={() => setShowThoughts((v) => !v)}
                >
                  {showThoughts ? 'Hide' : 'Show'}
                </Button>
              </div>
              {showThoughts && (
                <ul className="space-y-1">
                  {tabs.thoughts.map((t, i) => (
                    <li key={i} className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="w-3 h-3 opacity-70" />
                      <span className="truncate">{t.text}</span>
                      <span className="ml-auto tabular-nums opacity-70">{new Date(t.ts).toLocaleTimeString()}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
          <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
            {tabs?.answer ?? "Generating answer..."}
          </div>
          {jsonData != null && (
            <div>
              <div className="text-sm font-medium mb-1">Campaign JSON</div>
              {/* Reuse the existing JsonBlock for nice formatting */}
              {/* @ts-ignore component import resolution at runtime */}
              {/**/}
              <div>
                {/* We'll import dynamically in parent; for now just stringify */}
                <pre className="text-xs overflow-x-auto bg-background p-3 rounded-md border">
{typeof jsonData === 'string' ? jsonData : JSON.stringify(jsonData, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </Card>
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
