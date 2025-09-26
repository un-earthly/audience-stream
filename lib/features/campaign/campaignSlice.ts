import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AudienceSegment {
  id: string;
  name: string;
  filters: {
    geography?: string[];
    pastPurchases?: string[];
    websiteVisits?: string[];
    demographics?: string[];
  };
  estimatedSize: number;
}

export interface Campaign {
  id: string;
  name: string;
  audience: string;
  channels: string[];
  message: string;
  timing: string;
  meta: {
    priority: "low" | "medium" | "high";
    experiment_id: string;
    estimated_reach: number;
  };
}

interface CampaignState {
  selectedChannels: string[];
  audienceSegments: AudienceSegment[];
  currentCampaign: Campaign | null;
  campaigns: Campaign[];
  isGenerating: boolean;
}

const initialState: CampaignState = {
  selectedChannels: [],
  audienceSegments: [
    {
      id: "cart-abandoners",
      name: "Cart Abandoners (7 days)",
      filters: {
        websiteVisits: ["cart_page"],
        pastPurchases: ["none_recent"],
      },
      estimatedSize: 1200,
    },
    {
      id: "repeat-customers",
      name: "Repeat Customers",
      filters: {
        pastPurchases: ["multiple"],
      },
      estimatedSize: 850,
    },
    {
      id: "high-value",
      name: "High-Value Prospects",
      filters: {
        demographics: ["high_income"],
        websiteVisits: ["product_pages"],
      },
      estimatedSize: 450,
    },
  ],
  currentCampaign: null,
  campaigns: [],
  isGenerating: false,
};

export const campaignSlice = createSlice({
  name: "campaign",
  initialState,
  reducers: {
    toggleChannel: (state, action: PayloadAction<string>) => {
      const channel = action.payload;
      if (state.selectedChannels.includes(channel)) {
        state.selectedChannels = state.selectedChannels.filter(
          (c) => c !== channel,
        );
      } else {
        state.selectedChannels.push(channel);
      }
    },
    setSelectedChannels: (state, action: PayloadAction<string[]>) => {
      state.selectedChannels = action.payload;
    },
    setCurrentCampaign: (state, action: PayloadAction<Campaign | null>) => {
      state.currentCampaign = action.payload;
    },
    addCampaign: (state, action: PayloadAction<Campaign>) => {
      state.campaigns.push(action.payload);
    },
    setGenerating: (state, action: PayloadAction<boolean>) => {
      state.isGenerating = action.payload;
    },
    addAudienceSegment: (state, action: PayloadAction<AudienceSegment>) => {
      state.audienceSegments.push(action.payload);
    },
  },
});

export const {
  toggleChannel,
  setSelectedChannels,
  setCurrentCampaign,
  addCampaign,
  setGenerating,
  addAudienceSegment,
} = campaignSlice.actions;
export default campaignSlice.reducer;
