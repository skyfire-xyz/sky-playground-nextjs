"use client";

import { combineReducers, configureStore } from "@reduxjs/toolkit";
import chatSlice from "./reducers/playground/chat-slice";
import uiEffectSlice from "./reducers/playground/ui-effect-slice";
import workflowSlice from "./reducers/playground/workflow-slice";

export const store = configureStore({
  reducer: combineReducers({
    chat: chatSlice,
    workflow: workflowSlice,
    uiEffect: uiEffectSlice,
  }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
