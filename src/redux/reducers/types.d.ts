export interface Wallet {
  name: string;
  address: string;
  transactions?: PaymentType[];
  network?: string;
  createdAt?: string;
  type?: string;
  balance?: {
    escrow: {
      total: number;
      available: number;
    };
    claims: {
      received: number;
      sent: number;
    };
    onchain: {
      total: number;
    };
  };
}

export interface User {
  id: string;
  username: string;
  email: string;
  walletType: "Sender" | "Receiver";
  walletAddress?: string;
  isEnterpriseAdmin?: boolean;
  isOnboarded: boolean;
  isActive: boolean;
  isAdmin: boolean;
  createdDate: string;
  updatedDate: string;
}

export interface Receiver {
  id: string;
  skyfireUser: User;
  cost: number;
  currency: string;
  createdDate: string;
  updatedDate: string;
}

export type WalletType = "Sender" | "Receiver";

export interface Claim {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: string;
  referenceId: string;
  sourceName?: string;
  destinationName?: string;
  sourceAddress: string;
  destinationAddress: string;
  value: string;
  currency: string;
  network: string;
}

export type ChatMessageType = {
  uuid?: string;
  type: "chat" | "dataset" | "tasklist" | "websearch" | "videosearch";
  direction?: "left" | "right";
  avatarUrl: string;
  textMessage: string;
  data?: any;
  contentImageUrl?: string;
};

export type Prompt = {
  userUuid: string;
  promptType: "chat" | "tasklist" | "dataset";
  logs: PaymentType[];
};

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

export enum TransactionType {
  Acquisition = "ACQUISITION",
  Adjustment = "ADJUSTMENT",
  Withdrawal = "WITHDRAWAL",
  Mint = "MINTS",
  Burn = "BURNS",
  Transfer = "TRANSFER",
  Payment = "PAYMENT",
}

export interface CommonTransaction {
  id: string;
  txId: string;
  txType: string;
  userId: string;
  type:
    | "CLAIM"
    | "PAYMENT"
    | "TRANSFER"
    | "MINTS"
    | "BURNS"
    | "WITHDRAWAL"
    | "ACQUISITION"
    | "ADJUSTMENT"
    | "PAYMENT_CLAIM"
    | "REDEMPTION";
  token?: {
    tokenId?: string;
    tokenAddress?: string;
    network?: string;
  };
  clientId?: string;
  txHash?: string | null;
  status: string;
  createdAt: string;
  redemption?: {
    sourceAddress: string;
    sourceName?: string;
    destinationAddress: string;
    destinationName?: string;
    summary: {
      fee: string;
      receiverTotal: string;
      value: string;
    };
    destinationName?: string;
  };
  redemptionId?: string;
  payment?: {
    sourceAddress?: string;
    destinationAddress?: string;
    value?: string;
    currency?: string;
    sourceName?: string;
    destinationName?: string;
  };
  paymentId?: string;
  claim?: {
    sourceAddress: string;
    sourceName?: string;
    destinationAddress: string;
    value: string;
    currency: string;
    destinationName?: string;
  };
  claimId?: string;
}

export interface BalanceV2 {
  address: string;
  network: string;
  onchain: {
    total: string;
  };
  escrow: {
    total: string;
    available: string;
    allowance: string;
  };
  claims: {
    sent: string;
    received: string;
  };
  native: {
    balance: string;
  };
}
export interface fetchStatusReduxState {
  [key: string]: {
    status: "idle" | "pending" | "fulfilled" | "rejected";
    data?: any;
  };
}

// admin-dashboard-slice
interface AdminDashboardReduxState {
  requestedBalance?: BalanceV2 | null;
  allowlist: string[];
  users: User[];
  fundingWallets?: BalanceV2 | [];
  fundingSSEStatus: {
    [key: string]: {
      status: "idle" | "pending" | "fulfilled" | "rejected";
    };
  };
}

// user-slice
export interface UserReduxState {
  user?: {
    email?: string;
    username?: string;
    id: string;
    isActive: boolean;
    isAdmin: boolean;
    isOnboarded: boolean;
    isOnboarding: boolean;
    updatedDate: string;
    createdDate: string;
    walletType: "Sender" | "Receiver";
    userType: "Sender" | "Receiver";
    mainWallet: {
      createdDate: string;
      id: string;
      updatedDate: string;
      userId: string;
      walletAddress: string;
      walletName: string;
      walletType: "Sender" | "Receiver";
    };
  };
  mainWalletBalance?: BalanceV2 | null;
}

// user-activity-slice
export interface UserActivityReduxState {
  transactions: CommonTransaction[] | null;
  claims: CommonTransaction[] | null;
  receivers: Receiver[];
}

// dashboard-slice
export interface DashboardReduxState {
  wallets: {
    Sender: Wallet[];
    Receiver: Wallet[];
  };
  receivers: Receiver[] | null;
}
