import useElementHeightExcludingContents from "@/src/lib/hooks/use-element-height";
import { useRef } from "react";

interface ScrollablePaneProps {
  children?: React.ReactNode;
}

export default function ScrollablePane({ children }: ScrollablePaneProps) {
  const chatPaneRef = useRef<HTMLDivElement>(null);
  const chatPaneInnerRef = useRef<HTMLDivElement>(null);
  const chatPaneHeight = useElementHeightExcludingContents(chatPaneRef);

  return (
    <div
      id="chat-pane"
      className="flex-1 flex-col md:mt-4 md:flex md:px-5"
      ref={chatPaneRef}
    >
      <div
        className="overflow-scroll"
        style={{
          maxHeight: chatPaneHeight.emptyHeight
            ? `${chatPaneHeight.emptyHeight}px`
            : "inherit",
        }}
        ref={chatPaneInnerRef}
      >
        {children}
      </div>
    </div>
  );
}
