"use client";

import { useState } from "react";
import { 
  Plug, 
  Users, 
  Target, 
  ChevronRight,
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ConnectionModal } from "@/components/connections/connection-modal";
import { ChannelGrid } from "@/components/channels/channel-grid";
import { useAppSelector } from "@/lib/hooks";
import { DataSource } from "@/lib/types";
import Link from "next/link";

export function DashboardSidebar() {
  const [activeSection, setActiveSection] = useState<string | null>("connections");
  const [selectedDataSource, setSelectedDataSource] = useState<DataSource | null>(null);
  const [showConnectionModal, setShowConnectionModal] = useState(false);
  
  const { dataSources } = useAppSelector((state) => state.connections);
  const { selectedChannels, audienceSegments } = useAppSelector((state) => state.campaign);
  const { currentCampaign } = useAppSelector((state) => state.campaign);

  const connectedSources = dataSources.filter(ds => ds.status === "connected");

  const handleConnectSource = (source: DataSource) => {
    setSelectedDataSource(source);
    setShowConnectionModal(true);
  };

  const sidebarSections = [
    {
      id: "connections",
      title: "Data Sources",
      icon: Plug,
      badge: `${connectedSources.length}/${dataSources.length}`,
    },
    {
      id: "audience",
      title: "Audience",
      icon: Users,
      badge: audienceSegments.length.toString(),
    },
    {
      id: "channels",
      title: "Channels",
      icon: Target,
      badge: selectedChannels.length.toString(),
    },
    // Analytics section removed per request
  ];

  return (
    <>
      <div className="w-80 bg-muted/30 border-r h-full overflow-y-auto">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div>
            <h2 className="text-lg font-semibold mb-2">Campaign Builder</h2>
            <p className="text-sm text-muted-foreground">
              Configure your marketing campaign
            </p>
          </div>

          {/* Metrics quick link */}
          <div>
            <Button asChild variant="outline" className="w-full">
              <Link href="/dashboard/metrics">View Metrics</Link>
            </Button>
          </div>

          {/* Navigation */}
          <div className="space-y-2">
            {sidebarSections.map((section) => {
              const Icon = section.icon;
              const isActive = activeSection === section.id;
              
              return (
                <Button
                  key={section.id}
                  variant="ghost"
                  onClick={() => setActiveSection(isActive ? null : section.id)}
                  className={`w-full justify-between p-3 h-auto text-left transition-all ${
                    isActive 
                      ? "bg-primary/10 text-primary border border-primary/20" 
                      : "hover:bg-accent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{section.title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {section.badge}
                    </Badge>
                    <ChevronRight 
                      className={`w-4 h-4 transition-transform ${
                        isActive ? "rotate-90" : ""
                      }`} 
                    />
                  </div>
                </Button>
              );
            })}
          </div>

          <Separator />
          {/* Section Content */}
          {activeSection === "connections" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Data Sources</h3>
                <Button size="sm" variant="outline">
                  <Plus className="w-3 h-3 mr-1" />
                  Add
                </Button>
              </div>
              
              {dataSources.map((source) => (
                <Card 
                  key={source.id} 
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    source.status === "connected" 
                      ? "border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/20" 
                      : ""
                  }`}
                  onClick={() => source.status === "disconnected" && handleConnectSource(source)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="text-lg">{source.icon}</div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">
                          {source.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {source.status === "connected" ? "Connected" : "Not connected"}
                        </div>
                      </div>
                      <div className={`w-2 h-2 rounded-full ${
                        source.status === "connected" 
                          ? "bg-green-500" 
                          : "bg-gray-300"
                      }`} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {activeSection === "audience" && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Audience Segments</h3>
              {audienceSegments.map((segment) => (
                <Card key={segment.id} className="cursor-pointer hover:shadow-md transition-all">
                  <CardContent className="p-4">
                    <div className="text-sm font-medium mb-1">{segment.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {segment.estimatedSize.toLocaleString()} users
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {activeSection === "channels" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Marketing Channels</h3>
                <Button size="sm" variant="outline">
                  <Plus className="w-3 h-3 mr-1" />
                  Configure
                </Button>
              </div>
              
              <ChannelGrid />
            </div>
          )}

          {/* Current Campaign */}
          {currentCampaign && (
            <>
              <Separator />
              <Card className="bg-primary/5 border-primary/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Active Campaign</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm font-medium mb-1">
                    {currentCampaign.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Reach: {currentCampaign.meta?.estimated_reach?.toLocaleString() || 'N/A'}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>

      <ConnectionModal
        open={showConnectionModal}
        onOpenChange={setShowConnectionModal}
        dataSource={selectedDataSource}
      />
    </>
  );
}