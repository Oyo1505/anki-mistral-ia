"use server";
import { logError } from "@/lib/logError";
import { mistral } from "@/lib/mistral";
import { CardSchemaBase, CardSchemaKanji } from "@/schema/card.schema";
import { FormDataSchemaType } from "@/schema/form-schema";
import { contentMistralRequest } from "@/utils/string/content-mistral-request";
import prompt from "@/utils/string/prompt";
import { revalidatePath } from "next/cache";

if (!process.env.MISTRAL_API_KEY && process.env.NODE_ENV === "production") {
  throw new Error("Mistral API configuration missing");
}
type generateCardsAnkiParams = {
  text?: string;
  level: string;
  romanji: boolean;
  kanji: boolean;
  numberOfCards: number;
  textFromPdf?: string;
  japanese: boolean;
  typeCard: string;
};

const generateCardsAnki = async ({
  text,
  level,
  romanji,
  kanji,
  numberOfCards = 5,
  textFromPdf,
  japanese,
  typeCard,
}: generateCardsAnkiParams): Promise<
  string[][] | { error: string; status: number } | Error
> => {
  try {
    const response = await mistral.chat.parse({
      model: "mistral-large-latest",
      temperature: 0.2,
      messages: [
        {
          role: "system",
          content: contentMistralRequest({
            typeCard,
            japanese,
            numberOfCards,
            level,
            kanji,
            romanji,
          }),
        },
        {
          role: "user",
          content: prompt({
            typeCard,
            textFromPdf,
            text,
            romanji,
            kanji,
            japanese,
            numberOfCards,
            level,
          }),
        },
      ],
      responseFormat: typeCard === "basique" ? CardSchemaBase : CardSchemaKanji,
      maxTokens: 10000,
    });

    const parsedResult = response?.choices?.[0]?.message?.parsed;

    if (!parsedResult) {
      throw new Error(
        "La réponse du modèle est vide ou n'a pas pu être parsée correctement."
      );
    }
    return parsedResult;
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

const getTextFromImage = async (file: Blob | MediaSource): Promise<string> => {
  try {
    const buffer = await (file as Blob).arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");
    const mimeType = (file as Blob).type;
    const base64Url = `data:${mimeType};base64,${base64}`;

    const ocrResponse = await mistral.ocr.process({
      model: "mistral-ocr-latest",
      document: {
        type: "image_url",
        imageUrl: base64Url,
      },
    });

    const cleanText = ocrResponse?.pages[0]?.markdown
      .replace(/\$\\rightarrow\$/g, "→")
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .join("\n");
    return cleanText;
  } catch (error) {
    logError(error, "getTextFromImage");
    throw new Error("Error in image to text conversion.");
  }
};

const getTextFromPDF = async (file: File): Promise<string> => {
  try {
    const fileBuffer = await file.arrayBuffer();
    const base64 = Buffer.from(fileBuffer).toString("base64");
    const base64Url = `data:application/pdf;base64,${base64}`;
    const ocrResponse = await mistral.ocr.process({
      model: "mistral-ocr-latest",
      document: {
        type: "document_url",
        documentUrl: base64Url,
      },
      includeImageBase64: true,
    });

    const cleanText = ocrResponse?.pages
      ?.map((page) => page.markdown)
      .filter((text) => text && !text.startsWith("!["))
      .join("\n")
      .replace(/\$\\rightarrow\$/g, "→")
      .replace(/\$\\Rightarrow\$/g, "→")
      .replace(/\$\\square\$/g, "_____")
      .replace(/\$\\qquad\$/g, "_____")
      .replace(/<br>/g, "\n")
      .replace(/#+\s/g, "")
      .replace(/\(.*?\)/g, "")
      .split("\n")
      .map((line) => line.trim())
      .filter(
        (line) =>
          line.length > 0 &&
          !line.startsWith("![") &&
          !line.match(/^[A-Za-z\s]+$/)
      )
      .join("\n");

    return cleanText;
  } catch (error) {
    logError(error, "getTextFromPDF");
    throw new Error("Error in PDF to text conversion.");
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
      kanji,
      textFromPdf,
      japanese,
      typeCard,
    } = data;
    const res = await generateCardsAnki({
      text,
      level,
      numberOfCards,
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

export { generateAnswer, generateCardsAnki, getTextFromImage, getTextFromPDF };
