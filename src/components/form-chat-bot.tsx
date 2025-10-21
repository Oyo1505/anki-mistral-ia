"use client";
import { useChatBotContext } from "@/context/chat-bot-context";
import { FormDataSchemaChatBotType } from "@/schema/form-schema";
import { levels } from "@/shared/constants/levels";
import { zodResolver } from "@hookform/resolvers/zod";
import dynamic from "next/dynamic";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const Input = dynamic(() => import("./input"), { ssr: false });
const SelectLevel = dynamic(() => import("./select-level"), { ssr: false });

const FormDataSchemaChatBot = z.object({
  name: z
    .string()
    .min(1, "Le nom est requis")
    .max(20, "Le nom ne doit pas dépasser 20 caractères"),
  type: z
    .string()
    .min(1, "Le type d'exercice est requis")
    .max(300, "Le nom ne doit pas dépasser 300 caractères"),
  level: z.string().min(1, "Le niveau est requis"),
  isSubmitted: z.boolean().optional().default(false),
});

const FormChatBot = () => {
  const { formData, handleSetFormData } = useChatBotContext();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm({
    values: {
      name: formData.name,
      type: formData.type,
      level: formData.level,
      isSubmitted: formData.isSubmitted,
    },

    resolver: zodResolver(FormDataSchemaChatBot),
  });

  const onSubmit = useCallback(
    (data: FormDataSchemaChatBotType) => {
      handleSetFormData({
        name: data.name,
        type: data.type,
        level: data.level,
        isSubmitted: true,
      });
    },
    [handleSetFormData]
  );

  return (
    <>
      {!formData.isSubmitted && (
        <div className="w-full h-full md:h-auto border-white shadow-zinc-600 shadow-2xl rounded-md p-4 bg-white border-2">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4 w-full"
          >
            <Input
              className="w-full"
              type="text"
              label="name"
              title="Nom*"
              {...register("name", { required: true })}
            />
            <Input
              className="w-full"
              type="text"
              label="type"
              title="Type d'exercice*"
              {...register("type", { required: true })}
            />
            <SelectLevel
              className="w-full"
              register={register}
              levels={levels}
              defaultValue={formData.level}
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full p-2 rounded-md text-white font-bold bg-blue-500 cursor-pointer"
            >
              Submit
            </button>
            {errors.name && <p className="text-red-500">Le nom est requis</p>}
            {errors.type && (
              <p className="text-red-500">Le type d&apos;exercice est requis</p>
            )}
            {errors.level && (
              <p className="text-red-500">Le niveau est requis</p>
            )}
          </form>
        </div>
      )}
    </>
  );
};

export default FormChatBot;
