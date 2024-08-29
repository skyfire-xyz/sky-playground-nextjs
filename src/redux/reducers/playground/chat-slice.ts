import { availableModels } from "@/src/config/models";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { postChat } from "../../actions/playground";
import { ChatMessageType, ChatSliceReduxState } from "./types";

const initialState: ChatSliceReduxState = {
  messages: [],
  status: {
    requesting: false,
    processing: false,
  },
  selectedModel: availableModels[0],
};

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    addInitialMessage: (state, { payload }) => {
      if (state.messages.length === 0) {
        state.messages.push({
          type: "chat",
          direction: payload.direction,
          textMessage: payload.textMessage,
        });
      }
    },
    incrementMessage: (state, { payload }) => {
      let originalMessage =
        state.messages[state.messages.length - 1].textMessage;
      originalMessage += payload.textMessage;
      state.messages[state.messages.length - 1].textMessage = originalMessage;
    },
    addMessage: (state, { payload }) => {
      state.messages.push({
        type: payload.type || "chat",
        direction: payload.direction,
        textMessage: payload.textMessage,
        data: payload.data,
        model: payload.model,
      });
    },
    setModel: (state, { payload }) => {
      state.selectedModel = payload;
    },
    setBotStatus: (state, { payload }) => {
      state.status = { ...state.status, ...payload };
    },
    resetChat: (state) => {
      state.messages = [];
    },
  },
  extraReducers: (builder) => {
    builder

      /**
       * PostChat
       */
      .addCase(postChat.pending, processPending)
      .addCase(postChat.fulfilled, (state, action) => {
        let data;
        let textMessages;

        if (action.payload.data?.choices) {
          textMessages = action.payload.data?.choices;
        } else if (action.payload.message.includes("Invalid API Key")) {
          toast.error(
            "The API Key you entered is invalid. Please try different one.",
          );
          return;
        }

        if (textMessages) {
          state.messages.push({
            uuid: action.payload.uuid,
            type: action.payload.type as ChatMessageType["type"],
            model: action.meta.arg.model,
            data: data,
            textMessage: textMessages[0].message.content,
            payment: action.payload.data.payment,
          });
        }

        processFulfilled(state, action);
      })
      .addCase(postChat.rejected, processError);
  },
});

export const chatStateSelector = (state: any) => {
  return state?.chat;
};

function processPending(state: ChatSliceReduxState) {
  state.status.requesting = true;
}
function processError(state: ChatSliceReduxState, action: any) {
  state.status.requesting = false;
  if (action.error?.message?.includes("401")) {
    state.messages.push({
      type: "error",
      textMessage:
        "Looks like your request is missing an API key. Please configure environment variables.",
    });
  } else {
    state.messages.push({
      type: "error",
      textMessage:
        "Sorry, something went wrong when interacting with the AI. Please try again.",
    });
  }
}
function processFulfilled(state: ChatSliceReduxState, action: PayloadAction) {
  state.status.requesting = false;
}

export const {
  addInitialMessage,
  addMessage,
  setBotStatus,
  resetChat,
  incrementMessage,
  setModel,
} = chatSlice.actions;

export const chatActions = chatSlice.actions;

export default chatSlice.reducer;
