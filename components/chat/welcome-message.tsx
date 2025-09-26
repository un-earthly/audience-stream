"use client";

import { Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const WELCOME_FEATURES = [
  "Multi-channel campaigns",
  "AI-powered targeting", 
  "Real-time analytics",
  "Automated optimization"
] as const;

export function WelcomeMessage() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center max-w-2xl mx-auto">
      <div className="relative mb-6">
        <div className="w-20 h-20 bg-gradient-to-br from-primary via-primary/80 to-primary/60 rounded-3xl flex items-center justify-center shadow-lg">
          <Sparkles className="w-10 h-10 text-primary-foreground" />
        </div>
        <div className="absolute -inset-1 bg-gradient-to-br from-primary/20 to-transparent rounded-3xl blur-sm -z-10" />
      </div>

      <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
        Welcome to AudienceStream
      </h1>
      
      <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
        Your AI-powered campaign orchestrator. Create targeted campaigns, 
        analyze audiences, and optimize your marketing strategy with intelligent automation.
      </p>

      <Card className="w-full max-w-md">
        <CardContent className="p-4">
          <h3 className="font-semibold mb-3 text-sm uppercase tracking-wide text-muted-foreground">
            What I can help with
          </h3>
          <div className="flex flex-wrap gap-2">
            {WELCOME_FEATURES.map((feature) => (
              <Badge key={feature} variant="secondary" className="text-xs">
                {feature}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="mt-8 text-sm text-muted-foreground">
        💡 Try asking: "Create a weekend flash sale campaign for cart abandoners"
      </div>
    </div>
  );
}
