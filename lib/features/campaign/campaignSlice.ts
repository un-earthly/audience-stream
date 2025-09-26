import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Campaign, AudienceSegment } from "@/lib/types";
import { storage, PERSIST_KEYS } from "@/lib/utils/storage";

interface CampaignState {
  selectedChannels: string[];
  audienceSegments: AudienceSegment[];
  currentCampaign: Campaign | null;
  campaigns: Campaign[];
  isGenerating: boolean;
}

const persisted = storage.get<Partial<CampaignState>>(PERSIST_KEYS.campaign, {
  selectedChannels: [],
  currentCampaign: null,
  campaigns: [],
});

const initialState: CampaignState = {
  selectedChannels: persisted.selectedChannels ?? [],
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
  currentCampaign: persisted.currentCampaign ?? null,
  campaigns: persisted.campaigns ?? [],
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
      storage.set(PERSIST_KEYS.campaign, {
        selectedChannels: state.selectedChannels,
        currentCampaign: state.currentCampaign,
        campaigns: state.campaigns,
      });
    },
    setSelectedChannels: (state, action: PayloadAction<string[]>) => {
      state.selectedChannels = action.payload;
      storage.set(PERSIST_KEYS.campaign, {
        selectedChannels: state.selectedChannels,
        currentCampaign: state.currentCampaign,
        campaigns: state.campaigns,
      });
    },
    setCurrentCampaign: (state, action: PayloadAction<Campaign | null>) => {
      state.currentCampaign = action.payload;
      storage.set(PERSIST_KEYS.campaign, {
        selectedChannels: state.selectedChannels,
        currentCampaign: state.currentCampaign,
        campaigns: state.campaigns,
      });
    },
    addCampaign: (state, action: PayloadAction<Campaign>) => {
      state.campaigns.push(action.payload);
      storage.set(PERSIST_KEYS.campaign, {
        selectedChannels: state.selectedChannels,
        currentCampaign: state.currentCampaign,
        campaigns: state.campaigns,
      });
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
