'use client'
import { zodResolver } from '@hookform/resolvers/zod';
import TextArea from './text-area';
import SelectLevel from './select-level';
import { useForm } from 'react-hook-form';
import { FormDataSchema, FormDataSchemaType } from '@/schema/form-schema';
import Checkbox from './checkbox';
import {  generateAnswer } from '@/actions/mistral.action';
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
      files: [],
      textFromPdf: undefined,
      text: '',
      csv: false
    },
    resolver: zodResolver(FormDataSchema)
  });
  const files = watch('files');

  const onSubmit = async (data: FormDataSchemaType) => {
    try {   
      startTransition(async () => {
        try {
          let res = '';
          if (files?.[0] && (files[0].type === 'image/jpeg' || files[0].type === 'image/png' || files[0].type === 'image/jpg')) {
            const url = URL.createObjectURL(files[0]);
            const convertResult = await convert(url);
            if (convertResult) {
              res = convertResult;
              setValue('textFromPdf', res, { shouldValidate: true });
            } 
          }
          if (files?.[0] && (files[0].type === 'application/pdf')) {
            const convertResult = await convertPdf(files[0]);
            if (convertResult) {
              res = convertResult; 
              setValue('textFromPdf', res, { shouldValidate: true });
            }
          }
          const answer = await generateAnswer({
            ...data,
              textFromPdf: res 
            });
            
            if (answer) {
              setCsvData(answer);
              reset();
            }
          
        } catch (error) {
          console.error("Erreur pendant la génération:", error);
        }
      });
    } catch (error) {
      console.error("Erreur générale:", error);
    }
  };

  const convert = async (url: string | undefined) => {
    if (url?.length) {
      const copyTexts: Array<string> =  [];
      await extractTextFromImage(url).then((txt: string) => {
        copyTexts.push(txt);
      })
      return copyTexts.join('\n');
    }
  };

  const convertPdf = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
  
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      if (!response.ok) {
        throw new Error('Erreur lors de l\'upload');
      }
      const data = await response.json();
      return data.text;
    } catch (error) {
      console.error("Erreur lors de l'extraction du PDF:", error);
      return '';
    }
  };

  const handleChangeSelectLevel = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setValue('level', e.target.value);
  }

  // const handleChangeCheckboxCsv = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setValue('csv', e.target.checked);
  // }

  const handleChangeCheckboxRomanji = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue('romanji', e.target.checked);
  }

  const handleChangeCheckboxKanji = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue('kanji', e.target.checked);
  }
  const text = watch('text');
  const isSubmitDisabled = (!text || text.trim() === '') && (!files || files.length === 0);

  return (
    <div className='w-full flex flex-col items-start justify-start gap-4'>

      <form className="w-full flex flex-col items-start justify-start gap-4" onSubmit={handleSubmit(onSubmit)}>
        <TextArea register={register} errors={errors} id="text" />
        <div className='w-full grid grid-cols-1 md:grid-cols-2 gap-2'>
          <SelectLevel className='w-full' handleChangeSelectLevelAction={handleChangeSelectLevel} />
          <Input className='w-full' type="number" label="cards" title="Nombre de cartes" max={30} min={1} defaultValue={5} {...register('numberOfCards', { valueAsNumber: true })} />
        </div>
        <ButtonUpload 
          setValue={setValue} 
          errors={errors}
          files={files}
          {...register('files', {
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
          {/* <Checkbox label="Générer un CSV ?" handleChangeCheckboxAction={handleChangeCheckboxCsv}/> */}
          <Checkbox label="romanji" title="Voulez-vous inclure les romanji ?" handleChangeCheckboxAction={handleChangeCheckboxRomanji}/>
          <Checkbox label="kanji" title="Voulez-vous inclure les kanji ?" handleChangeCheckboxAction={handleChangeCheckboxKanji} />
        </div>
        <button 
          type='submit' 
          className={`w-full p-2 rounded-md text-white font-bold ${
            isPending ? 'bg-gray-400 cursor-not-allowed' : 
            isSubmitDisabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 cursor-pointer'
          }`} 
          disabled={isPending || isSubmitDisabled}
        >
        {isPending ? 'Génération en cours...' : 
         isSubmitDisabled ? 'Veuillez entrer du texte ou ajouter une image' : 'Générer'}
      </button>
      </form>
      {csvData  && csvData.length > 0 &&  !isPending && <CSVLink className='w-full p-2 rounded-md border-2 border-gray-300 text-center cursor-pointer font-bold' data={csvData}>Télécharger le fichier CSV</CSVLink>}
      <div className='w-full flex items-start justify-between gap-2'>
        <a className='text-sm border-2 bg-blue-500 text-white  rounded-md p-2' href="https://relieved-circle-d57.notion.site/Tuto-cr-ation-carte-basique-Anki-avec-ChatGPT-19a6823eb75b80e7b564dbc8cf73762d" target="_blank" rel="noopener noreferrer">Tutoriel pour importer dans Anki</a>
        <a className='text-sm border-2 bg-blue-500 text-white rounded-md p-2' href="https://apps.ankiweb.net/" target="_blank" rel="noopener noreferrer">Telecharger Anki</a>
      </div>
    </div>
  )
}
