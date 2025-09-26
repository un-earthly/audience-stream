import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { storage, PERSIST_KEYS } from "@/lib/utils/storage";
import { ChatMessage } from "@/lib/types";

export interface Conversation {
  id: string;
  title: string;
  createdAt: number;
  messages: ChatMessage[];
}

export interface HistoryState {
  conversations: Conversation[];
  activeConversationId: string | null;
}

const persisted = storage.get<HistoryState>(PERSIST_KEYS.chat_history, {
  conversations: [],
  activeConversationId: null,
});

const persist = (state: HistoryState) => {
  storage.set(PERSIST_KEYS.chat_history, state);
};

const initialState: HistoryState = {
  conversations: persisted.conversations,
  activeConversationId: persisted.activeConversationId,
};

export const historySlice = createSlice({
  name: "history",
  initialState,
  reducers: {
    createConversation(state, action: PayloadAction<{ id: string; title: string }>) {
      state.conversations.unshift({
        id: action.payload.id,
        title: action.payload.title,
        createdAt: Date.now(),
        messages: [],
      });
      state.activeConversationId = action.payload.id;
      persist(state);
    },
    setActiveConversation(state, action: PayloadAction<string>) {
      state.activeConversationId = action.payload;
      persist(state);
    },
    renameConversation(state, action: PayloadAction<{ id: string; title: string }>) {
      const c = state.conversations.find(c => c.id === action.payload.id);
      if (c) c.title = action.payload.title;
      persist(state);
    },
    addMessageToConversation(state, action: PayloadAction<{ conversationId: string; message: ChatMessage }>) {
      const c = state.conversations.find(c => c.id === action.payload.conversationId);
      if (c) {
        c.messages.push(action.payload.message);
        persist(state);
      }
    },
    clearHistory(state) {
      state.conversations = [];
      state.activeConversationId = null;
      persist(state);
    },
  },
});

export const {
  createConversation,
  setActiveConversation,
  renameConversation,
  addMessageToConversation,
  clearHistory,
} = historySlice.actions;

export default historySlice.reducer;
