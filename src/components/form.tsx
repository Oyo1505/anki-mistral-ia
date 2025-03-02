'use client'
import { zodResolver } from '@hookform/resolvers/zod';
import TextArea from './text-area';
import SelectLevel from './select-level';
import { useForm } from 'react-hook-form';
import { FormDataSchema, FormDataSchemaType } from '@/schema/form-schema';
import Checkbox from './checkbox';
import { generateAnswer } from '@/actions/mistral.action';
import { CSVLink } from "react-csv";
import { useState, useTransition } from 'react';
import Input from './input';
import ButtonUpload from './button-upload';
import extractTextFromImage from '@/utils/extract-text-from-image';

export default function Form() {

  const [csvData, setCsvData] = useState<string[][]>([]);
  const [isPending, startTransition] = useTransition();

  const {register, handleSubmit, setValue, watch, formState: { errors }, reset } = useForm({
    defaultValues: {
      level: 'N1',
      romanji: false,
      kanji: false,
      numberOfCards: 5,
      files: undefined,
      textFromPdf: undefined,
      text: '',
      csv: false
    },
    resolver: zodResolver(FormDataSchema)
  });
  
  const textFromPdf = watch('textFromPdf');
  const files = watch('files');
  const onSubmit = async (data: FormDataSchemaType) => {
    try {   
      startTransition(async () => {
        try {
          if (textFromPdf && textFromPdf.length > 0 && textFromPdf !== undefined) {
            const answer = await generateAnswer(data);
            if (answer) {
              setCsvData(answer);
              reset();
            }
          }
        } catch (error) {
          console.error("Erreur pendant la génération:", error);
        }
      });
    } catch (error) {
      console.error("Erreur générale:", error);
    }
  };

  const convert = async (url: string) => {
    if (url.length) {
      console.log(url, "URL");
      await extractTextFromImage(url).then((txt: string) => {
        let copyTexts: Array<string> =  [];
        copyTexts.push(txt);
        setValue('textFromPdf', copyTexts.join('\n'));
        return textFromPdf && textFromPdf.length > 0 && textFromPdf !== undefined ? true : false;
      });
      return false;
    }
  };

  const handleChangeSelectLevel = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setValue('level', e.target.value);
  }

  const handleChangeCheckboxCsv = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue('csv', e.target.checked);
  }

  const handleChangeCheckboxRomanji = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue('romanji', e.target.checked);
  }

  const handleChangeCheckboxKanji = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue('kanji', e.target.checked);
  }
  console.log(errors, "ERRORS");  
  return (
    <div className='w-full flex flex-col items-start justify-start gap-4'>
      <form className="w-full flex flex-col items-start justify-start gap-4" onSubmit={handleSubmit(onSubmit)}>
        <TextArea register={register} errors={errors} id="text" />
        <div className='w-full grid grid-cols-1 md:grid-cols-2 gap-2'>
          <SelectLevel className='w-full' handleChangeSelectLevel={handleChangeSelectLevel} />
          <Input className='w-full' type="number" label="Nombre de cartes" max={30} min={1} defaultValue={5} {...register('numberOfCards', { valueAsNumber: true })} />
        </div>
        <ButtonUpload 
          errors={errors}
          files={files}
          setValue={setValue}
          {...register('files', { 
          required: false,
          onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
            e.preventDefault();
            if (e.target.files?.[0]) {
              console.log(e.target.files[0], "FILE");
              let url: string = URL.createObjectURL(e.target.files[0]);
              convert(url);
              setValue('files', Array.from(e.target.files));
            }
          },
          validate: (fileList: File[] | undefined) => {
            if (!fileList) return true;
            if (fileList.length > 3) {
              return 'Maximum 3 fichiers autorisés';
            }
            return true;
          }
        })}
        />
        <div className="w-full flex flex-col items-start justify-start">
          <Checkbox label="Générer un CSV ?" handleChangeCheckbox={handleChangeCheckboxCsv}/>
          <Checkbox label="Voulez vous inclure les romanji ?" handleChangeCheckbox={handleChangeCheckboxRomanji}/>
          <Checkbox label="Voulez vous inclure les kanji ?" handleChangeCheckbox={handleChangeCheckboxKanji} />
        </div>
        <button 
          type='submit' 
          className={`w-full p-2 rounded-md text-white font-bold ${
            isPending ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 cursor-pointer'
          }`} 
          disabled={isPending}
        >
        {isPending ? 'Génération en cours...' : 'Générer'}
      </button>
      </form>
      {csvData  && csvData.length > 0 && <CSVLink className='w-full p-2 rounded-md border-2 border-gray-300 text-center cursor-pointer font-bold' data={csvData}>Télécharger le fichier CSV</CSVLink>}
    </div>
  )
}
