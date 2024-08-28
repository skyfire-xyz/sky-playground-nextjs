import { useDispatch, useSelector } from "react-redux";

import { useRef, useState } from "react";

import { Button, TextInput } from "flowbite-react";

import { postChat } from "@/src/redux/actions/playground";
import {
  addMessage,
  chatStateSelector,
} from "@/src/redux/reducers/playground/chat-slice";

import { IoMdSend } from "react-icons/io";
import ChatMenu from "./menu";
import ResponsePanel from "./response-panel";
import { AppDispatch } from "@/src/redux/store";
import useIsMobile from "@/src/lib/hooks/use-ismobile";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export default function ChatPane() {
  const isMobile = useIsMobile();
  const dispatch = useDispatch<AppDispatch>();
  const { selectedModel, status } = useSelector(chatStateSelector);

  const [inputText, setInputText] = useState("");
  const chatPaneRef = useRef<HTMLDivElement>(null);

  // Process User Input
  const handleEnter = async (
    ev:
      | React.KeyboardEvent<HTMLInputElement>
      | { key: string; preventDefault?: () => void },
  ) => {
    if (ev.key === "Enter") {
      dispatch(
        addMessage({
          type: "chat",
          direction: "right",
          textMessage: inputText,
        }),
      );

      setTimeout(() => {
        chatPaneRef.current?.scrollTo({ top: 99999, behavior: "smooth" });
      }, 100);

      setInputText("");

      // Wait for a little bit to simulate bot thinking
      await sleep(300);

      ///////////////////////////////////////////////////////////
      // Regular Chat Request
      ///////////////////////////////////////////////////////////
      dispatch(
        postChat({
          chatType: selectedModel.proxyType,
          message: inputText,
          model: selectedModel.model,
        }),
      );
      if (ev.preventDefault) ev.preventDefault();
    }
  };

  return (
    <div className="flex size-full flex-col items-stretch justify-between ">
      {!isMobile && (
        <div
          id="chat-menu"
          className="border-black-300 mb-4 mr-4 flex flex-none gap-4 border-b pb-4"
        >
          <ChatMenu />
        </div>
      )}
      <div>
        <ResponsePanel />
      </div>
      <div id="chat-input" className={"w-full flex-none"}>
        <div className="pt-3">
          {isMobile && (
            <div className="mb-2">
              <ChatMenu />
            </div>
          )}
          <div className="relative w-full">
            <div
              data-testid="right-icon"
              className="absolute inset-y-0 right-0 z-40 flex items-center pr-3"
            >
              <Button
                size="sm"
                disabled={status.requesting || status.processing}
                onClick={() => {
                  handleEnter({ key: "Enter" });
                }}
              >
                <IoMdSend />
              </Button>
            </div>
            <TextInput
              className="w-full rounded-xl bg-[#f7f9fa]"
              value={inputText}
              disabled={status.requesting || status.processing}
              onChange={(ev) => {
                setInputText(ev?.target?.value);
              }}
              onKeyDown={handleEnter}
            ></TextInput>
          </div>
        </div>
      </div>
    </div>
  );
}
