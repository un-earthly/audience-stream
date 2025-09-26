"use client";

import { Mail, MessageSquare, Phone, Megaphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { toggleChannel } from "@/lib/features/campaign/campaignSlice";

const channels = [
  { 
    id: "email", 
    name: "Email", 
    icon: Mail, 
    color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    description: "Email marketing campaigns"
  },
  { 
    id: "sms", 
    name: "SMS", 
    icon: MessageSquare, 
    color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    description: "Text message campaigns"
  },
  { 
    id: "whatsapp", 
    name: "WhatsApp", 
    icon: Phone, 
    color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    description: "WhatsApp messaging"
  },
  { 
    id: "ads", 
    name: "Ads", 
    icon: Megaphone, 
    color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    description: "Digital advertising"
  },
];

export function ChannelGrid() {
  const dispatch = useAppDispatch();
  const { selectedChannels } = useAppSelector((state) => state.campaign);

  return (
    <div className="grid grid-cols-2 gap-2">
      {channels.map((channel) => {
        const Icon = channel.icon;
        const isSelected = selectedChannels.includes(channel.id);
        
        return (
          <Button
            key={channel.id}
            variant={isSelected ? "default" : "outline"}
            onClick={() => dispatch(toggleChannel(channel.id))}
            className={`h-auto p-3 flex flex-col items-center gap-2 ${
              isSelected ? "" : "hover:bg-accent"
            }`}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              isSelected ? "bg-primary-foreground/20" : channel.color
            }`}>
              <Icon className="w-4 h-4" />
            </div>
            <div className="text-xs font-medium text-center">
              {channel.name}
            </div>
          </Button>
        );
      })}
    </div>
  );
}