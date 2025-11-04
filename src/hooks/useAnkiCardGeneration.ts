"use client";
import { generateAnswer } from "@/actions/mistral.action";
import { logError } from "@/lib/logError";
import { FormDataSchemaType } from "@/schema/form-schema";
import { fileProcessor } from "@/services/File-processor-service";
import { useState, useTransition } from "react";
import { UseFormReset, UseFormSetValue } from "react-hook-form";
import { toast } from "react-toastify";
import { useDisplayToast } from "./useDisplayToast";

export const useAnkiCardGeneration = (
  setValue: UseFormSetValue<FormDataSchemaType>,
  reset: UseFormReset<FormDataSchemaType>
) => {
  const [csvData, setCsvData] = useState<string[][]>([]);
  const [isPending, startTransition] = useTransition();
  const { displayToast } = useDisplayToast(setCsvData, reset);

  const generateCards = async (data: FormDataSchemaType) => {
    const toastId = toast.loading("En cours de génération", {
      autoClose: false,
    });

    try {
      let processedText = "";

      // Process file if present (restore OCR functionality)
      if (data.files?.[0]) {
        const convertResult = await fileProcessor.processFile(data.files[0]);

        if (convertResult) {
          processedText = convertResult;
          setValue("textFromPdf", processedText, { shouldValidate: true });
        }
      }

      // Generate answer with processed text
      const {
        data: dataRes,
        status,
        error,
        typeCard,
      } = await generateAnswer({
        ...data,
        ...(processedText &&
          processedText.length > 0 && { textFromPdf: processedText }),
      });

      // Use startTransition for UI updates only (non-async)
      startTransition(() => {
        displayToast({
          dataRes,
          status,
          error: error || null,
          id: toastId.toString(),
          typeCard,
        });
        toast.dismiss(toastId);
      });
    } catch (error) {
      logError(error, "generateCards");
      startTransition(() => {
        toast.dismiss(toastId);
        toast.error("Erreur lors de la génération des cartes");
      });
    }
  };

  return { csvData, isPending, generateCards };
};
