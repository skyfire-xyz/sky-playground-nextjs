import Markdown from "react-markdown";
import ModelIcons from "../../common/model-icons";

interface ChatGeneralProps {
  direction: "left" | "right";
  textMessage?: string;
  contentImageUrl?: string;
  children?: React.ReactNode;
}

function ChatError({ textMessage }: ChatGeneralProps) {
  return (
    <div className={`mb-4 flex justify-start`}>
      <ModelIcons model={"skyfire"} />
      <div className="bg-black-100 ml-2 max-w-[calc(100%-80px)] rounded-br-3xl rounded-tl-xl rounded-tr-3xl px-3 py-2">
        <article className="prose text-black-500 whitespace-pre-wrap">
          <Markdown>{textMessage}</Markdown>
        </article>
      </div>
    </div>
  );
}

export default ChatError;
