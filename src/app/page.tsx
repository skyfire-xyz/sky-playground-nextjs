"use client";

import ChatPanel from "./components/tab-chat/chat-panel";
import { store } from "@/src/redux/store";
import { Provider as ReduxProvider } from "react-redux";
import WorkflowPane from "./components/tab-workflow/workflow-panel";

import { useState } from "react";
import { GoWorkflow } from "react-icons/go";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import useIsMobile from "../lib/hooks/use-ismobile";
import BalanceBar from "./components/common/balance-bar";

export default function Page() {
  const [tab, setTab] = useState<"workflow" | "chat">("workflow");
  const isMobile = useIsMobile();

  const activeClass = `h-full flex items-center inline-block px-3 text-black rounded-t-lg active`;
  const nonActiveClass = `h-full flex items-center inline-block px-3 rounded-lt-lg hover:text-black-500 hover:bg-gray-50`;

  return (
    <div className="flex h-full flex-col p-10">
      <div id="playground-menu" className="flex items-stretch">
        <ul className="ml-3 flex w-full justify-between text-center text-sm font-medium text-gray-500 dark:text-gray-400 md:ml-0">
          <li className="me-2">
            <a
              href="#"
              onClick={() => setTab("workflow")}
              className={tab === "workflow" ? activeClass : nonActiveClass}
            >
              <GoWorkflow className="mr-1 size-[16px]" />
              {!isMobile && "Workflows"}
            </a>
          </li>
          <li className="me-2">
            <a
              href="#"
              onClick={() => setTab("chat")}
              className={tab === "chat" ? activeClass : nonActiveClass}
              aria-current="page"
            >
              <IoChatboxEllipsesOutline className="mr-1 size-[16px]" />
              {!isMobile && "Chat"}
            </a>
          </li>
          <li className="ml-auto">
            <BalanceBar />
          </li>
        </ul>
      </div>
      <div
        className={`flex-1 ${tab === "workflow" ? "rounded-lg rounded-l-none" : "rounded-lg"} p-3 md:p-4`}
      >
        {tab === "workflow" && <WorkflowPane />}
        {tab === "chat" && <ChatPanel />}
      </div>
    </div>
  );
}
