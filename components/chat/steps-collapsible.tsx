"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, Check, Loader2, AlertCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { StepExecution } from "@/lib/features/chat/stepSlice";

interface StepsCollapsibleProps {
  execution: StepExecution;
}

export function StepsCollapsible({ execution }: StepsCollapsibleProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const completedSteps = execution.steps.filter(step => step.status === "completed").length;
  const runningStep = execution.steps.find(step => step.status === "running");
  const hasError = execution.steps.some(step => step.status === "error");
  
  // Show current running step or summary
  const currentStep = runningStep || execution.steps[execution.currentStepIndex];
  
  return (
    <div className="mt-3 border border-border/50 rounded-lg bg-muted/20">
      {/* Compact header */}
      <Button
        variant="ghost"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full justify-between p-3 h-auto text-left hover:bg-muted/30"
      >
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            {hasError ? (
              <AlertCircle className="w-4 h-4 text-destructive" />
            ) : runningStep ? (
              <Loader2 className="w-4 h-4 text-primary animate-spin" />
            ) : execution.isRunning ? (
              <Clock className="w-4 h-4 text-muted-foreground" />
            ) : (
              <Check className="w-4 h-4 text-green-600" />
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium">
              {runningStep ? runningStep.title : 
               execution.isRunning ? "Processing..." : 
               "Analysis Complete"}
            </div>
            <div className="text-xs text-muted-foreground">
              {execution.isRunning ? 
                `Step ${completedSteps + 1} of ${execution.steps.length}` :
                `Completed ${completedSteps} steps`
              }
            </div>
          </div>
          
          {/* Progress indicator */}
          <div className="flex items-center gap-2">
            <div className="w-16">
              <Progress 
                value={(completedSteps / execution.steps.length) * 100} 
                className="h-1" 
              />
            </div>
            {isExpanded ? (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            )}
          </div>
        </div>
      </Button>

      {/* Expanded content */}
      {isExpanded && (
        <div className="border-t border-border/50 p-3 space-y-2">
          {execution.steps.map((step, stepIndex) => (
            <div key={step.id} className="flex items-center gap-3 py-2">
              {/* Step icon */}
              <div className="flex-shrink-0">
                {step.status === "completed" ? (
                  <div className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <Check className="w-3 h-3 text-green-600" />
                  </div>
                ) : step.status === "running" ? (
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                    <Loader2 className="w-3 h-3 text-primary animate-spin" />
                  </div>
                ) : step.status === "error" ? (
                  <div className="w-5 h-5 rounded-full bg-destructive/10 flex items-center justify-center">
                    <AlertCircle className="w-3 h-3 text-destructive" />
                  </div>
                ) : (
                  <div className="w-5 h-5 rounded-full bg-muted border border-border flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-muted-foreground/30" />
                  </div>
                )}
              </div>

              {/* Step content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{step.title}</span>
                  {step.status !== "pending" && (
                    <Badge
                      variant={
                        step.status === "completed"
                          ? "secondary"
                          : step.status === "running"
                          ? "default"
                          : "destructive"
                      }
                      className="text-xs px-1.5 py-0"
                    >
                      {step.status}
                    </Badge>
                  )}
                </div>
                
                <div className="text-xs text-muted-foreground mt-0.5">
                  {step.description}
                </div>

                {/* Progress bar for running step */}
                {step.status === "running" && (
                  <div className="mt-2">
                    <Progress value={step.progress} className="h-1" />
                  </div>
                )}

                {/* Error message */}
                {step.status === "error" && step.error && (
                  <div className="mt-1 text-xs text-destructive">
                    {step.error}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}