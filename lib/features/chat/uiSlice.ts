import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { storage, PERSIST_KEYS } from "@/lib/utils/storage";

export type AttachmentKind = 'image' | 'file';
export interface AttachmentItem {
  file: File;
  url?: string;
  kind: AttachmentKind;
}

export interface PreviewState {
  open: boolean;
  mode: 'text' | 'image';
  name: string;
  text?: string;
  imageUrl?: string;
  index: number | null;
}

export interface ChatUiState {
  deepthink: boolean;
  webSearch: boolean;
  showHints: boolean;
  attachments: AttachmentItem[];
  preview: PreviewState;
}

const persisted = storage.get<Partial<ChatUiState>>(PERSIST_KEYS.chat_ui, {} as any);

const initialState: ChatUiState = {
  deepthink: persisted.deepthink ?? false,
  webSearch: persisted.webSearch ?? false,
  showHints: persisted.showHints ?? true,
  attachments: [],
  preview: {
    open: false,
    mode: 'text',
    name: 'pasted-text.txt',
    text: '',
    imageUrl: undefined,
    index: null,
  },
};

const persist = (state: ChatUiState) => {
  storage.set(PERSIST_KEYS.chat_ui, {
    deepthink: state.deepthink,
    webSearch: state.webSearch,
    showHints: state.showHints,
  });
};

export const chatUiSlice = createSlice({
  name: 'chatUi',
  initialState,
  reducers: {
    toggleDeepthink(state) {
      state.deepthink = !state.deepthink;
      persist(state);
    },
    toggleWebSearch(state) {
      state.webSearch = !state.webSearch;
      persist(state);
    },
    toggleHints(state) {
      state.showHints = !state.showHints;
      persist(state);
    },
    addAttachments(state, action: PayloadAction<AttachmentItem[]>) {
      state.attachments.push(...action.payload);
    },
    removeAttachment(state, action: PayloadAction<number>) {
      state.attachments.splice(action.payload, 1);
    },
    clearAttachments(state) {
      state.attachments = [];
    },
    openPreview(state, action: PayloadAction<PreviewState>) {
      state.preview = { ...action.payload, open: true };
    },
    closePreview(state) {
      state.preview.open = false;
      state.preview.index = null;
    },
    renameAttachment(state, action: PayloadAction<{ index: number; newFile: File }>) {
      const { index, newFile } = action.payload;
      if (state.attachments[index]) {
        state.attachments[index].file = newFile;
      }
    },
  }
});

export const {
  toggleDeepthink,
  toggleWebSearch,
  toggleHints,
  addAttachments,
  removeAttachment,
  clearAttachments,
  openPreview,
  closePreview,
  renameAttachment,
} = chatUiSlice.actions;

export default chatUiSlice.reducer;
