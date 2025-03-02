'use client'
import { zodResolver } from '@hookform/resolvers/zod';
import ButtonUpload from './button-upload';
import TextArea from './text-area';
import SelectLevel from './select-level';
import { useForm } from 'react-hook-form';
import { FormDataSchema, FormDataSchemaType } from '@/schema/form-schema';
import Checkbox from './checkbox';
import { generateAnswer } from '@/actions/mistral.action';
import { CSVLink, CSVDownload } from "react-csv";
import { useState } from 'react';
export default function Form() {
  const [csvData, setCsvData] = useState<string[][]>([]);
  const {register, handleSubmit, setValue, formState: { errors } } = useForm({
    defaultValues: {
      level: 'N1',
      romanji: false,
      kanji: false,
      numberOfCards: 0,
      file: undefined,
      text: '',
      csv: false
    },
    resolver: zodResolver(FormDataSchema)
  });
  const onSubmit = async (data: FormDataSchemaType) => {
    try{ 
      const answer = await generateAnswer(data);
      setCsvData(answer);
      console.log(answer);
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

  return (
    <div>
      {csvData  && csvData.length > 0 && <CSVLink data={csvData}>Download me</CSVLink>}
    
    <form onSubmit={handleSubmit(onSubmit)}>
      <TextArea register={register} errors={errors} id="text" />
      <SelectLevel handleChangeSelectLevel={handleChangeSelectLevel} />
      {/* <ButtonUpload {...register('file')} /> */}
      <Checkbox label="Générer un CSV ?" handleChangeCheckbox={handleChangeCheckboxCsv}/>
      <Checkbox label="Romanji" handleChangeCheckbox={handleChangeCheckboxRomanji}/>
      <Checkbox label="Kanji" handleChangeCheckbox={handleChangeCheckboxKanji}/>
      <button type='submit'>Générer</button>
    </form>
    </div>
  )
}
