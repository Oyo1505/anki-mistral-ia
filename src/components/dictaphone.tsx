import { useSpeechToText } from "@/hooks/useSpeechToText";
import { FormDataSchemaType } from "@/schema/form-schema";
import { UseFormSetValue } from "react-hook-form";

type DictaphoneProps = {
  setValue: UseFormSetValue<FormDataSchemaType>;
};

const Dictaphone = ({ setValue }: DictaphoneProps) => {
  const {
    listening,
    startListening,
    stopListening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechToText(setValue);

  if (!browserSupportsSpeechRecognition) {
    return (
      <div className="p-3 bg-yellow-100 border border-yellow-400 rounded text-yellow-800">
        ⚠️ Votre navigateur ne supporte pas la reconnaissance vocale.
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-2 p-3 bg-blue-50 border border-blue-200 rounded">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">
          🎤 Microphone:
          <span
            className={`ml-2 font-bold ${
              listening ? "text-green-600" : "text-gray-600"
            }`}
          >
            {listening ? "En écoute..." : "Arrêté"}
          </span>
        </span>
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={startListening}
          disabled={listening}
          className="px-3 py-1.5 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm"
        >
          ▶️ Démarrer
        </button>
        <button
          type="button"
          onClick={stopListening}
          disabled={!listening}
          className="px-3 py-1.5 bg-red-500 text-white rounded hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm"
        >
          ⏹️ Arrêter
        </button>
        <button
          type="button"
          onClick={resetTranscript}
          className="px-3 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm"
        >
          🔄 Réinitialiser
        </button>
      </div>
    </div>
  );
};
export default Dictaphone;
