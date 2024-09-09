import { availableModels } from "@/src/config/models";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { postChat, postChatWithStream } from "../../actions/playground";
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
            type: action.payload.type as ChatMessageType["type"],
            model: action.meta.arg.model,
            textMessage: textMessages[0].message.content,
            payment: action.payload.data.payment,
          });
        }

        processFulfilled(state, action);
      })
      .addCase(postChat.rejected, processError)
      .addCase(postChatWithStream.pending, processPending)
      .addCase(postChatWithStream.fulfilled, (state, action) => {
        state.status.processing = false;

        if (state.messages[state.messages.length - 1]) {
          state.messages[state.messages.length - 1].payment =
            action.payload.payment;
        }
      })
      .addCase(postChatWithStream.rejected, (state, action) => {
        state.messages.push({
          type: "error",
          textMessage:
            action.error.message ||
            "Sorry, something went wrong when interacting with the AI. Please try again.",
        });
        state.status = {
          requesting: false,
          processing: false,
        };
      });
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
  // Handle error messages
  if (action.payload.data.message === "Insufficient Minimum Balance") {
    state.messages.push({
      type: "error",
      textMessage:
        "Looks like you don't have enough balance to complete this transaction. Please top up your account.",
    });
  } else if (action.payload.data.message === "Invalid API Key") {
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
