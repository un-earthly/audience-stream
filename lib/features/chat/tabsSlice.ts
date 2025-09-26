import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SourceLink, TabsData } from "@/lib/types";

export interface TabsStateRecord {
  [messageId: string]: TabsData | undefined;
}

const initialState: TabsStateRecord = {};

export const tabsSlice = createSlice({
  name: "tabs",
  initialState,
  reducers: {
    setTabs: (
      state,
      action: PayloadAction<{ messageId: string; data: TabsData }>
    ) => {
      state[action.payload.messageId] = action.payload.data;
    },
    setAnswer: (
      state,
      action: PayloadAction<{ messageId: string; answer: string }>
    ) => {
      const existing = state[action.payload.messageId] ?? {};
      state[action.payload.messageId] = { ...existing, answer: action.payload.answer };
    },
    appendImages: (
      state,
      action: PayloadAction<{ messageId: string; images: string[] }>
    ) => {
      const existing = state[action.payload.messageId] ?? {};
      const current = existing.images ?? [];
      state[action.payload.messageId] = { ...existing, images: [...current, ...action.payload.images] };
    },
    appendSources: (
      state,
      action: PayloadAction<{ messageId: string; sources: SourceLink[] }>
    ) => {
      const existing = state[action.payload.messageId] ?? {};
      const current = existing.sources ?? [];
      state[action.payload.messageId] = { ...existing, sources: [...current, ...action.payload.sources] };
    },
    clearTabs: (state, action: PayloadAction<{ messageId: string }>) => {
      delete state[action.payload.messageId];
    },
  },
});

export const { setTabs, setAnswer, appendImages, appendSources, clearTabs } = tabsSlice.actions;
export default tabsSlice.reducer;
