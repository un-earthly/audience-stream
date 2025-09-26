import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface DataSource {
  id: string;
  name: string;
  type: "shopify" | "analytics" | "facebook" | "email" | "sms";
  status: "connected" | "pending" | "disconnected" | "error";
  lastSync?: number;
  icon: string;
}

interface ConnectionsState {
  dataSources: DataSource[];
  isConnecting: boolean;
}

const initialState: ConnectionsState = {
  dataSources: [
    {
      id: "shopify",
      name: "Shopify Store",
      type: "shopify",
      status: "disconnected",
      icon: "🛍️",
    },
    {
      id: "analytics",
      name: "Website Analytics",
      type: "analytics",
      status: "disconnected",
      icon: "📊",
    },
    {
      id: "facebook",
      name: "Facebook Pixel",
      type: "facebook",
      status: "disconnected",
      icon: "📘",
    },
    {
      id: "email",
      name: "Email Platform",
      type: "email",
      status: "disconnected",
      icon: "📧",
    },
    {
      id: "sms",
      name: "SMS Gateway",
      type: "sms",
      status: "disconnected",
      icon: "💬",
    },
  ],
  isConnecting: false,
};

export const connectionsSlice = createSlice({
  name: "connections",
  initialState,
  reducers: {
    updateConnectionStatus: (
      state,
      action: PayloadAction<{
        id: string;
        status: DataSource["status"];
        lastSync?: number;
      }>,
    ) => {
      const source = state.dataSources.find(
        (ds) => ds.id === action.payload.id,
      );
      if (source) {
        source.status = action.payload.status;
        if (action.payload.lastSync) {
          source.lastSync = action.payload.lastSync;
        }
      }
    },
    setConnecting: (state, action: PayloadAction<boolean>) => {
      state.isConnecting = action.payload;
    },
  },
});

export const { updateConnectionStatus, setConnecting } =
  connectionsSlice.actions;
export default connectionsSlice.reducer;
