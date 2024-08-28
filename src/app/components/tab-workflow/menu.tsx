import { AppDispatch } from "@/src/redux/store";
import { Button, Modal } from "flowbite-react";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { IoMdBook } from "react-icons/io";
import { MdDeleteSweep } from "react-icons/md";
import QuickTemplate from "./quick-template";
import {
  workflowStateSelector,
  resetChat,
} from "@/src/redux/reducers/playground/workflow-slice";
import useIsMobile from "@/src/lib/hooks/use-ismobile";

export default function WorkflowMenu() {
  const { status } = useSelector(workflowStateSelector);
  const [showTemplate, setShowTemplate] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const isMobile = useIsMobile();

  return (
    <div id="chat-menu" className="flex items-center gap-2">
      <Button
        size={isMobile ? "xs" : "md"}
        onClick={() => setShowTemplate(true)}
        className="flex items-center gap-1"
        disabled={status.requesting || status.processing}
      >
        <IoMdBook className="size-4" />
        {!isMobile && <span className="ml-2">Workflows</span>}
      </Button>
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
      <Modal
        size={isMobile ? "sm" : "md"}
        show={showTemplate}
        onClose={() => setShowTemplate(false)}
        dismissible
      >
        <Modal.Body>
          <QuickTemplate
            onExecute={() => {
              setShowTemplate(false);
            }}
          />
          <Button
            className="mt-4 w-full"
            onClick={() => setShowTemplate(false)}
          >
            Close
          </Button>
        </Modal.Body>
      </Modal>
    </div>
  );
}
