import { chatStateSelector } from "@/src/redux/reducers/playground/chat-slice";
import {
  setShouldScrollToBottom,
  useShouldScrollToBottomSelector,
} from "@/src/redux/reducers/playground/ui-effect-slice";
import { scrollToBottom } from "@/src/redux/utils/ui";
import { AppDispatch } from "@/src/redux/store";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ChatMessageType } from "../common/types";
import ChatError from "../common/chat-messages/chat-error";
import ChatGeneral from "../common/chat-messages/chat-general";
import ModelIcons from "../common/model-icons";
import BouncingDotsLoader from "../common/bouncing-loader";

import useIsMobile from "@/src/lib/hooks/use-ismobile";
import usePlaygroundContentHeight from "@/src/lib/hooks/use-playground-content-height";

interface ResponsePanelProps {
  children?: React.ReactNode;
}

export default function ResponsePanel({ children }: ResponsePanelProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { messages, status } = useSelector(chatStateSelector);
  const shouldScrollToBottom = useSelector(useShouldScrollToBottomSelector);

  const chatPaneRef = useRef<HTMLDivElement>(null);
  const chatPaneInnerRef = useRef<HTMLDivElement>(null);
  const mainContentHeight = usePlaygroundContentHeight();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (shouldScrollToBottom) {
      scrollToBottom([chatPaneInnerRef], () => {
        dispatch(setShouldScrollToBottom(false));
      });
    }
  }, [shouldScrollToBottom]);

  return (
    <div id="chat-pane" className="flex-1 flex-col md:flex" ref={chatPaneRef}>
      <div
        ref={chatPaneInnerRef}
        className="overflow-y-scroll"
        style={{
          height: mainContentHeight + "px",
        }}
      >
        {messages &&
          messages.map((message: ChatMessageType, index: number) => {
            if (message.type === "error") {
              return (
                <ChatError
                  key={index}
                  direction={message.direction}
                  textMessage={message.textMessage}
                />
              );
            }
            return (
              <ChatGeneral
                isProcessing={
                  index === messages.length - 1 && status.processing
                }
                key={index}
                {...message}
              />
            );
          })}

        {children && children}
        {status.requesting && (
          <div className={`mb-4 flex items-center`}>
            <ModelIcons model="skyfire" />
            <BouncingDotsLoader />
          </div>
        )}
      </div>
    </div>
  );
}
