import { z } from "zod";

export const CardSchemaBase = z.array(
  z.object({
    recto: z
      .string()
      .describe(
        "tu peux faire des question de grammaire, des mots, des phrases, des expressions, des mots complexes, des questions a choix multiple. Ne pas faire les enoncés des questions en japonais sauf si l'utilisateur le demande mais tu peux des questions en japonais. Tu dois intergrer IMPERATIVEMENT les mots en KATAKANA et en HIRAGANA si tu en detectes, n'invente pas des mots en KATAKANA ou ne traduit pas les mots en KATAKANA si le mot à une origine en hiragana."
      ),
    verso: z
      .string()
      .describe(
        "Soit preciser le mot en japonais, soit la phrase en japonais, soit la grammaire en japonais, soit la phrase en francais, soit l'expression en francais, soit le mot en francais. Tu dois intergrer IMPERATIVEMENT les mots en KATAKANA et en HIRAGANA si tu en detectes, n'invente pas des mots en KATAKANA ou ne traduit pas les mots en KATAKANA si le mot à une origine en hiragana."
      ),
  })
);

export type CardSchemaBaseType = z.infer<typeof CardSchemaBase>;

export const CardSchemaKanji = z.array(
  z.object({
    kanji: z
      .string()
      .describe(
        "le mot en KANJI OBLIGATOIREMENT, katakana interdit, hiragana interdit"
      ),
    traduction: z.string().describe("le mot original, en francais"),
    kunyomi: z
      .string()
      .describe(
        "la signification du kanji en KUNYOMI, katakana interdit, hiragana autorisé"
      ),
    keyKanji: z
      .string()
      .describe(
        "les clefs mnemonique pour retenir le kanji, katakana interdit, hiragana autorisé"
      ),
    exemples: z.string().describe("des exemples de phrases avec le kanji"),
  })
);

export type CardSchemaKanjiType = z.infer<typeof CardSchemaKanji>;
