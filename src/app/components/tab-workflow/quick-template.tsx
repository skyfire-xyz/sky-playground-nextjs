import { availableTemplates, ModelTemplate } from "@/src/config/models";
import {
  postWorkflow,
  postWorkflowWithStream,
} from "@/src/redux/actions/playground";
import { Button, Card, Modal, TextInput } from "flowbite-react";
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import {
  addMessage,
  workflowStateSelector,
} from "@/src/redux/reducers/playground/workflow-slice";
import { AppDispatch } from "@/src/redux/store";
import useIsMobile from "@/src/lib/hooks/use-ismobile";
import usePlaygroundContentHeight from "@/src/lib/hooks/use-playground-content-height";

interface QuickTemplateProps {
  onExecute?: () => void;
}

export default function QuickTemplate({ onExecute }: QuickTemplateProps) {
  const dispatch = useDispatch<AppDispatch>();
  const isMobile = useIsMobile();
  const [modelInputTemplate, setModelInputTemplate] = useState<
    ModelTemplate | undefined
  >();
  const { status } = useSelector(workflowStateSelector);
  const templateInputRef = useRef<HTMLInputElement>(null);
  const [templateTextInputs, setTemplateTextInputs] = useState<string[]>([]);
  const mainContentHeight = usePlaygroundContentHeight();

  const handleInputChange = (index: number, value: string) => {
    const newTemplateTextInputs = [...templateTextInputs];
    newTemplateTextInputs[index] = value;
    setTemplateTextInputs(newTemplateTextInputs);
  };

  const executeTemplate = (template: ModelTemplate) => {
    if (onExecute) onExecute();

    dispatch(
      addMessage({
        type: "chat",
        direction: "right",
        textMessage: `Workflow: ${template.title}`,
      }),
    );

    const userInput = templateTextInputs.map((input, index) => {
      if (input && input.trim() !== "") {
        return input;
      } else {
        return template.inputModal?.userInputs[index].defaultValue || "";
      }
    });

    // dispatch(
    //   postWorkflow({
    //     chatType: "openrouter",
    //     message: template.prompt,
    //     model: template.model,
    //     apiCalls: template.apiCalls,
    //     messages: template.messages,
    //     userInput,
    //   }),
    // );

    dispatch(
      postWorkflowWithStream({
        chatType: "openrouter",
        message: template.prompt,
        model: template.model,
        apiCalls: template.apiCalls,
        messages: template.messages,
        userInput,
      }),
    );
  };

  const onModalSubmit = () => {
    if (modelInputTemplate) {
      executeTemplate(modelInputTemplate);
    }
    setModelInputTemplate(undefined);
  };

  return (
    <div
      className={`${isMobile ? "mr-0" : "max-w-[380px]"} mr-3 h-full overflow-y-auto`}
      style={{
        height: mainContentHeight + "px",
      }}
    >
      <div>
        {availableTemplates.map((template, index) => (
          <Card
            key={index}
            className="mt-1 p-3 md:p-3"
            href="#"
            onClick={() => {
              if (!status.processing && !status.requesting) {
                if (template.inputModal) {
                  setModelInputTemplate(template);
                  setTemplateTextInputs(
                    template.inputModal.userInputs.map(() => ""),
                  );
                  return;
                }
                executeTemplate(template);
              }
            }}
          >
            <h4 className="mb-2 text-base font-bold">{template.title}</h4>
            {template.description && (
              <p className="text-sm">
                <b>Description</b>: {template.description}
              </p>
            )}

            {template.services && (
              <p className="text-sm">
                <b>Services</b>: {template.services}
              </p>
            )}

            {!template.description && !template.services && (
              <>
                <p className="text-sm">
                  <b>Model</b>: {template.model}
                </p>
                <p className="text-sm">
                  <b>Prompt</b>: &quot;{template.prompt}&quot;
                </p>
              </>
            )}
          </Card>
        ))}
      </div>
      <Modal
        size={isMobile ? "sm" : "lg"}
        show={!!modelInputTemplate}
        onClose={() => setModelInputTemplate(undefined)}
        initialFocus={templateInputRef}
        dismissible
      >
        <Modal.Header>{modelInputTemplate?.inputModal?.title}</Modal.Header>
        <Modal.Body>
          <h3 className="pb-2">
            {modelInputTemplate?.inputModal?.userInputs.map((input, index) => (
              <div key={index} className="mb-4">
                <h4 className="mb-1 text-base">{input.instruction}</h4>
                <TextInput
                  onKeyDown={(e) => {
                    if (
                      e.key === "Enter" &&
                      modelInputTemplate?.inputModal?.userInputs.length !==
                        undefined &&
                      index ===
                        modelInputTemplate?.inputModal?.userInputs.length - 1
                    ) {
                      onModalSubmit();
                    }
                  }}
                  type="text"
                  id={`input-${index}`}
                  placeholder={input.placeholder}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  ref={index === 0 ? templateInputRef : undefined}
                />
              </div>
            ))}
          </h3>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={onModalSubmit}>Submit</Button>
          <Button color="gray" onClick={() => setModelInputTemplate(undefined)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
