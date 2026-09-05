import { useSpeechToText } from "@/hooks/useSpeechToText";
import { FormDataSchemaInputType } from "@/schema/form-schema";
import { UseFormSetValue } from "react-hook-form";

type DictaphoneProps = {
  setValue: UseFormSetValue<FormDataSchemaInputType>;
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
      <div
        role="alert"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "12px 14px",
          background: "var(--hinomaru-100)",
          border: "1px solid var(--hinomaru-500)",
          borderRadius: "var(--r-md)",
          color: "var(--hinomaru-700)",
          fontSize: "var(--fs-sm)",
        }}
      >
        <WarningIcon />
        Votre navigateur ne supporte pas la reconnaissance vocale.
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 14px",
        background: listening ? "var(--matcha-200)" : "var(--washi-100)",
        border: "1px solid",
        borderColor: listening ? "var(--matcha-500)" : "var(--border-1)",
        borderRadius: "var(--r-md)",
        transition: "background 200ms, border-color 200ms",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div
          aria-hidden="true"
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            background: listening ? "var(--matcha-500)" : "var(--washi-200)",
            color: listening ? "#fff" : "var(--fg-2)",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <MicIcon />
        </div>
        <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.2 }}>
          <span style={{ fontSize: "var(--fs-sm)", fontWeight: "var(--fw-semibold)" }}>
            Reconnaissance vocale
          </span>
          <span style={{ fontSize: "var(--fs-xs)", color: "var(--fg-3)" }}>
            {listening ? "En écoute…" : "Arrêté"}
          </span>
        </div>
      </div>

      <div style={{ display: "flex", gap: 8 }} role="group" aria-label="Contrôles du microphone">
        {!listening ? (
          <button
            type="button"
            onClick={startListening}
            className="ds-btn ds-btn--secondary"
            style={{ padding: "6px 12px", fontSize: "var(--fs-xs)" }}
            aria-label="Démarrer la reconnaissance vocale"
          >
            <PlayIcon />
            Démarrer
          </button>
        ) : (
          <button
            type="button"
            onClick={stopListening}
            className="ds-btn ds-btn--secondary"
            style={{ padding: "6px 12px", fontSize: "var(--fs-xs)" }}
            aria-label="Arrêter la reconnaissance vocale"
          >
            <StopIcon />
            Arrêter
          </button>
        )}
        <button
          type="button"
          onClick={resetTranscript}
          className="ds-btn ds-btn--ghost"
          style={{ padding: "6px 12px", fontSize: "var(--fs-xs)" }}
          aria-label="Réinitialiser la transcription"
        >
          <ResetIcon />
          Réinitialiser
        </button>
      </div>
    </div>
  );
};

const MicIcon = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none"
       stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round"
       aria-hidden="true">
    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/>
    <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
    <line x1="12" y1="19" x2="12" y2="23"/>
    <line x1="8" y1="23" x2="16" y2="23"/>
  </svg>
);

const PlayIcon = () => (
  <svg width={12} height={12} viewBox="0 0 24 24" fill="none"
       stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round"
       aria-hidden="true">
    <polygon points="6 4 20 12 6 20 6 4"/>
  </svg>
);

const StopIcon = () => (
  <svg width={12} height={12} viewBox="0 0 24 24" fill="none"
       stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round"
       aria-hidden="true">
    <rect x="6" y="6" width="12" height="12" rx="1"/>
  </svg>
);

const ResetIcon = () => (
  <svg width={12} height={12} viewBox="0 0 24 24" fill="none"
       stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round"
       aria-hidden="true">
    <path d="M3 12a9 9 0 1 0 3-6.7"/>
    <polyline points="3 4 3 10 9 10"/>
  </svg>
);

const WarningIcon = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none"
       stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round"
       aria-hidden="true" style={{ flexShrink: 0 }}>
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
    <line x1="12" y1="9" x2="12" y2="13"/>
    <line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);

export default Dictaphone;
