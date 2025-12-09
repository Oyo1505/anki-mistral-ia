import { FormDataSchemaType } from "@/schema/form-schema";
import { useEffect, useRef } from "react";
import { UseFormSetValue } from "react-hook-form";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

export const useSpeechToText = (
  setValue: UseFormSetValue<FormDataSchemaType>
) => {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const lastTranscriptRef = useRef<string>("");
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const startListening = () => {
    SpeechRecognition.startListening({
      continuous: false,
      language: "fr-FR",
    });
  };

  const handleReset = () => {
    resetTranscript();
    lastTranscriptRef.current = "";
    setValue("text", "", { shouldValidate: false });
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
  };

  useEffect(() => {
    if (!transcript || transcript === lastTranscriptRef.current) {
      return;
    }

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      if (transcript && transcript !== lastTranscriptRef.current) {
        setValue("text", transcript, { shouldValidate: false });
        lastTranscriptRef.current = transcript;
      }
    }, 150);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [transcript, setValue]);

  return {
    transcript,
    listening,
    startListening,
    stopListening: SpeechRecognition.stopListening,
    resetTranscript: handleReset,
    browserSupportsSpeechRecognition,
  };
};
