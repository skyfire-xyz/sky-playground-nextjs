import {
  setShouldScrollToBottom,
  useShouldScrollToBottomSelector,
} from "@/src/redux/reducers/playground/ui-effect-slice";
import { scrollToBottom } from "@/src/redux/utils/ui";
import { AppDispatch } from "@/src/redux/store";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import ChatError from "../common/chat-messages/chat-error";
import ChatGeneral from "../common/chat-messages/chat-general";
import ModelIcons from "../common/model-icons";
import BouncingDotsLoader from "../common/bouncing-loader";

import { workflowStateSelector } from "@/src/redux/reducers/playground/workflow-slice";
import usePlaygroundContentHeight from "@/src/lib/hooks/use-playground-content-height";
import { ChatMessageType } from "@/src/redux/reducers/playground/types";

interface ResponsePanelProps {
  children?: React.ReactNode;
}

export default function ResponsePanel({ children }: ResponsePanelProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { messages, status } = useSelector(workflowStateSelector);
  const shouldScrollToBottom = useSelector(useShouldScrollToBottomSelector);

  // const isMobile = useIsMobile();
  const chatPaneRef = useRef<HTMLDivElement>(null);
  const chatPaneInnerRef = useRef<HTMLDivElement>(null);
  const mainContentHeight = usePlaygroundContentHeight();

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
                  type={message.type}
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
