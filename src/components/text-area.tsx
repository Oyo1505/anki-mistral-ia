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
    <div className="w-full flex flex-col items-start justify-start">
      <label htmlFor={id}/>
      <textarea id={id} {...register('text')} placeholder="Votre texte ou instructions" className="border rounded p-2 w-full h-48 focus:outline-none focus:ring-2 focus:ring-gray-300 border-gray-300" />
      {errors.text && <p className="text-red-600 text-xs">{errors.text.message}</p>}
    </div>
  );
}