import { createSlice } from "@reduxjs/toolkit";
import { postChat, postWorkflow } from "../../actions/playground";

export interface UIEffectReduxState {
  shouldScrollToBottom: boolean;
  openMobileMenu: boolean;
}

const initialState: UIEffectReduxState = {
  shouldScrollToBottom: false,
  openMobileMenu: false,
};

export const uiEffectSlice = createSlice({
  name: "uiEffect",
  initialState,
  reducers: {
    setShouldScrollToBottom: (state, { payload }) => {
      state.shouldScrollToBottom = payload;
    },
    toggleMobileMenu: (state) => {
      state.openMobileMenu = !state.openMobileMenu;
    },
    closeMobileMenu: (state) => {
      state.openMobileMenu = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(postChat.pending, (state, action) => {
        state.shouldScrollToBottom = true;
      })
      .addCase(postChat.fulfilled, (state, action) => {
        state.shouldScrollToBottom = true;
      })
      .addCase(postWorkflow.pending, (state, action) => {
        state.shouldScrollToBottom = true;
      })
      .addCase(postWorkflow.fulfilled, (state, action) => {
        state.shouldScrollToBottom = true;
      })
      .addCase("chat/addMessage", (state, action) => {
        state.shouldScrollToBottom = true;
      });
  },
});

export const useShouldScrollToBottomSelector = (state: any) => {
  return state?.uiEffect.shouldScrollToBottom;
};
export const mobileMenuToggleSelector = (state: any) => {
  return state?.uiEffect.openMobileMenu;
};

export const { setShouldScrollToBottom, toggleMobileMenu } =
  uiEffectSlice.actions;

export default uiEffectSlice.reducer;
