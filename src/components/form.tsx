'use client'
import { zodResolver } from '@hookform/resolvers/zod';
import TextArea from './text-area';
import SelectLevel from './select-level';
import { useForm } from 'react-hook-form';
import { FormDataSchema, FormDataSchemaType } from '@/schema/form-schema';
import Checkbox from './checkbox';
import { generateAnswer, getTextFromImage, getTextFromPDF } from '@/actions/mistral.action';
import { CSVLink } from "react-csv";
import { useState, useTransition } from 'react';
import Input from './input';
import ButtonUpload from './button-upload';
import { toast } from 'react-toastify';
import CsvViewer from './csv-viewer';
import SelectTypeCard from './select-type-card';

export default function Form() {

  const [csvData, setCsvData] = useState<string[][]>([]);
  const [isPending, startTransition] = useTransition();
  const [isCsvVisible, setIsCsvVisible] = useState(false);
  const levels = [
    { value: "N1 Avancé", label: "N1 - Avancé (Maîtrise complète)" },
    { value: "N2 Pré-avancé", label: "N2 - Pré-avancé (Niveau courant)" },
    { value: "N3 Intermédiaire", label: "N3 - Intermédiaire" },
    { value: "N4 Pré-intermédiaire", label: "N4 - Pré-intermédiaire (Basique)" },
    { value: "N5 Débutant", label: "N5 - Débutant (Élémentaire)" }
  ]

  const {register, handleSubmit, setValue, watch, formState: { errors }, reset } = useForm({
    defaultValues: {
      typeCard: 'basique',
      level: 'N1',
      romanji: false,
      kanji: false,
      numberOfCards: 5,
      files: [],
      textFromPdf: undefined,
      text: '',
      csv: false,
      japanese: false
    },
    resolver: zodResolver(FormDataSchema)
  });

  const files = watch('files');

  const processFile = async (file: File): Promise<string | null> => {
    try {
      if (file.type === 'application/pdf') {
        return await getTextFromPDF(file);
      }
      
      if (['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
        return await getTextFromImage(file);
      }
      
      return null;
    } catch (error) {
      console.error("Erreur lors du traitement du fichier:", error);
      return null;
    }
  };
  const displayToast = (dataRes: string[][] | null, status: number, error: string | null, id: string) => {
    if (dataRes && status === 200) {
      setCsvData(dataRes);
      toast.success("Génération terminée", { autoClose: 3000 });
      reset();
    } else if (error && status === 500) {
      toast.dismiss(id);
      toast.error(error);
    }
  }
  const onSubmit = async (data: FormDataSchemaType) => {
    try {   
      startTransition(async () => {
        const id = toast.loading('En cours de génération', { autoClose: false });
        try {
          let res = '';
          
          if (files?.[0]) {
            const convertResult = await processFile(files[0]);
            if (convertResult) {
              res = convertResult;
              setValue('textFromPdf', res, { shouldValidate: true });
            }
          }
            const { data: dataRes, status, error } = await generateAnswer({
              ...data,
              ...(res && res.length > 0 && { textFromPdf: res })
            });
         
            displayToast(dataRes, status, error || null, id.toString());
          
        } catch (error) {
          displayToast(null, 500, "Erreur pendant la génération", id.toString());
          console.error("Erreur pendant la génération:", error);
        }
        toast.dismiss(id);
      });
    } catch (error) {
      toast.error("Erreur lors de la génération des cartes");
      console.error("Erreur générale:", error);
    }
  };

  const handleChangeSelectLevel = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setValue('level', e.target.value);
  }

  const handleChangeCheckboxRomanji = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue('romanji', e.target.checked);
  }

  const handleChangeCheckboxKanji = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue('kanji', e.target.checked);
  }
  const handleChangeCheckboxJapanese = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue('japanese', e.target.checked);
  }

  const text = watch('text');
  const isSubmitDisabled = (!text || text.trim() === '') && (!files || files.length === 0);
  const csvDataSuccess = csvData  && csvData.length > 0 &&  !isPending;
  const isCardKanji = watch('typeCard');
  const allInJapanese = watch('japanese');

  return (
    <>
    <div className='w-full flex flex-col md:flex-row  items-start justify-center gap-4 transition-all duration-300 ease-in-out'>
    <div className='w-full border-2 md:w-1/2  2xl:w-1/4 p-4 border-white shadow-zinc-600 shadow-2xl rounded-md flex flex-col items-start justify-start gap-4 bg-white'>
      <h1 className="text-xl w-full text-center font-bold">Générateur de cartes Anki (Basique)</h1>
      <form className="w-full flex flex-col items-start justify-start gap-4" onSubmit={handleSubmit(onSubmit)}>
        <TextArea register={register} errors={errors} id="text" />
        <div className='w-full grid grid-cols-1 md:grid-cols-2 gap-2'>
         {isCardKanji === 'basique' ? <SelectLevel className='w-full' handleChangeSelectLevelAction={handleChangeSelectLevel} levels={levels.reverse()} /> : null}
          <Input className='w-full' type="number" label="cards" title="Nombre de cartes (max 15)" max={15} min={1} defaultValue={5} {...register('numberOfCards', { valueAsNumber: true })} />
          <SelectTypeCard register={register} />
        </div>
        <ButtonUpload 
          setValueAction={setValue} 
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
        {isCardKanji === 'basique' && (
          <div className="w-full flex flex-col items-start justify-start">
           {allInJapanese ? null : <Checkbox label="romanji" title="Voulez-vous inclure les romanji ?" handleChangeCheckboxAction={handleChangeCheckboxRomanji}/> }
           {allInJapanese ? null : <Checkbox label="kanji" title="Voulez-vous inclure les kanji ?" handleChangeCheckboxAction={handleChangeCheckboxKanji} /> }
            <Checkbox label="japonais" title="Tout en japonais (énoncés/questions/réponses) ?" handleChangeCheckboxAction={handleChangeCheckboxJapanese} /> 
          </div>
        )}
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
      {csvDataSuccess && 
      <>
      <button className='w-full p-2 rounded-md border-2 border-gray-300 text-center cursor-pointer font-bold' onClick={() => setIsCsvVisible(!isCsvVisible)}>{isCsvVisible ? 'Masquer les cartes' : 'Voir les cartes'}</button>
      </>
      }
      <div className='w-full flex items-start justify-between gap-2'>
        <a className='text-sm text-center border-2 bg-blue-500 text-white  rounded-md p-2' href="https://relieved-circle-d57.notion.site/Tuto-cr-ation-carte-basique-Anki-avec-ChatGPT-19a6823eb75b80e7b564dbc8cf73762d" target="_blank" rel="noopener noreferrer">Tutoriel pour importer dans Anki</a>
        <a className='text-sm text-center border-2 bg-blue-500 text-white rounded-md p-2' href="https://apps.ankiweb.net/" target="_blank" rel="noopener noreferrer">Télécharger Anki</a>
      </div>
    </div>
   
     {isCsvVisible && csvDataSuccess && <CsvViewer  csvFile={csvData} />}
    </div>
    {csvDataSuccess && 
          <>
          <CSVLink className='fixed bottom-2 right-2 w-auto z-50  p-3 bg-green-500 text-white font-semibold rounded-md text-center cursor-pointer' data={csvData}>Télécharger le fichier CSV</CSVLink>
          </>
    }
      </>
  )
}
