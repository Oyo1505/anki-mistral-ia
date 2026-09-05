"use client";
import { FormDataSchemaInputType } from "@/schema/form-schema";
import { FieldErrors, UseFormSetValue } from "react-hook-form";

interface ButtonUploadProps {
  accept?: string;
  multiple?: boolean;
  onChange: (_e: React.ChangeEvent<HTMLInputElement>) => void;
  files: File[] | undefined;
  errors: FieldErrors<FormDataSchemaInputType>;
  setValueAction: UseFormSetValue<FormDataSchemaInputType>;
}

export default function ButtonUpload({
  accept = ".pdf, .jpg, .jpeg, .png",
  multiple = true,
  files,
  errors,
  setValueAction,
  ...props
}: ButtonUploadProps) {
  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setValueAction("files", Array.from(e.target.files));
    }
  };

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 8 }}>
      <label
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: 140,
          border: "1.5px dashed var(--washi-300)",
          background: "var(--washi-50)",
          borderRadius: 12,
          cursor: "pointer",
          transition: "background 120ms, border-color 120ms",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLLabelElement).style.background = "var(--washi-200)";
          (e.currentTarget as HTMLLabelElement).style.borderColor = "var(--sumi-900)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLLabelElement).style.background = "var(--washi-50)";
          (e.currentTarget as HTMLLabelElement).style.borderColor = "var(--washi-300)";
        }}
      >
        <UploadIcon />
        <div style={{ marginTop: 10, fontSize: "var(--fs-sm)", color: "var(--fg-1)", textAlign: "center" }}>
          <strong>Cliquez pour uploader</strong>
          <span style={{ color: "var(--fg-2)" }}> ou glissez-déposez</span>
        </div>
        <div style={{ marginTop: 4, fontSize: "var(--fs-xs)", color: "var(--fg-3)" }}>
          PNG, JPG, PDF · max 3 fichiers
        </div>
        <input
          type="file"
          style={{ display: "none" }}
          accept={accept}
          multiple={multiple}
          {...props}
          onChange={handleChange}
        />
      </label>

      {errors?.files && (
        <p style={{ fontSize: "var(--fs-xs)", color: "var(--fg-danger)" }}>
          {errors.files.message}
        </p>
      )}

      {files && files.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {Array.from(files).map((file, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "8px 12px",
                background: "#fff",
                border: "1px solid var(--border-1)",
                borderRadius: 8,
                fontSize: "var(--fs-xs)",
                color: "var(--fg-2)",
              }}
            >
              <FileIcon />
              <span>{file.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const UploadIcon = () => (
  <svg width={28} height={28} viewBox="0 0 24 24" fill="none"
       stroke="var(--fg-3)" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round"
       aria-hidden="true">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="17 8 12 3 7 8"/>
    <line x1="12" y1="3" x2="12" y2="15"/>
  </svg>
);

const FileIcon = () => (
  <svg width={14} height={14} viewBox="0 0 24 24" fill="none"
       stroke="var(--fg-3)" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round"
       aria-hidden="true" style={{ flexShrink: 0 }}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
  </svg>
);
