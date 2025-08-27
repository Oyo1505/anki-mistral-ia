'use client'
import { FormDataChatBot, useChatBotContext } from "@/context/chat-bot-context";
import { levels } from "@/shared/constants/levels";
import dynamic from "next/dynamic";
import { useForm } from "react-hook-form";

const Input = dynamic(() => import('./input'), { ssr: false });
const SelectLevel =  dynamic(() => import('./select-level'), { ssr: false });

const FormChatBot = () => {
  const { formData, setFormData } = useChatBotContext();

  const {register, handleSubmit, setValue, formState: {isSubmitting, errors}} = useForm({
    values: {
      name: formData.name,
      type: formData.type,
      level: formData.level,
      isSubmitted: formData.isSubmitted,
    },
    defaultValues: {
      name: formData.name,
      type: formData.type,
      level: formData.level,
      isSubmitted: formData.isSubmitted,
    },
  });

  const handleChangeSelectLevel = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setValue('level', e.target.value);
  }
  const onSubmit = async (data: FormDataChatBot) => {
    setFormData({
      ...formData,
      name: data.name,
      type: data.type,
      level: data.level,
      isSubmitted: true,
    });
  }

  return (
    <>
    {!formData.isSubmitted && (
    <div className="w-full h-auto border-white shadow-zinc-600 shadow-2xl rounded-md p-4 bg-white border-2">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-full">
        <Input className='w-full' type="text" label="name" title="Nom*" {...register('name', { required: true })} />
        <Input className='w-full' type="text" label="type" title="Type d'exercice*" {...register('type', { required: true })} />
        <SelectLevel className='w-full' handleChangeSelectLevelAction={handleChangeSelectLevel} levels={levels} />
        <button type="submit" disabled={isSubmitting} className="w-full p-2 rounded-md text-white font-bold bg-blue-500 cursor-pointer">Submit</button>
        {errors.name && <p className="text-red-500">Le nom est requis</p>}
        {errors.type && <p className="text-red-500">Le type d&apos;exercice est requis</p>}
      </form>
    </div>
    )}
    </>
  )
}

export default FormChatBot;