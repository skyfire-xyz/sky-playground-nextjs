import Select from "react-select";
import { availableModels } from "@/src/config/models";
import {
  chatStateSelector,
  resetChat,
  setModel,
} from "@/src/redux/reducers/playground/chat-slice";
import { AppDispatch } from "@/src/redux/store";
import { Button, Label } from "flowbite-react";
import { useDispatch, useSelector } from "react-redux";
import { MdDeleteSweep } from "react-icons/md";
import useIsMobile from "@/src/lib/hooks/use-ismobile";

export default function ChatMenu() {
  const { selectedModel, status } = useSelector(chatStateSelector);
  const dispatch = useDispatch<AppDispatch>();

  const isMobile = useIsMobile();

  return (
    <>
      <div className="flex w-full items-center justify-between gap-2">
        {!isMobile && <Label className="">Models</Label>}
        <Select
          className={"flex-1"}
          isDisabled={status.requesting || status.processing}
          value={{
            value: selectedModel.model,
            label: selectedModel.model,
            proxy: selectedModel.proxyType,
          }}
          options={availableModels.map((model) => ({
            value: model.model,
            label: model.model,
            proxy: model.proxyType,
          }))}
          isClearable={true}
          onChange={(e) => {
            dispatch(
              setModel({
                model: e?.label,
                proxyType: e?.proxy,
              }),
            );
          }}
          menuPlacement={isMobile ? "top" : "bottom"}
        ></Select>
        <Button
          disabled={status.requesting || status.processing}
          onClick={() => {
            dispatch(resetChat());
          }}
          className="flex items-center gap-1"
          size={isMobile ? "xs" : "md"}
        >
          <MdDeleteSweep className="size-4" />
          {!isMobile && <span className="ml-2">Clear Chat</span>}
        </Button>
      </div>
    </>
  );
}
