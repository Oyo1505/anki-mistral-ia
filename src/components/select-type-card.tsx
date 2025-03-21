import { UseFormRegister } from "react-hook-form";
import { FormDataSchemaType } from "@/schema/form-schema";

const SelectTypeCard = ({register}: {register: UseFormRegister<FormDataSchemaType>}) => {
  return (
    <div className='flex flex-col items-start justify-start'>
    <label htmlFor="typeCard" className='w-full'>Type de carte</label>
    <select className="w-full h-full p-2 rounded-md border-2 border-gray-300"  title="Type de carte" {...register('typeCard')}>
      <option value="basique">Basique</option>
      <option value="kanji">Kanji</option>
    </select>
    </div>
  )
}

export default SelectTypeCard;