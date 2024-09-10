import { useState, useEffect } from "react";

export interface SpeechRecognitionProps {
  text: string;
  isListening: boolean;
  startListening: () => void;
  stopListening: () => void;
  hasRecognitionSupport: boolean;
}

const useSpeechRecognition = (): SpeechRecognitionProps => {
  const [text, setText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [hasRecognitionSupport, setHasRecognitionSupport] = useState(false);

  const [speechRecognition, setSpeechRecognition] =
    useState<SpeechRecognition | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        setHasRecognitionSupport(true);
        const recognition = new SpeechRecognition();
        recognition.continuous = false; // Change this to false
        recognition.interimResults = false; // Add this line
        recognition.lang = "en-US";
        setSpeechRecognition(recognition);
      }
    }
  }, []);

  useEffect(() => {
    if (!speechRecognition) return;

    speechRecognition.onresult = (event: SpeechRecognitionEvent) => {
      // console.log("Speech recognition event:", event);
      const transcript = event.results[0][0].transcript;
      setText(transcript);
    };

    speechRecognition.onspeechend = () => {
      // console.log("Speech has stopped being detected");
      stopListening();
    };

    speechRecognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      // console.error("Speech recognition error", event.error);
      stopListening();
    };
  }, [speechRecognition]);

  const startListening = () => {
    setText("");
    setIsListening(true);
    speechRecognition?.start();
  };

  const stopListening = () => {
    setIsListening(false);
    speechRecognition?.stop();
  };

  return {
    text,
    isListening,
    startListening,
    stopListening,
    hasRecognitionSupport,
  };
};

export default useSpeechRecognition;
