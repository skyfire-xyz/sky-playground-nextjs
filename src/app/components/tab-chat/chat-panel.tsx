import { useDispatch, useSelector } from "react-redux";

import { use, useEffect, useRef, useState } from "react";

import { Button, TextInput } from "flowbite-react";

import { postChat, postChatWithStream } from "@/src/redux/actions/playground";
import {
  addMessage,
  chatStateSelector,
} from "@/src/redux/reducers/playground/chat-slice";

import { IoMdSend } from "react-icons/io";
import ChatMenu from "./menu";
import ResponsePanel from "./response-panel";
import { AppDispatch } from "@/src/redux/store";
import useIsMobile from "@/src/lib/hooks/use-ismobile";
import useSpeechRecognition from "@/src/components/ui/speech-recognition/use-speech-recognition";
import RecordingIndicator from "@/src/components/ui/speech-recognition/recording-indicator";
import { RecordButton } from "@/src/components/ui/speech-recognition/record-button";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export default function ChatPane() {
  const speechRecognitionProps = useSpeechRecognition();
  const { text, isListening } = speechRecognitionProps;

  const isMobile = useIsMobile();
  const dispatch = useDispatch<AppDispatch>();
  const { selectedModel, status } = useSelector(chatStateSelector);

  const [inputText, setInputText] = useState("");
  const chatPaneRef = useRef<HTMLDivElement>(null);

  const processing = status.requesting || status.processing || isListening;

  useEffect(() => {
    if (isListening) {
    } else {
      setInputText(text);
      if (text) {
        setTimeout(() => {
          handleEnter({ key: "Enter" }, text);
        }, 500);
      }
    }
  }, [isListening, text]);

  // Process User Input
  const handleEnter = async (
    ev:
      | React.KeyboardEvent<HTMLInputElement>
      | { key: string; preventDefault?: () => void },
    speachText?: string,
  ) => {
    if (ev.key === "Enter") {
      const textMessage = speachText || inputText;
      dispatch(
        addMessage({
          type: "chat",
          direction: "right",
          textMessage,
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
        postChatWithStream({
          chatType: selectedModel.proxyType,
          message: textMessage,
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
            {isListening && <RecordingIndicator />}
            <div
              data-testid="right-icon"
              className="absolute inset-y-0 right-0 z-40 flex items-center gap-3 pr-3"
            >
              <IoMdSend
                className={`cursor-pointer ${processing ? "opacity-30" : ""}`}
                onClick={() => {
                  if (processing) return;
                  handleEnter({ key: "Enter" });
                }}
              />
              <RecordButton
                {...speechRecognitionProps}
                disabled={status.requesting || status.processing}
              />
            </div>
            <TextInput
              className="w-full rounded-xl bg-[#f7f9fa]"
              value={inputText}
              disabled={processing}
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
