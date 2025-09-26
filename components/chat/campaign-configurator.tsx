"use client";

import { FileJson, Settings, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAppDispatch } from "@/lib/hooks";
import { openJsonPanel } from "@/lib/features/chat/uiSlice";

interface CampaignConfiguratorProps {
  jsonData: unknown;
  title?: string;
  description?: string;
}

export function CampaignConfigurator({ 
  jsonData, 
  title = "Campaign Configuration Ready",
  description = "I've generated a comprehensive campaign strategy based on your requirements. Click below to view the live configuration details."
}: CampaignConfiguratorProps) {
  const dispatch = useAppDispatch();

  return (
    <Card className="my-4 border-primary/20 bg-primary/5">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
          </div>
          
          <div className="flex-1 space-y-3">
            <div>
              <h3 className="font-semibold text-base mb-1">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {description}
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                <Settings className="w-3 h-3 mr-1" />
                Live Configuration
              </Badge>
              <Badge variant="outline" className="text-xs">
                Real-time Updates
              </Badge>
            </div>
            
            <Button 
              onClick={() => dispatch(openJsonPanel(jsonData))}
              className="w-full sm:w-auto"
              size="sm"
            >
              <FileJson className="w-4 h-4 mr-2" />
              View Live Configuration
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
