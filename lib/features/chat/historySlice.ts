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

// Normalize legacy history so the new renderer can hydrate fully
const normalizeHistory = (state: HistoryState): HistoryState => {
  const next: HistoryState = {
    conversations: state.conversations.map((c) => {
      const upgradedMessages = c.messages.map((m) => {
        // Always ensure streaming=false on hydration
        const out: ChatMessage = { ...m, streaming: false } as ChatMessage;
        const jd: any = out.jsonData;
        if (out.type === 'assistant') {
          // If campaign exists but no blocks/uiComponent, synthesize minimal blocks and ui component
          const hasCampaign = jd && typeof jd === 'object' && jd.campaign;
          const hasBlocks = jd && Array.isArray(jd.blocks);
          const hasUi = jd && jd.uiComponent;
          if (hasCampaign && !hasBlocks) {
            const blocks = [
              { kind: 'para', content: out.content || '' },
              { kind: 'artifact_indicator', title: 'Campaign Configuration', description: 'Generated campaign configuration' },
            ];
            out.jsonData = {
              ...jd,
              blocks,
              uiComponent: hasUi ? jd.uiComponent : { type: 'campaign_configurator', data: { campaign: jd.campaign } },
            };
          }
        }
        return out;
      });
      return { ...c, messages: upgradedMessages };
    }),
    activeConversationId: state.activeConversationId,
  };
  // Persist normalized format back to storage
  storage.set(PERSIST_KEYS.chat_history, next);
  return next;
};

const persist = (state: HistoryState) => {
  storage.set(PERSIST_KEYS.chat_history, state);
};

const initialState: HistoryState = normalizeHistory(persisted);

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
    updateMessageInConversation(state, action: PayloadAction<{ conversationId: string; messageId: string; patch: Partial<ChatMessage> }>) {
      const c = state.conversations.find(c => c.id === action.payload.conversationId);
      if (c) {
        const m = c.messages.find(m => m.id === action.payload.messageId);
        if (m) {
          Object.assign(m, action.payload.patch);
          persist(state);
        }
      }
    },
    deleteConversation(state, action: PayloadAction<string>) {
      const index = state.conversations.findIndex(c => c.id === action.payload);
      if (index !== -1) {
        state.conversations.splice(index, 1);
        if (state.activeConversationId === action.payload) {
          state.activeConversationId = state.conversations.length > 0 ? state.conversations[0].id : null;
        }
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
  updateMessageInConversation,
  deleteConversation,
  clearHistory,
} = historySlice.actions;

export default historySlice.reducer;
