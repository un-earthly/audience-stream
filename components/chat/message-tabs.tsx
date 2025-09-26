"use client";

import { useState } from "react";
import { useAppSelector } from "@/lib/hooks";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { StepsCollapsible } from "./steps-collapsible";

interface MessageTabsProps {
  messageId: string;
}

export function MessageTabs({ messageId }: MessageTabsProps) {
  const tabs = useAppSelector((s) => s.tabs[messageId]);
  const { executions } = useAppSelector((s) => s.steps);
  const execution = executions.find((e) => e.messageId === messageId);
  const [value, setValue] = useState<string>("answer");

  return (
    <Tabs value={value} onValueChange={setValue} className="mt-4">
      <TabsList>
        <TabsTrigger value="answer">Answer</TabsTrigger>
        <TabsTrigger value="images">Images</TabsTrigger>
        <TabsTrigger value="sources">Sources</TabsTrigger>
        <TabsTrigger value="steps">Steps</TabsTrigger>
      </TabsList>

      <TabsContent value="answer">
        <Card className="p-4">
          <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
            {tabs?.answer ?? "Generating answer..."}
          </div>
        </Card>
      </TabsContent>

      <TabsContent value="images">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {(tabs?.images ?? []).map((src, i) => (
            <img key={i} src={`${src}&auto=format&fit=crop&w=400&q=60`} alt="" className="rounded-md border" />
          ))}
          {!tabs?.images?.length && (
            <div className="text-sm text-muted-foreground">No images yet.</div>
          )}
        </div>
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
