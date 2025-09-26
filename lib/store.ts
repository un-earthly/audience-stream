import { configureStore } from "@reduxjs/toolkit";
import chatReducer from "./features/chat/chatSlice";
import stepReducer from "./features/chat/stepSlice";
import connectionsReducer from "./features/connections/connectionsSlice";
import campaignReducer from "./features/campaign/campaignSlice";
import authReducer from "./features/auth/authSlice";
import tabsReducer from "./features/chat/tabsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    chat: chatReducer,
    steps: stepReducer,
    connections: connectionsReducer,
    campaign: campaignReducer,
    tabs: tabsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
