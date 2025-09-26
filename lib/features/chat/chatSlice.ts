import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ChatMessage } from "@/lib/types";

interface ChatState {
  messages: ChatMessage[];
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
      action: PayloadAction<
        Pick<ChatMessage, "type" | "content"> &
          Partial<Pick<ChatMessage, "id" | "timestamp" | "streaming" | "jsonData">>
      >,
    ) => {
      const now = Date.now();
      const message: ChatMessage = {
        id: action.payload.id ?? now.toString(),
        timestamp: action.payload.timestamp ?? now,
        type: action.payload.type,
        content: action.payload.content,
        streaming: action.payload.streaming,
        jsonData: action.payload.jsonData,
      };
      state.messages.push(message);
    },
    updateMessage: (
      state,
      action: PayloadAction<{
        id: string;
        content?: string;
        jsonData?: unknown;
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
