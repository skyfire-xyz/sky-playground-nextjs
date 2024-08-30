import type { Claim } from "@skyfire-xyz/skyfire-sdk";

export type ChatMessageType = {
  type: "chat" | "error";
  textMessage: string;
  direction?: "left" | "right" | undefined;
  model?: string;
  payment?: Claim | null;
};

export interface WorkflowSliceReduxState {
  messages: ChatMessageType[];
  status: {
    requesting: boolean;
    processing?: boolean;
  };
}

export interface ChatSliceReduxState {
  messages: ChatMessageType[];
  status: {
    requesting: boolean;
    processing?: boolean;
  };
  selectedModel: Model;
}
