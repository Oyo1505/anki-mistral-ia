"use client";
import { FormDataSchemaType } from "@/schema/form-schema";
import clsx from "clsx";
import { FieldErrors } from "react-hook-form";

interface TextAreaProps {
  errors: FieldErrors<FormDataSchemaType>;
  id: string;
  className?: string;
  onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  label?: string;
  disabled?: boolean;
}

export default function TextArea({
  errors,
  id,
  className,
  onKeyDown,
  disabled,
  label,
  ...props
}: TextAreaProps) {
  const hasError = !!errors.text;

  return (
    <div className="w-full flex flex-col">
      {label && (
        <label htmlFor={id} className="ds-label">
          {label}
        </label>
      )}
      <textarea
        id={id}
        {...props}
        autoComplete="off"
        onKeyDown={onKeyDown}
        disabled={disabled}
        placeholder="Votre texte ou instructions"
        className={clsx("ds-textarea ds-input", hasError && "ds-input--error", className)}
        style={{ resize: "vertical", minHeight: 120 }}
      />
      {hasError && (
        <p style={{ fontSize: "var(--fs-xs)", color: "var(--fg-danger)", marginTop: 6 }}>
          {errors.text?.message}
        </p>
      )}
    </div>
  );
}
