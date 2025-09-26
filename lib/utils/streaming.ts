import { AppDispatch } from "../store";
import { updateMessage, stopStreaming } from "../features/chat/chatSlice";
import {
  setCurrentCampaign,
  addCampaign,
} from "../features/campaign/campaignSlice";

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
  {
    name: "Loyalty Rewards Campaign",
    audience: "Repeat customers",
    channels: ["Email", "SMS"],
    message: "Thank you for your loyalty! Enjoy exclusive member benefits.",
    timing: "2025-10-15T14:00:00Z",
    meta: {
      priority: "low" as const,
      experiment_id: "exp_125",
      estimated_reach: 850,
    },
  },
];

export async function simulateStreamingResponse(
  userInput: string,
  messageId: string,
  dispatch: AppDispatch,
) {
  const template =
    campaignTemplates[Math.floor(Math.random() * campaignTemplates.length)];

  // Generate campaign based on user input
  const campaign = {
    id: `campaign_${Date.now()}`,
    ...template,
    name: extractCampaignName(userInput) || template.name,
  };

  const responses = [
    "I'll help you create a targeted campaign. Let me analyze your requirements...",
    "\nBased on your input, I'm generating a multi-channel campaign strategy.",
    "\nIdentifying the optimal audience segment and channels...",
    "\nCreating personalized messaging for maximum engagement...",
    "\nFinalizing campaign timing and automation settings...",
    "\nHere's your campaign configuration:",
  ];

  let fullContent = "";

  // Stream text responses
  for (const response of responses) {
    for (let i = 0; i <= response.length; i++) {
      fullContent = fullContent + response.slice(i - 1, i);
      dispatch(
        updateMessage({
          id: messageId,
          content: fullContent,
        }),
      );
      await new Promise((resolve) => setTimeout(resolve, 30));
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  // Stream JSON generation
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const jsonKeys = [
    "campaign",
    "name",
    "audience",
    "channels",
    "message",
    "timing",
    "meta",
  ];
  let partialJson: any = {};

  for (const key of jsonKeys) {
    if (key === "campaign") {
      partialJson = { campaign: {} };
    } else if (key === "meta") {
      partialJson.campaign.meta = campaign.meta;
    } else {
      partialJson.campaign[key] = campaign[key as keyof typeof campaign];
    }

    dispatch(
      updateMessage({
        id: messageId,
        jsonData: JSON.parse(JSON.stringify(partialJson)),
      }),
    );

    await new Promise((resolve) => setTimeout(resolve, 300));
  }

  // Store campaign in Redux
  dispatch(setCurrentCampaign(campaign));
  dispatch(addCampaign(campaign));

  // Stop streaming
  dispatch(
    updateMessage({
      id: messageId,
      streaming: false,
    }),
  );
  dispatch(stopStreaming());
}

function extractCampaignName(input: string): string | null {
  const lowerInput = input.toLowerCase();

  if (lowerInput.includes("flash sale") || lowerInput.includes("sale")) {
    return "Flash Sale Campaign";
  }
  if (
    lowerInput.includes("holiday") ||
    lowerInput.includes("christmas") ||
    lowerInput.includes("winter")
  ) {
    return "Holiday Campaign";
  }
  if (lowerInput.includes("loyalty") || lowerInput.includes("reward")) {
    return "Loyalty Rewards Campaign";
  }
  if (lowerInput.includes("welcome") || lowerInput.includes("onboard")) {
    return "Welcome Series Campaign";
  }
  if (lowerInput.includes("abandon") || lowerInput.includes("cart")) {
    return "Cart Recovery Campaign";
  }

  return null;
}
