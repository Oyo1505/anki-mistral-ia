import { generateCardsAnkiParams } from "@/actions/mistral.action";
import { mistral } from "@/lib/mistral";
import { CardSchemaBase, CardSchemaKanji } from "@/schema/card.schema";
import { contentMistralRequest } from "@/utils/string/content-mistral-request";
import prompt from "@/utils/string/prompt";
import {
  DocumentURLChunk,
  ImageURLChunk,
  OCRResponse,
} from "@mistralai/mistralai/models/components";
import { logError } from "../logError";
type FileSource = File | Blob | MediaSource;
export class MistralData {
  static async parse({
    typeCard,
    textFromPdf,
    text,
    romanji,
    kanji,
    japanese,
    numberOfCards,
    level,
  }: generateCardsAnkiParams): Promise<
    string[][] | { error: string; status: number } | Error
  > {
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
        responseFormat:
          typeCard === "basique" ? CardSchemaBase : CardSchemaKanji,
        maxTokens: 10000,
      });
      console.log(response);
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
  }

  static async process({
    file,
    isPDF,
  }: {
    file: FileSource;
    isPDF?: Boolean;
  }): Promise<OCRResponse> {
    try {
      const fileBuffer = isPDF
        ? await (file as File).arrayBuffer()
        : await (file as Blob).arrayBuffer();
      const base64 = Buffer.from(fileBuffer).toString("base64");
      const mimeType = (file as Blob).type;
      const base64Url = isPDF
        ? `data:application/pdf;base64,${base64}`
        : `data:${mimeType};base64,${base64}`;
      const document: ImageURLChunk | DocumentURLChunk = isPDF
        ? {
            type: "document_url",
            documentUrl: base64Url,
          }
        : {
            type: "image_url",
            imageUrl: base64Url,
          };
      const ocrResponse = await mistral.ocr.process({
        model: "mistral-ocr-latest",
        document,
        includeImageBase64: isPDF ? false : true,
      });
      return ocrResponse;
    } catch (error) {
      logError(error, "MistralData.process");
      throw new Error("Error in PDF to text conversion.");
    }
  }
}
