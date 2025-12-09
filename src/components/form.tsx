"use client";
import { useAnkiCardGeneration } from "@/hooks/useAnkiCardGeneration";
import { FormDataSchema, FormDataSchemaType } from "@/schema/form-schema";
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
  loading: () => <div>Chargement du visualiseur...</div>,
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
  // ✅ useCallback pour éviter la recréation de la fonction à chaque render
  const onSubmit = useCallback(
    async (data: FormDataSchemaType) => {
      await generateCards(data);
    },
    [generateCards]
  );

  // ✅ useCallback pour stabiliser la référence de la fonction
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
          className={`w-full ${
            isCsvVisible && "hidden"
          } border-2 p-4 border-white shadow-zinc-600 shadow-2xl rounded-md flex flex-col items-start justify-start gap-4 bg-white`}
        >
          <h1 className="text-xl w-full text-center font-bold">
            Générateur de cartes Anki (Basique)
          </h1>
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
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-2">
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
                label="cards"
                title="Nombre de cartes (max 15)"
                max={15}
                min={1}
                defaultValue={5}
                {...register("numberOfCards", { valueAsNumber: true })}
              />
              <SelectTypeCard register={register} />
            </div>
            <ButtonUpload
              setValueAction={setValue as UseFormSetValue<FormDataSchemaType>}
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
              <div className="w-full flex flex-col items-start justify-start">
                {allInJapanese ? null : (
                  <Checkbox
                    label="romanji"
                    title="Voulez-vous inclure les romanji ?"
                    handleChangeCheckboxAction={(e) =>
                      handleChangeCheckbox(e, "romanji")
                    }
                  />
                )}
                <Checkbox
                  label="kanji"
                  title="Voulez-vous inclure les kanji ?"
                  handleChangeCheckboxAction={(e) =>
                    handleChangeCheckbox(e, "kanji")
                  }
                />
                {kanji && (
                  <Checkbox
                    label="furigana"
                    title="Voulez-vous inclure les furigana ?"
                    handleChangeCheckboxAction={(e) =>
                      handleChangeCheckbox(e, "furigana")
                    }
                  />
                )}

                <Checkbox
                  label="japonais"
                  title="Tout en japonais (énoncés/questions/réponses) ?"
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
          <>
            <CsvViewer
              setIsCsvVisible={setIsCsvVisible}
              csvFile={csvData}
              isCardKanji={isCardKanji}
            />
          </>
        )}
      </div>
      {csvDataSuccess && (
        <>
          <CSVLink
            separator={","}
            className="fixed bottom-2 right-2 w-auto z-50  p-3 bg-green-500 text-white font-semibold rounded-md text-center cursor-pointer"
            data={csvData}
          >
            Télécharger le fichier CSV
          </CSVLink>
        </>
      )}
    </>
  );
}
