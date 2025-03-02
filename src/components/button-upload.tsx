'use client'
import {  FieldErrors } from 'react-hook-form';
import { FormDataSchemaType } from '@/schema/form-schema';

interface ButtonUploadProps {
  accept?: string;
  multiple?: boolean;
   //eslint-disable-next-line no-unused-vars
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  files: File[] | undefined;
  errors: FieldErrors<FormDataSchemaType>;
}
export default function ButtonUpload({accept = ".pdf, .jpg, .jpeg, .png", multiple = true, files, errors, ...props }: ButtonUploadProps) {

  return (
    <div className="w-full flex flex-col gap-2">
      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
          </svg>
          <p className="mb-2 text-sm text-gray-500">
            <span className="font-semibold">Cliquez pour uploader</span> ou glissez-déposez
          </p>
          <p className="text-xs text-gray-500">PDF, PNG, JPG ou JPEG (MAX. 3 fichiers)</p>
        </div>
        <input 
          type="file" 
          className="hidden" 
          accept={accept}
          multiple={multiple}
          {...props}
        />
      </label>
      {errors && errors.files && (
        <p className="text-red-500 text-sm">{errors.files.message}</p>
      )}
      {files && files.length > 0 && (
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium">Fichiers sélectionnés :</p>
          {Array.from(files).map((file, index) => (
            <p key={index} className="text-sm text-gray-500">{file.name}</p>
          ))}
        </div>
      )}
    </div>
  );
}