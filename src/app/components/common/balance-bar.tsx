import classnames from "classnames";
import { chatStateSelector } from "@/src/redux/reducers/playground/chat-slice";

import { Spinner } from "flowbite-react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/src/redux/store";
import { escrowAvailableSelector } from "@/src/redux/reducers/playground/wallet";
import { getWalletBalance } from "@/src/redux/actions/playground";
import { workflowStateSelector } from "@/src/redux/reducers/playground/workflow-slice";
import { usdAmount } from "@/src/lib/utils";

export default function BalanceBar({ className }: { className?: string }) {
  const dispatch = useDispatch<AppDispatch>();
  const chatState = useSelector(chatStateSelector);
  const workflowState = useSelector(workflowStateSelector);
  const escrowAvailable = useSelector(escrowAvailableSelector);

  const [isLoadingBalance, setIsLoadingBalance] = useState(true);
  const [lastBalance, setLastBalance] = useState<number | undefined>(
    escrowAvailable,
  );
  const [balanceChange, setBalanceChange] = useState<number>(0);

  useEffect(() => {
    dispatch(getWalletBalance());
  }, []);

  useEffect(() => {
    const messages = [...workflowState.messages, ...chatState.messages];
    if (messages.length === 0) {
      setBalanceChange(0);
      return;
    }
    setIsLoadingBalance(true);
    const interval = setTimeout(() => {
      dispatch(getWalletBalance()).then(() => {
        setIsLoadingBalance(false);
      });
    }, 1500);
    return () => {
      clearTimeout(interval);
      setIsLoadingBalance(false);
    };
  }, [chatState.messages, workflowState.messages]);

  useEffect(() => {
    if (escrowAvailable !== undefined) {
      setIsLoadingBalance(false);
      if (lastBalance !== undefined) {
        setBalanceChange(lastBalance - escrowAvailable);
      }
      setLastBalance(escrowAvailable);
    }
  }, [escrowAvailable]);

  if (escrowAvailable < 0) return;
  return (
    <div
      id="balance-bar"
      className={classnames(
        "mb-1 mr-4 flex size-full flex-row items-start	justify-items-start gap-x-1 text-wrap py-3 text-base",
        className,
      )}
    >
      <div>
        Balance:{" "}
        {isLoadingBalance && <Spinner size="xs" className="mb-[1px]" />}{" "}
      </div>
      {escrowAvailable && <div>{usdAmount(escrowAvailable)}</div>}
      {balanceChange > 0 && (
        <div className="ml-2 text-green-500">
          Spent: <b>{usdAmount(balanceChange)}</b>
        </div>
      )}
    </div>
  );
}
