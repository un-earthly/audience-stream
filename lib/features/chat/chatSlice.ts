import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Message {
  id: string;
  type: "user" | "assistant" | "system";
  content: string;
  timestamp: number;
  streaming?: boolean;
  jsonData?: any;
}

interface ChatState {
  messages: Message[];
  isStreaming: boolean;
  currentStreamingId: string | null;
}

const initialState: ChatState = {
  messages: [
    {
      id: "1",
      type: "system",
      content:
        "Welcome to AudienceStream! I'll help you create targeted campaigns across multiple channels. What kind of campaign would you like to build?",
      timestamp: Date.now(),
    },
  ],
  isStreaming: false,
  currentStreamingId: null,
};

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    addMessage: (
      state,
      action: PayloadAction<Omit<Message, "id" | "timestamp">>,
    ) => {
      const message: Message = {
        ...action.payload,
        id: Date.now().toString(),
        timestamp: Date.now(),
      };
      state.messages.push(message);
    },
    updateMessage: (
      state,
      action: PayloadAction<{
        id: string;
        content?: string;
        jsonData?: any;
        streaming?: boolean;
      }>,
    ) => {
      const message = state.messages.find((m) => m.id === action.payload.id);
      if (message) {
        if (action.payload.content !== undefined)
          message.content = action.payload.content;
        if (action.payload.jsonData !== undefined)
          message.jsonData = action.payload.jsonData;
        if (action.payload.streaming !== undefined)
          message.streaming = action.payload.streaming;
      }
    },
    startStreaming: (state, action: PayloadAction<string>) => {
      state.isStreaming = true;
      state.currentStreamingId = action.payload;
    },
    stopStreaming: (state) => {
      state.isStreaming = false;
      state.currentStreamingId = null;
    },
    clearChat: (state) => {
      state.messages = [initialState.messages[0]];
      state.isStreaming = false;
      state.currentStreamingId = null;
    },
  },
});

export const {
  addMessage,
  updateMessage,
  startStreaming,
  stopStreaming,
  clearChat,
} = chatSlice.actions;
export default chatSlice.reducer;
