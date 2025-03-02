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

export default function Form() {
  const [csvData, setCsvData] = useState<string[][]>([]);
  const [isPending, startTransition] = useTransition();

  const {register, handleSubmit, setValue, formState: { errors }, reset } = useForm({
    defaultValues: {
      level: 'N1',
      romanji: false,
      kanji: false,
      numberOfCards: 5,
      file: undefined,
      text: '',
      csv: false
    },
    resolver: zodResolver(FormDataSchema)
  });
  const onSubmit = async (data: FormDataSchemaType) => {
    try{ 
      const answer = await generateAnswer(data);
      if (answer) {
        startTransition(() => {
          setCsvData(answer);
          console.log(answer);
          reset();
        });
      }
    } catch (error) {
      console.error(error);
    }
  }

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

  // const level = watch('level');
 
  return (
    <div className='w-full flex flex-col items-start justify-start gap-4'>
      <form className="w-full flex flex-col items-start justify-start gap-4" onSubmit={handleSubmit(onSubmit)}>
        <TextArea register={register} errors={errors} id="text" />
        <div className='w-full grid grid-cols-1 md:grid-cols-2 gap-2'>
          <SelectLevel className='w-full' handleChangeSelectLevel={handleChangeSelectLevel} />
          <Input className='w-full' type="number" label="Nombre de cartes" max={30} min={1} defaultValue={5} {...register('numberOfCards', { valueAsNumber: true })} />
        </div>
        {/* <ButtonUpload {...register('file')} /> */}
        <div className="w-full flex flex-col items-start justify-start">
          <Checkbox label="Générer un CSV ?" handleChangeCheckbox={handleChangeCheckboxCsv}/>
          <Checkbox label="Voulez vous inclure les romanji ?" handleChangeCheckbox={handleChangeCheckboxRomanji}/>
          <Checkbox label="Voulez vous inclure les kanji ?" handleChangeCheckbox={handleChangeCheckboxKanji} />
        </div>
        <button type='submit' className={`w-full p-2 rounded-md text-white font-bold ${isPending ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 cursor-pointer'} `} disabled={isPending}>Générer</button>
      </form>
      {csvData  && csvData.length > 0 && <CSVLink className='w-full p-2 rounded-md border-2 border-gray-300 text-center cursor-pointer font-bold' data={csvData}>Télécharger le fichier CSV</CSVLink>}
    </div>
  )
}
