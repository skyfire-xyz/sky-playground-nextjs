import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

import { APICallConfig, ModelTemplate } from "@/src/config/models";
import { RootState } from "../store";

interface PostChatProps {
  chatType: string;
  model: string;
  message?: string;
  apiCalls?: APICallConfig[];
  messages?: ModelTemplate["messages"];
  userInput?: string[];
}

async function callProxyAPI(props: PostChatProps) {
  const { chatType, model, message, messages } = props;

  let messagesWithData = messages || [
    {
      content: message || "",
      role: "user",
    },
  ];

  const res = await axios.post(`/api/proxy`, {
    chatType,
    model,
    messages: messagesWithData,
  });

  return {
    ...res.data,
    prompt: message,
    type: chatType,
  };
}

export const postChat = createAsyncThunk<any, PostChatProps>(
  "playground/postChat",
  callProxyAPI,
);

export const postWorkflow = createAsyncThunk<any, PostChatProps>(
  "playground/postWorkflow",
  callProxyAPI,
);

export const getWalletBalance = createAsyncThunk<any>(
  "playground/getWalletBalance",
  async () => {
    const res = await axios.get(`/api/balance`);
    return res.data;
  },
  {
    condition: (_, { getState }) => {
      const { wallet } = getState() as RootState;
      const fetchStatus = wallet.status;
      if (fetchStatus === "fulfilled" || fetchStatus === "pending") {
        return false;
      }
    },
  },
);

export const refetchBalance = createAsyncThunk<any>(
  "playground/getWalletBalance",
  async () => {
    const res = await axios.get(`/api/balance`);
    return res.data;
  },
);
