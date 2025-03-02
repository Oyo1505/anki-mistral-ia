'use client'

import { FormDataSchemaType } from "@/schema/form-schema";
import { FieldErrors, UseFormRegister } from "react-hook-form";

interface TextAreaProps {
  register: UseFormRegister<FormDataSchemaType>;
  errors: FieldErrors<FormDataSchemaType>;
  id: string; 
}
export default function TextArea({ register, errors, id }: TextAreaProps) {
  return (
    <div>
      <label htmlFor={id}>Texte</label> 
      <textarea id={id} {...register('text')} className="border rounded p-2 w-full" />
      {errors.text && <p className="text-red-600 text-xs">{errors.text.message}</p>}
    </div>
  );
}