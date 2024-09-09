import { GetThunkAPI, createAsyncThunk } from "@reduxjs/toolkit";
import { EventSourceParserStream } from "eventsource-parser/stream";
import axios from "axios";

import { APICallConfig, ModelTemplate } from "@/src/config/models";
import { RootState } from "../store";
import { createAsyncThunkWithReject } from "../utils/async-thunk-withreject";
import { chatActions } from "@/src/redux/reducers/playground/chat-slice";
import { workflowActions } from "@/src/redux/reducers/playground/workflow-slice";
import { cloneDeep, get } from "lodash";
import { setShouldScrollToBottom } from "../reducers/playground/ui-effect-slice";

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

export const postChatWithStream = createAsyncThunk<any, PostChatProps>(
  "playground/postChatWithStream",
  callProxyAPIWithStream("chat"),
);

export const postWorkflowWithStream = createAsyncThunk<any, PostChatProps>(
  "playground/postWorkflowWithStream",
  callProxyAPIWithStream("workflow"),
);

export const getWalletBalance = createAsyncThunk<any>(
  "playground/getWalletBalance",
  async () => {
    const res = await axios.post(`/api/sdk-proxy`, {
      apiPath: "account.wallet.getWalletBalanceForUser",
    });
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
    const res = await axios.post(`/api/sdk-proxy`, {
      apiPath: "account.wallet.getWalletBalanceForUser",
    });
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

  const res = await axios.post(`/api/non-stream-chat`, {
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

function callProxyAPIWithStream(playgroundType: "workflow" | "chat") {
  return async function (props: PostChatProps, { dispatch }: GetThunkAPI<any>) {
    const sseHandlers = new Promise(async (resolve, reject) => {
      const actions =
        playgroundType === "workflow" ? workflowActions : chatActions;
      const { addMessage, incrementMessage, setBotStatus } = actions;
      const { chatType, model } = props;

      let messagesWithData;
      try {
        messagesWithData = await makeMessagesWithData(props);
      } catch (err: unknown) {
        if (err instanceof Error) {
          if (err.message.includes("402")) {
            return reject(
              "It looks like your balance is too low to complete this prompt.",
            );
          } else if (
            err.message.includes("404") ||
            err.message.includes("400")
          ) {
            return reject(
              "It seems we couldn't find any results for your input. Please try again with different input.",
            );
          }
          return reject(
            "Something went wrong while processing the messages. Please try again.",
          );
        }
        return {
          type: chatType,
          message: "Error in processing messages",
        };
      }

      // Initiate the first call to connect to SSE API
      const apiResponse = await fetch(`/api/stream-chat`, {
        method: "POST",
        headers: {
          "Content-Type": "text/event-stream",
        },
        body: JSON.stringify({
          model,
          chatType,
          messages: messagesWithData,
        }),
      });

      if (!apiResponse.ok) {
        if (apiResponse.status === 402) {
          return reject(
            "It looks like your balance is too low to complete this prompt.",
          );
        } else if (apiResponse.status === 404 || apiResponse.status === 400) {
          return reject(
            "It seems we couldn't find any results for your input. Please try again with different input.",
          );
        }
        return reject(
          "Something went wrong while processing the messages. Please try again.",
        );
      }

      if (!apiResponse.body) return;

      dispatch(
        setBotStatus({
          requesting: true,
        }),
      );

      // To decode incoming data as a string
      const reader = apiResponse.body
        .pipeThrough(new TextDecoderStream())
        .pipeThrough(new EventSourceParserStream())
        .getReader();

      dispatch(
        addMessage({
          type: chatType,
          model: model,
          direction: "left",
          textMessage: "",
        }),
      );
      dispatch(
        setBotStatus({
          requesting: false,
          processing: true,
        }),
      );

      // Handle incoming stream data
      while (true) {
        const test = await reader.read();
        const { value, done } = test;

        if (done) {
          break;
        }
        if (value) {
          if (value.data && value.data === "[DONE]") {
            break;
          } else if (value.data && value.data !== "[DONE]") {
            try {
              const data = JSON.parse(value.data);
              dispatch(
                incrementMessage({
                  type: chatType,
                  direction: "left",
                  textMessage: data.choices[0].delta.content,
                }),
              );
              dispatch(setShouldScrollToBottom(true));
            } catch (err) {}
          }
        }
      }

      // Request payments
      const referenceId = apiResponse.headers.get(
        "skyfire-payment-reference-id",
      );
      const payment = await getClaimByReferenceID(referenceId);

      resolve({
        payment,
      });
    });
    return sseHandlers;
  };
}

async function getClaimByReferenceID(referenceId: string | null) {
  if (referenceId) {
    try {
      const res = await axios.post(`/api/sdk-proxy`, {
        apiPath: "account.wallet.getClaimByReferenceId",
        payload: referenceId,
      });

      return {
        amount: res.data.value + " UDSC" || "N/A",
        referenceId: res.data?.referenceId || "",
      };
    } catch {
      return false;
    }
  }
  return false;
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
