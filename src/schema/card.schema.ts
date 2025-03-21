import { z } from "zod";

export const CardSchemaBase = z.array(
  z.object({
    recto: z.string().describe('tu peux faire des question de grammaire, des mots, des phrases, des expressions, des mots complexes, des questions a choix multiple. Ne pas faire les enoncés des questions en japonais sauf si l\'utilisateur le demande mais tu peux des questions en japonais. Tu dois intergrer IMPERATIVEMENT les mots en KATAKANA et en HIRAGANA si tu en detectes, n\'invente pas des mots en KATAKANA ou ne traduit pas les mots en KATAKANA quand cela est possible..'),
    verso: z.string().describe('Soit preciser le mot en japonais, soit la phrase en japonais, soit la grammaire en japonais, soit la phrase en francais, soit l\'expression en francais, soit le mot en francais. Tu dois intergrer IMPERATIVEMENT les mots en KATAKANA et en HIRAGANA si tu en detectes, n\'invente pas des mots en KATAKANA ou ne traduit pas les mots en KATAKANA quand cela est possible.'),
  }));

export type CardSchemaBaseType = z.infer<typeof CardSchemaBase>;

export const CardSchemaKanji = z.array(
  z.object({
    word: z.string().describe('le mot original, en francais'),
    kanji: z.string().describe('le mot en KANJI OBLIGATOIREMENT, katakana interdit'),
    hiragana: z.string().describe('le mot en HIRAGANA OBLIGATOIREMENT'),
  }));

export type CardSchemaKanjiType = z.infer<typeof CardSchemaKanji>;