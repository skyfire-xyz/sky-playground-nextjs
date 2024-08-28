import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

import { APICallConfig, ModelTemplate } from "@/src/config/models";

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

  // Request payments
  // TODO: Handle to get payment information.
  // const referenceId = res.data.headers["skyfire-payment-reference-id"];
  // const payment = await getClaimByReferenceID(referenceId);

  return {
    ...res.data,
    // payment,
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
