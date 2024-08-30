import Markdown from "react-markdown";

import ModelIcons from "../../common/model-icons";
import BouncingDotsLoader from "../../common/bouncing-loader";
import { usdAmount } from "@/src/lib/utils";
import { ChatMessageType } from "@/src/redux/reducers/playground/types";

interface ChatGeneralProps extends ChatMessageType {
  contentImageUrl?: string;
  children?: React.ReactNode;
  isProcessing: boolean;
}

function ChatGeneral({
  direction,
  textMessage,
  payment,
  type,
  model,
  children,
  isProcessing,
}: ChatGeneralProps) {
  if (direction === "right") {
    return (
      <div className="mb-4 flex justify-end">
        <div className="bg-black-100 mr-2 rounded-l-3xl rounded-tr-xl bg-slate-100 px-3  py-2">
          <article className="prose text-black-500 whitespace-pre-wrap">
            <Markdown>{textMessage}</Markdown>
          </article>
        </div>
      </div>
    );
  }

  return (
    <div className={`mb-4 flex justify-start`}>
      {type && <ModelIcons model={type} />}
      <div className="ml-2 w-full">
        <div className="bg-black-100 rounded-r-3xl rounded-tl-xl bg-slate-100 px-3 py-2 md:max-w-[calc(100%-80px)]">
          <article className="prose text-black-500 whitespace-pre-wrap">
            <Markdown>{textMessage}</Markdown>
            {isProcessing && (
              <div className="my-3 ml-[-21px]">
                <BouncingDotsLoader />
              </div>
            )}
          </article>
          {children && <div className="mt-1">{children}</div>}
        </div>
        {payment && (
          <div className="mt-1 flex flex-wrap items-center gap-x-2 text-sm text-black">
            <p className="flex items-center gap-1">
              Provider: <b>{type}</b>
            </p>
            <p className="flex items-center gap-1">
              Model
              <b>{model}</b>
            </p>
            <p className="flex items-center gap-1 text-green-500">
              Spent: <b>{usdAmount(payment?.value)}</b>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatGeneral;
