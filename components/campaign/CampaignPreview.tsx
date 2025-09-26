"use client";

import { Calendar, Users, MessageSquare, Target, Download } from "lucide-react";
import { useAppSelector } from "../../lib/hooks";
import { Button } from "@/components/ui/button";

export function CampaignPreview() {
  const { currentCampaign } = useAppSelector((state) => state.campaign);

  if (!currentCampaign) {
    return (
      <div className="p-6 bg-white rounded-lg border border-gray-200 text-center">
        <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No Campaign Selected
        </h3>
        <p className="text-gray-500">
          Start a conversation to generate your first campaign.
        </p>
      </div>
    );
  }

  const handleExport = () => {
    const campaignJson = {
      campaign: {
        name: currentCampaign.name,
        audience: currentCampaign.audience,
        channels: currentCampaign.channels,
        message: currentCampaign.message,
        timing: currentCampaign.timing,
        meta: currentCampaign.meta,
      },
    };

    const blob = new Blob([JSON.stringify(campaignJson, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${currentCampaign.name.toLowerCase().replace(/\s+/g, "-")}-campaign.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 bg-white rounded-lg border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Campaign Preview
        </h3>
        <Button
          type="button"
          onClick={handleExport}
          variant="outline"
          size="icon"
          title="Download campaign JSON"
          aria-label="Download campaign JSON"
        >
          <Download className="w-4 h-4" />
        </Button>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="text-xl font-bold text-gray-900 mb-2">
            {currentCampaign.name}
          </h4>
          <div
            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              currentCampaign.meta?.priority === "high"
                ? "bg-red-100 text-red-800"
                : currentCampaign.meta?.priority === "medium"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-green-100 text-green-800"
            }`}
          >
            {currentCampaign.meta?.priority?.toUpperCase() || 'MEDIUM'} PRIORITY
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <Users className="w-5 h-5 text-blue-600" />
            <div>
              <div className="text-sm font-medium text-gray-900">
                Target Audience
              </div>
              <div className="text-xs text-gray-600">
                {currentCampaign.audience}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <Target className="w-5 h-5 text-green-600" />
            <div>
              <div className="text-sm font-medium text-gray-900">
                Estimated Reach
              </div>
              <div className="text-xs text-gray-600">
                {currentCampaign.meta?.estimated_reach?.toLocaleString() || 'N/A'} users
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <MessageSquare className="w-5 h-5 text-purple-600" />
            <div>
              <div className="text-sm font-medium text-gray-900">Channels</div>
              <div className="text-xs text-gray-600">
                {currentCampaign.channels.join(", ")}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <Calendar className="w-5 h-5 text-orange-600" />
            <div>
              <div className="text-sm font-medium text-gray-900">
                Launch Time
              </div>
              <div className="text-xs text-gray-600">
                {new Date(currentCampaign.timing).toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="text-sm font-medium text-gray-900 mb-2">Message</div>
          <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
            <p className="text-sm text-gray-800">{currentCampaign.message}</p>
          </div>
        </div>

        <div className="text-xs text-gray-500 pt-2 border-t border-gray-200">
          Experiment ID: {currentCampaign.meta?.experiment_id || 'N/A'} • Campaign ID:{" "}
          {currentCampaign.id}
        </div>
      </div>
    </div>
  );
}
