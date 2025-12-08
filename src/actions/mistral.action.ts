"use server";
import { MistralData } from "@/lib/data/mistral.data";
import { logError } from "@/lib/logError";
import { FormDataSchemaType } from "@/schema/form-schema";
import { revalidatePath } from "next/cache";

if (!process.env.MISTRAL_API_KEY && process.env.NODE_ENV === "production") {
  throw new Error("Mistral API configuration missing");
}
export type generateCardsAnkiParams = {
  text?: string;
  level: string;
  romanji: boolean;
  kanji: boolean;
  furigana: boolean;
  numberOfCards: number;
  textFromPdf?: string;
  japanese: boolean;
  typeCard: string;
};

const generateCardsAnki = async ({
  text,
  level,
  romanji,
  furigana,
  kanji,
  numberOfCards = 5,
  textFromPdf,
  japanese,
  typeCard,
}: generateCardsAnkiParams): Promise<
  string[][] | { error: string; status: number } | Error
> => {
  console.log("Generating cards with Mistral AI...", furigana);
  try {
    const response = await MistralData.parse({
      text,
      level,
      romanji,
      kanji,
      furigana,
      numberOfCards,
      textFromPdf,
      japanese,
      typeCard,
    });

    return response;
  } catch (error) {
    logError(error, "generateCardsAnki");
    return {
      error:
        error instanceof Error
          ? error.message
          : "Une erreur inconnue est survenue",
      status: 500,
    };
  }
};

const generateAnswer = async (
  data: FormDataSchemaType
): Promise<{
  data: string[][] | null;
  status: number;
  error?: string;
  typeCard?: string;
}> => {
  try {
    const {
      text,
      level,
      numberOfCards,
      romanji,
      furigana,
      kanji,
      textFromPdf,
      japanese,
      typeCard,
    } = data;
    const res = await generateCardsAnki({
      text,
      level,
      numberOfCards,
      furigana,
      romanji,
      kanji,
      textFromPdf,
      japanese,
      typeCard,
    });
    revalidatePath("/");

    if (typeof res === "object" && "status" in res && res.status === 500) {
      return {
        data: null,
        status: 500,
        error:
          "Une erreur est survenue dans la génération de la reponse. Veuillez réessayer.",
      };
    } else {
      return { data: res as string[][], status: 200, typeCard: typeCard };
    }
  } catch (error) {
    logError(error, "generateAnswer");
    return {
      data: null,
      status: 500,
      error:
        error instanceof Error
          ? error.message
          : "Une erreur inconnue est survenue",
    };
  }
};

export { generateAnswer, generateCardsAnki };
