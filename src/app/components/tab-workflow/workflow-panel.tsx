import QuickTemplate from "./quick-template";
import ResponsePanel from "./response-panel";
import WorkflowMenu from "./menu";
import { useSelector } from "react-redux";
import { workflowStateSelector } from "@/src/redux/reducers/playground/workflow-slice";
import useIsMobile from "@/src/lib/hooks/use-ismobile";

export default function WorkflowPane() {
  const isMobile = useIsMobile();
  const { messages } = useSelector(workflowStateSelector);
  const displayTemplate =
    !isMobile || (isMobile && messages && messages.length === 0);

  return (
    <div className="flex size-full flex-col ">
      <div className="flex h-full items-start">
        {displayTemplate && <QuickTemplate />}
        <ResponsePanel />
      </div>
      {isMobile && (
        <div className={"w-full flex-none"}>
          <div className="pt-3 md:p-3">
            <div className="mb-2">
              <WorkflowMenu />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
