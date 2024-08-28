// ChatSlice
export interface Task {
  id: number;
  skill: string;
  status: "complete" | "pending" | "error";
  result: any;
  dependent_task_ids: number[];
  parentId: number;
  referenceId: number;
  objective: string;
  isDependentTasksComplete?: boolean;
}

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

export type ChatMessageType = {
  uuid?: string;
  type:
    | "chat"
    | "error"
    | "dataset_search"
    | "tasklist"
    | "web_search"
    | "video_search"
    | "text_completion"
    | "image_generation"
    | "meme"
    | "random_joke"
    | "dataset_download";
  direction?: "left" | "right";
  textMessage: string;
  data?: any;
  contentImageUrl?: string;
  payment?: {
    amount: string | number;
    referenceId: string;
  };
  model?: string;
  inProgress?: boolean;
};

// ProtocolLogs
export type PaymentType = {
  userUuid: string;
  status: "SUCCESS" | "DENIED";
  network: string;
  currency: string;
  destinationAddress: string;
  destinationName: string;
  generatedDate: string;
  sourceAddress: string;
  sourceName: string;
  amount: string;
  message: string;
};

export interface ProtocolLogsReduxState {
  logs: PaymentType[];
}

// ProtocolLogs
export type PaymentType = {
  userUuid: string;
  status: "SUCCESS" | "DENIED";
  network: string;
  currency: string;
  destinationAddress: string;
  destinationName: string;
  generatedDate: string;
  sourceAddress: string;
  sourceName: string;
  amount: string;
  message: string;
};

export interface ProtocolLogsReduxState {
  logs: PaymentType[];
}
