'use client'
import { FormDataSchemaType } from "@/schema/form-schema";
import clsx from "clsx";
import { FieldErrors } from "react-hook-form";

interface TextAreaProps {
  errors: FieldErrors<FormDataSchemaType>;
  id: string; 
  className?: string;
 // eslint-disable-next-line no-unused-vars
  onKeyDown? : (e: React.KeyboardEvent<HTMLTextAreaElement>) => void
  label?: string
  disabled? : boolean
}

export default function TextArea({ errors, id, className, onKeyDown, disabled, label, ...props }: TextAreaProps) {
  return (
    <div className="w-full flex flex-col items-start justify-start">
      <label htmlFor={id}>{label}</label>
      <textarea id={id} {...props } autoComplete="off" onKeyDown={onKeyDown} disabled={disabled} placeholder="Votre texte ou instructions" className={clsx(className, "border rounded p-2 w-full h-48 focus:outline-none focus:ring-2 focus:ring-gray-300 border-gray-300")} />
      {errors.text && <p className="text-red-600 text-xs">{errors.text.message}</p>}
    </div>
  );
}