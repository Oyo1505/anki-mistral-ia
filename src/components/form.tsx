'use client'
import { generateAnswer, getTextFromImage, getTextFromPDF } from '@/actions/mistral.action';
import { FormDataSchemaType } from '@/schema/form-schema';
import { levels } from '@/shared/constants/levels';
import { MILLISECONDS_DELAY } from '@/shared/constants/numbers';
import delay from '@/utils/time/delay';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useTransition } from 'react';
import { CSVLink } from "react-csv";
import { useForm } from 'react-hook-form';
import type { Id } from 'react-toastify';
import { toast } from 'react-toastify';
import { z } from 'zod';
import ButtonUpload from './button-upload';
import Checkbox from './checkbox';
import CsvViewer from './csv-viewer';
import Input from './input';
import SelectLevel from './select-level';
import SelectTypeCard from './select-type-card';
import TextArea from './text-area';

 const FormDataSchema = z.object({
  level: z.string().min(1).default('N1'),
  numberOfCards: z.number().max(15, 'Le nombre de cartes ne peut pas dépasser 30'),
  files: z.array(z.instanceof(File)).refine(
    files => !files || files.every(file => file.size <= 5000000), 
    "Les fichiers ne doivent pas dépasser 5 MB"
  )
  .refine(
    files => !files || files.every(file => file.size >= 20000),
    "Les fichiers doivent faire au moins 20 KB pour une bonne qualité d'OCR"
  ).optional(),
  textFromPdf: z.string().optional(),
  text: z.string().max(5000, 'Le texte ne doit pas dépasser 15000 caractères').optional(),
  csv: z.boolean().optional(),
  romanji: z.boolean().optional().default(false),
  kanji: z.boolean().optional().default(false),
  japanese: z.boolean().optional().default(false),
  typeCard: z.string().optional().default('basique')
})

const levelsReverse = levels.reverse();

export default function Form() {

  const [csvData, setCsvData] = useState<string[][]>([]);
  const [isPending, startTransition] = useTransition();
  const [isCsvVisible, setIsCsvVisible] = useState(false);


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
  
  const displayToast = (dataRes: string[][] | null, status: number, error: string | null, id: Id) => {
    if (dataRes && status === 200) {
      setCsvData(dataRes);
      toast.success("Génération terminée", { autoClose: 3000 });
      reset();
    } else if (error && status === 500) {
      toast.dismiss(id);
      toast.error(error);
    } else {
      toast.dismiss(id);
      toast.error("Une erreur inattendue s'est produite");
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
              await delay(MILLISECONDS_DELAY); //1 second delay to avoid rate limit
            }
          }
          console.log(data);
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
    <div className='w-full flex flex-col md:flex-row items-start justify-center gap-4 transition-all duration-300 ease-in-out'>
    <div className={`w-full ${isCsvVisible && 'hidden'} border-2 p-4 border-white shadow-zinc-600 shadow-2xl rounded-md flex flex-col items-start justify-start gap-4 bg-white`}>
      <h1 className="text-xl w-full text-center font-bold">Générateur de cartes Anki (Basique)</h1>
      <form className="w-full flex flex-col items-start justify-start gap-4" onSubmit={handleSubmit(onSubmit)}>
        <TextArea {...register('text', { required: true })} errors={errors} id="text" />
        <div className='w-full grid grid-cols-1 md:grid-cols-2 gap-2'>
         {isCardKanji === 'basique' ? <SelectLevel className='w-full' register={register} levels={levelsReverse} defaultValue='N1' /> : null}
          <Input className='w-full' type="number" label="cards" title="Nombre de cartes (max 15)" max={15} min={1} defaultValue={5} {...register('numberOfCards', { valueAsNumber: true })} />
          <SelectTypeCard register={register} />
        </div>
        <ButtonUpload 
          setValueAction={setValue as any} 
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
            <Checkbox label="kanji" title="Voulez-vous inclure les kanji ?" handleChangeCheckboxAction={handleChangeCheckboxKanji} /> 
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
      <button className='w-full p-2 rounded-md border-2 border-gray-300 text-center cursor-pointer font-bold' onClick={() => setIsCsvVisible(()=>!isCsvVisible)}>{isCsvVisible ? 'Masquer les cartes' : 'Voir les cartes'}</button>
      </>
      }
      <div className='w-full flex items-start justify-between gap-2'>
        <a className='text-sm text-center border-2 bg-blue-500 text-white  rounded-md p-2' href="https://relieved-circle-d57.notion.site/Tuto-cr-ation-carte-basique-Anki-avec-ChatGPT-19a6823eb75b80e7b564dbc8cf73762d" target="_blank" rel="noopener noreferrer">Tutoriel pour importer des cartes dans Anki</a>
        <a className='text-sm text-center border-2 bg-blue-500 text-white rounded-md p-2' href="https://apps.ankiweb.net/" target="_blank" rel="noopener noreferrer">Télécharger Anki</a>
      </div>
    </div>
   
     {isCsvVisible && csvDataSuccess && 
      <>
     
      <CsvViewer setIsCsvVisible={setIsCsvVisible} csvFile={csvData} />
      
      </>}
      
    </div>
    {csvDataSuccess && 
      <>
        <CSVLink className='fixed bottom-2 right-2 w-auto z-50  p-3 bg-green-500 text-white font-semibold rounded-md text-center cursor-pointer' data={csvData}>Télécharger le fichier CSV</CSVLink>
      </>
    }
    </>
  )
}
