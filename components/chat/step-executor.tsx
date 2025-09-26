"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  updateStepStatus,
  nextStep,
  completeExecution,
} from "@/lib/features/chat/stepSlice";
import { stopStreaming } from "@/lib/features/chat/chatSlice";
import { setCurrentCampaign, addCampaign } from "@/lib/features/campaign/campaignSlice";
import { useCampaignStream } from "@/lib/hooks/use-campaign-stream";

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

  useEffect(() => {
    if (!execution || !execution.isRunning) return;

    const executeStepsWithStreaming = async () => {
      // Find the original user message to get the query
      const userMessage = messages.find(m => 
        m.type === "user" && 
        messages.indexOf(m) === messages.findIndex(msg => msg.id === execution.messageId) - 1
      );
      
      const query = userMessage?.content || "create campaign";

      // Execute steps with visual feedback
      for (let i = 0; i < execution.steps.length; i++) {
        const step = execution.steps[i];
        
        // Start step
        dispatch(updateStepStatus({
          executionId: execution.id,
          stepId: step.id,
          status: "running",
          progress: 0,
        }));

        // Simulate step progress
        for (let progress = 0; progress <= 100; progress += 25) {
          await new Promise(resolve => setTimeout(resolve, 150));
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
        if (i < execution.steps.length - 1) {
          dispatch(nextStep(execution.id));
          await new Promise(resolve => setTimeout(resolve, 200));
        }
      }

      // Start real streaming for the last step (campaign generation)
      if (execution.steps.length > 0) {
        await streamCampaign(query, execution.messageId, (campaignData) => {
          if (campaignData.campaign) {
            dispatch(setCurrentCampaign(campaignData.campaign));
            dispatch(addCampaign(campaignData.campaign));
          }
        });
      }

      // Complete execution
      dispatch(completeExecution(execution.id));
      dispatch(stopStreaming());
    };

    executeStepsWithStreaming();
  }, [execution, dispatch, streamCampaign, messages]);

  return null; // This component doesn't render anything
}