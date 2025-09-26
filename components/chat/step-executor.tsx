"use client";

import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  updateStepStatus,
  nextStep,
  completeExecution,
} from "@/lib/features/chat/stepSlice";
import { stopStreaming } from "@/lib/features/chat/chatSlice";
import { setCurrentCampaign, addCampaign } from "@/lib/features/campaign/campaignSlice";
import { useCampaignStream } from "@/lib/hooks/use-campaign-stream";
import { Campaign, CampaignGenerationData } from "@/lib/types";

const campaignTemplates = [
  {
    name: "Weekend Flash Sale",
    audience: "Cart abandoners in last 7 days",
    channels: ["Email", "SMS", "WhatsApp"],
    message: "Get 20% off before Sunday ends! Complete your purchase now.",
    timing: "2025-09-28T10:00:00Z",
    meta: {
      priority: "high" as const,
      experiment_id: "exp_123",
      estimated_reach: 1200,
    },
  },
  {
    name: "Holiday Collection Launch",
    audience: "High-value prospects",
    channels: ["Email", "Ads"],
    message: "Discover our exclusive holiday collection. Limited time offer!",
    timing: "2025-12-01T09:00:00Z",
    meta: {
      priority: "medium" as const,
      experiment_id: "exp_124",
      estimated_reach: 450,
    },
  },
];

export function StepExecutor() {
  const dispatch = useAppDispatch();
  const { executions, currentExecution } = useAppSelector((state) => state.steps);
  const { messages } = useAppSelector((state) => state.chat);
  const execution = executions.find((e) => e.id === currentExecution);
  const { streamCampaign } = useCampaignStream();

  const isCompleteCampaign = (data: CampaignGenerationData["campaign"]): data is Campaign => {
    return (
      typeof data.id === "string" &&
      typeof data.name === "string" &&
      typeof data.audience === "string" &&
      Array.isArray(data.channels) &&
      typeof data.message === "string" &&
      typeof data.timing === "string" &&
      !!data.meta &&
      (data.meta.priority === "low" || data.meta.priority === "medium" || data.meta.priority === "high") &&
      typeof data.meta.experiment_id === "string" &&
      typeof data.meta.estimated_reach === "number"
    );
  };

  const started = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!execution || !execution.isRunning) return;
    if (started.current.has(execution.id)) return;
    started.current.add(execution.id);

    const executeStepsWithStreaming = async () => {
      // Find the original user message to get the query
      const userMessage = messages.find(m => 
        m.type === "user" && 
        messages.indexOf(m) === messages.findIndex(msg => msg.id === execution.messageId) - 1
      );
      
      const query = userMessage?.content || "create campaign";

      // Execute steps deterministically: 0 Thinking, 1 Analyze, 2 Generate
      for (let i = 0; i < execution.steps.length; i++) {
        const step = execution.steps[i];

        // Start step
        dispatch(updateStepStatus({
          executionId: execution.id,
          stepId: step.id,
          status: "running",
          progress: 0,
        }));

        // Fast deterministic progress for first two phases
        if (i < execution.steps.length - 1) {
          for (let progress = 20; progress <= 100; progress += 20) {
            await new Promise((r) => setTimeout(r, 120));
            dispatch(updateStepStatus({
              executionId: execution.id,
              stepId: step.id,
              status: "running",
              progress,
            }));
          }

          // Complete step
          dispatch(updateStepStatus({
            executionId: execution.id,
            stepId: step.id,
            status: "completed",
            progress: 100,
          }));

          // Move to next step
          dispatch(nextStep(execution.id));
          await new Promise((r) => setTimeout(r, 150));
          continue;
        }

        // Final phase: trigger streaming and wait until it finishes
        await streamCampaign(query, execution.messageId, (campaignData) => {
          if (campaignData.campaign && isCompleteCampaign(campaignData.campaign)) {
            dispatch(setCurrentCampaign(campaignData.campaign));
            dispatch(addCampaign(campaignData.campaign));
          }
        });

        // After stream completes, mark final step completed
        dispatch(updateStepStatus({
          executionId: execution.id,
          stepId: step.id,
          status: "completed",
          progress: 100,
        }));
      }

      // Complete execution
      dispatch(completeExecution(execution.id));
      dispatch(stopStreaming());
    };

    executeStepsWithStreaming();
  }, [execution, dispatch, streamCampaign, messages]);

  return null; // This component doesn't render anything
}