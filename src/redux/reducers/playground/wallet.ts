import { createSlice } from "@reduxjs/toolkit";
import { getWalletBalance } from "../../actions/playground";
import type { WalletBalance } from "@skyfire-xyz/skyfire-sdk";
import { RootState } from "../../store";

interface WalletState {
  status: "idle" | "pending" | "fulfilled" | "rejected";
  balance: WalletBalance | null;
}

const initialState: WalletState = {
  balance: null,
  status: "idle",
};

export const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getWalletBalance.fulfilled, (state, action) => {
      state.balance = action.payload;
      state.status = "fulfilled";
    });
    builder.addCase(getWalletBalance.pending, (state, action) => {
      state.status = "pending";
    });
    builder.addCase(getWalletBalance.rejected, (state, action) => {
      state.status = "rejected";
    });
  },
});

export const walletSelector = (state: RootState) => {
  return state?.wallet;
};
export const walletBalanceSelector = (state: RootState) => {
  return state?.wallet.balance;
};

export const escrowAvailableSelector = (state: RootState) => {
  const escrowAbvaialble = state?.wallet.balance?.escrow?.available;
  return escrowAbvaialble ? Number(escrowAbvaialble) : -1;
};

export default walletSlice.reducer;
