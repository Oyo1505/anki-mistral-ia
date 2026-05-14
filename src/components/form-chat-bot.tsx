"use client";
import { useChatBotContext } from "@/context/chat-bot-context";
import { FormDataSchemaChatBotType } from "@/schema/form-schema";
import { levels } from "@/shared/constants/levels";
import { zodResolver } from "@hookform/resolvers/zod";
import dynamic from "next/dynamic";
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

  const onSubmit = (data: FormDataSchemaChatBotType) => {
    handleSetFormData({
      name: data.name,
      type: data.type,
      level: data.level,
      isSubmitted: true,
    });
  };

  if (formData.isSubmitted) return null;

  return (
    <div
      className="ds-card"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 16,
        maxWidth: 560,
        margin: "0 auto",
      }}
    >
      <div>
        <div className="ds-eyebrow" style={{ marginBottom: 4 }}>Chat tuteur · 先生</div>
        <h1
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: 26,
            fontWeight: 700,
            margin: 0,
            lineHeight: "var(--lh-tight)",
            color: "var(--fg-1)",
          }}
        >
          Préparez votre séance
        </h1>
        <p style={{ fontSize: "var(--fs-sm)", color: "var(--fg-2)", margin: "6px 0 0 0", lineHeight: "var(--lh-base)" }}>
          Mistral jouera le rôle d&apos;un tuteur de japonais adapté à votre niveau.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 w-full"
      >
        <Input
          className="w-full"
          type="text"
          label="name"
          title="Votre nom"
          {...register("name", { required: true })}
        />
        <Input
          className="w-full"
          type="text"
          label="type"
          title="Type d'exercice"
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
          className="ds-btn ds-btn--primary ds-btn--lg"
          style={{ width: "100%" }}
        >
          <ArrowIcon />
          Démarrer la conversation
        </button>

        {errors.name && (
          <p style={{ fontSize: "var(--fs-xs)", color: "var(--fg-danger)" }}>
            Le nom est requis
          </p>
        )}
        {errors.type && (
          <p style={{ fontSize: "var(--fs-xs)", color: "var(--fg-danger)" }}>
            Le type d&apos;exercice est requis
          </p>
        )}
        {errors.level && (
          <p style={{ fontSize: "var(--fs-xs)", color: "var(--fg-danger)" }}>
            Le niveau est requis
          </p>
        )}
      </form>
    </div>
  );
};

const ArrowIcon = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none"
       stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round"
       aria-hidden="true">
    <line x1="5" y1="12" x2="19" y2="12"/>
    <polyline points="12 5 19 12 12 19"/>
  </svg>
);

export default FormChatBot;
