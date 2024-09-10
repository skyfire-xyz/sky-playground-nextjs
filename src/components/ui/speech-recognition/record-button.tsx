import { FaCircleStop } from "react-icons/fa6";
import { FaMicrophone } from "react-icons/fa";
import { SpeechRecognitionProps } from "./use-speech-recognition";

interface RecordButtonProps extends SpeechRecognitionProps {
  disabled?: boolean;
}
export function RecordButton(props: RecordButtonProps) {
  const {
    isListening,
    startListening,
    stopListening,
    disabled,
    hasRecognitionSupport,
  } = props;

  if (!hasRecognitionSupport) return null;

  return (
    <div>
      {isListening ? (
        <FaCircleStop className="cursor-pointer" onClick={stopListening} />
      ) : (
        <FaMicrophone
          className={`cursor-pointer ${disabled ? "opacity-30" : ""}`}
          onClick={() => {
            if (!disabled) startListening();
          }}
        />
      )}
    </div>
  );
}
