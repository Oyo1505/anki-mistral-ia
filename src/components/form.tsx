"use client";
import { useAnkiCardGeneration } from "@/hooks/useAnkiCardGeneration";
import {
  FormDataSchema,
  FormDataSchemaInputType,
  FormDataSchemaType,
} from "@/schema/form-schema";
import { levels } from "@/shared/constants/levels";
import { zodResolver } from "@hookform/resolvers/zod";
import dynamic from "next/dynamic";
import { useState, useCallback } from "react";
import { CSVLink } from "react-csv";
import { useForm, UseFormSetValue } from "react-hook-form";
import ButtonUpload from "./button-upload";
import Checkbox from "./checkbox";
import Dictaphone from "./dictaphone";
import ButtonDisplayCard from "./form_button_display_card";
import FormButtonSubmit from "./form_button_submit";
import FooterForm from "./form_footer";
import Input from "./input";
import SelectLevel from "./select-level";
import SelectTypeCard from "./select-type-card";
import TextArea from "./text-area";

const CsvViewer = dynamic(() => import("@/components/csv-viewer"), {
  loading: () => (
    <div style={{ padding: 16, color: "var(--fg-3)", fontSize: "var(--fs-sm)" }}>
      Chargement du visualiseur…
    </div>
  ),
  ssr: false,
});

type typeCheckbox = "romanji" | "kanji" | "japanese" | "furigana";

export default function Form() {
  const [isCsvVisible, setIsCsvVisible] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      typeCard: "basique",
      level: "N5 Débutant",
      romanji: false,
      kanji: false,
      numberOfCards: 5,
      furigana: false,
      files: [],
      textFromPdf: undefined,
      text: "",
      csv: false,
      japanese: false,
    },
    resolver: zodResolver(FormDataSchema),
  });

  const { csvData, isPending, generateCards } = useAnkiCardGeneration(
    setValue,
    reset
  );
  const files = watch("files");
  const levelsReverse = [...levels].reverse();

  const onSubmit = useCallback(
    async (data: FormDataSchemaType) => {
      await generateCards(data);
    },
    [generateCards]
  );

  const handleChangeCheckbox = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, typeCheckbox: typeCheckbox) => {
      setValue(typeCheckbox, e.target.checked);
    },
    [setValue]
  );

  const isCardKanji = watch("typeCard");
  const allInJapanese = watch("japanese");
  const text = watch("text");
  const kanji = watch("kanji");

  const isSubmitDisabled =
    (!text || text.trim() === "") && (!files || files.length === 0);
  const csvDataSuccess = csvData && csvData.length > 0 && !isPending;

  return (
    <>
      <div className="w-full flex flex-col md:flex-row items-start justify-center gap-4 transition-all duration-300 ease-in-out">
        <div
          className={`w-full ${isCsvVisible ? "hidden" : ""} ds-card`}
          style={{ display: isCsvVisible ? "none" : "flex", flexDirection: "column", gap: 16 }}
        >
          <div>
            <div className="ds-eyebrow" style={{ marginBottom: 4 }}>Générateur · 暗記</div>
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
              Créez vos cartes Anki
            </h1>
            <p style={{ fontSize: "var(--fs-sm)", color: "var(--fg-2)", margin: "6px 0 0 0", lineHeight: "var(--lh-base)" }}>
              Décrivez le thème ou téléversez un document — Mistral générera des cartes
              prêtes pour Anki Desktop.
            </p>
          </div>

          <Dictaphone setValue={setValue} />

          <form
            className="w-full flex flex-col items-start justify-start gap-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            <TextArea
              {...register("text", { required: true })}
              errors={errors}
              id="text"
              label="Instruction"
            />
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-3">
              {isCardKanji === "basique" && (
                <SelectLevel
                  className="w-full"
                  register={register}
                  levels={levelsReverse}
                  defaultValue="N1"
                />
              )}
              <Input
                className="w-full"
                type="number"
                label="numberOfCards"
                title="Nombre de cartes"
                max={15}
                min={1}
                defaultValue={5}
                {...register("numberOfCards", { valueAsNumber: true })}
              />
              <SelectTypeCard register={register} />
            </div>
            <ButtonUpload
              setValueAction={setValue as UseFormSetValue<FormDataSchemaInputType>}
              errors={errors}
              files={files}
              {...register("files", {
                validate: (fileList: FileList | File[] | undefined) => {
                  if (!fileList) return true;
                  const length = Array.isArray(fileList)
                    ? fileList.length
                    : (fileList as FileList).length;
                  if (length > 3) {
                    return "Maximum 3 fichiers autorisés";
                  }
                  return true;
                },
              })}
            />
            {isCardKanji === "basique" && (
              <div className="w-full flex flex-col gap-2">
                {allInJapanese ? null : (
                  <Checkbox
                    label="romanji"
                    title="Inclure les romanji"
                    handleChangeCheckboxAction={(e) =>
                      handleChangeCheckbox(e, "romanji")
                    }
                  />
                )}
                <Checkbox
                  label="kanji"
                  title="Inclure les kanji"
                  handleChangeCheckboxAction={(e) =>
                    handleChangeCheckbox(e, "kanji")
                  }
                />
                {kanji && (
                  <Checkbox
                    label="furigana"
                    title="Inclure les furigana"
                    handleChangeCheckboxAction={(e) =>
                      handleChangeCheckbox(e, "furigana")
                    }
                  />
                )}
                <Checkbox
                  label="japonais"
                  title="Tout en japonais (énoncés, questions, réponses)"
                  handleChangeCheckboxAction={(e) =>
                    handleChangeCheckbox(e, "japanese")
                  }
                />
              </div>
            )}
            <FormButtonSubmit
              isPending={isPending}
              isSubmitDisabled={isSubmitDisabled}
            />
          </form>

          <ButtonDisplayCard
            isCsvVisible={isCsvVisible}
            setIsCsvVisible={setIsCsvVisible}
            csvDataSuccess={csvDataSuccess}
          />
          <FooterForm />
        </div>

        {isCsvVisible && csvDataSuccess && (
          <CsvViewer
            setIsCsvVisible={setIsCsvVisible}
            csvFile={csvData}
            isCardKanji={isCardKanji ?? "basique"}
          />
        )}
      </div>

      {csvDataSuccess && (
        <CSVLink
          separator=","
          className="ds-btn ds-btn--success"
          data={csvData}
          style={{
            position: "fixed",
            bottom: 24,
            right: 24,
            zIndex: 50,
            boxShadow: "var(--shadow-md)",
          }}
        >
          <DownloadIcon />
          Télécharger le CSV
        </CSVLink>
      )}
    </>
  );
}

const DownloadIcon = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none"
       stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round"
       aria-hidden="true">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="7 10 12 15 17 10"/>
    <line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
);
