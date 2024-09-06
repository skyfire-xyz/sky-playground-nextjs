import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

import { APICallConfig, ModelTemplate } from "@/src/config/models";
import { RootState } from "../store";
import { createAsyncThunkWithReject } from "../utils/async-thunk-withreject";
import { cloneDeep, get } from "lodash";

interface PostChatProps {
  chatType: string;
  model: string;
  message?: string;
  apiCalls?: APICallConfig[];
  messages?: ModelTemplate["messages"];
  userInput?: string[];
}

export const postChat = createAsyncThunkWithReject<any, PostChatProps>(
  "playground/postChat",
  callProxyAPI,
);

export const postWorkflow = createAsyncThunkWithReject<any, PostChatProps>(
  "playground/postWorkflow",
  callProxyAPI,
);

export const getWalletBalance = createAsyncThunk<any>(
  "playground/getWalletBalance",
  async () => {
    const res = await axios.get(`/api/balance`);

    // TODO: Attempt to use SDK proxy
    // const res = await axios.post(`/api/sdk-proxy`, {
    //   apiPath: "account.wallet.getWalletBalanceForUser",
    //   payload: undefined,
    // });

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

export const refetchBalance = createAsyncThunkWithReject<any>(
  "playground/getWalletBalance",
  async () => {
    const res = await axios.get(`/api/balance`);
    return res.data;
  },
);

async function callProxyAPI(props: PostChatProps) {
  const { chatType, model, message, messages } = props;

  let messagesWithData;
  try {
    messagesWithData = await makeMessagesWithData(props);
  } catch (err) {
    return {
      type: "chatType",
      message: "Error in processing messages",
    };
  }

  const res = await axios.post(`/api/chat`, {
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

async function makeMessagesWithData({
  apiCalls,
  messages,
  message,
  userInput,
}: PostChatProps) {
  const apiData: { key: string; value: any }[] = [];
  let apiIndex = 0;

  // make api calls before the chat
  const calls = apiCalls ? cloneDeep(apiCalls) : [];
  if (calls.length > 0) {
    for (const config of calls) {
      const data = await axios.post("/api/callapi", {
        config,
        apiData,
        userInput,
      });
      apiData.push({
        key: `api_${apiIndex}`,
        value: data,
      });
      apiIndex += 1;
    }
  }

  const allMessages = [
    ...(cloneDeep(messages) || [
      {
        content: message || "",
        role: "user",
      },
    ]),
  ];

  return allMessages.map((oneMsg) => {
    for (const data of apiData) {
      const regex = new RegExp(`{{${data.key}}}`, "g");
      oneMsg.content = oneMsg.content.replace(
        regex,
        JSON.stringify(data.value),
      );
    }
    // replace user_input
    if (userInput) {
      for (let index = 0; index < userInput.length; index++) {
        const value = userInput[index];
        const regex = new RegExp(`{{user_input_${index}}}`, "g");
        oneMsg.content = oneMsg.content.replace(regex, value);
      }
    }
    return oneMsg;
  });
}
