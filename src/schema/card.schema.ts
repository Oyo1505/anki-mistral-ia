import { z } from "zod";

export const CardSchemaBase = z.array(
  z.object({
    recto: z
      .string()
      .describe(
        "tu peux faire des question de grammaire, des mots, des phrases, des expressions, des mots complexes, des questions a choix multiple. Ne pas faire les enoncés des questions en japonais sauf si l'utilisateur le demande mais tu peux des questions en japonais. Tu dois intergrer IMPERATIVEMENT les mots en KATAKANA et en HIRAGANA si tu en detectes, n'invente pas des mots en KATAKANA ou ne traduit pas les mots en KATAKANA si le mot à une origine en hiragana.",
      ),
    verso: z
      .string()
      .describe(
        "Soit preciser le mot en japonais, soit la phrase en japonais, soit la grammaire en japonais, soit la phrase en francais, soit l'expression en francais, soit le mot en francais. Tu dois intergrer IMPERATIVEMENT les mots en KATAKANA et en HIRAGANA si tu en detectes, n'invente pas des mots en KATAKANA ou ne traduit pas les mots en KATAKANA si le mot à une origine en hiragana.",
      ),
  }),
);

export type CardSchemaBaseType = z.infer<typeof CardSchemaBase>;

export const CardSchemaKanji = z.array(
  z.object({
    kanji: z
      .string()
      .describe(
        "le mot en KANJI OBLIGATOIREMENT, katakana interdit, hiragana interdit",
      ),
    traduction: z.string().describe("le mot original, en francais"),
    kunyomi: z
      .string()
      .describe(
        "la signification du kanji en KUNYOMI, katakana interdit, hiragana autorisé",
      ),
    onyomi: z
      .string()
      .describe(
        "la signification du kanji en ONYOMI, katakana autorisée, hiragana interdite",
      ),
    radical: z
      .string()
      .describe(
        "le radical principal du kanji (部首), avec son nom en japonais et sa signification en français, exemple : 氵(sanzui) = eau",
      ),
    keyKanji: z
      .string()
      .describe(
        "les clefs mnemonique pour retenir le kanji, katakana interdit, hiragana autorisé",
      ),
    exemples: z.string().describe("des exemples de phrases avec le kanji"),
  }),
);

export type CardSchemaKanjiType = z.infer<typeof CardSchemaKanji>;

export const CardSchemaKanjiCompose = z.array(
  z.object({
    mot: z
      .string()
      .describe(
        "le mot composé (熟語) en KANJI OBLIGATOIREMENT, 2 ou 3 kanji maximum, katakana interdit",
      ),
    lecture: z
      .string()
      .describe("la lecture du mot ENTIER en kana uniquement (hiragana)"),
    sens: z.string().describe("la traduction française courte du mot"),
    kanji1: z
      .string()
      .describe("le premier kanji du mot, doit apparaître dans le champ mot"),
    kanji1Sens: z.string().describe("le sens du premier kanji, en français"),
    kanji1Lectures: z
      .string()
      .describe(
        "les lectures du premier kanji au format 'ON デン' ou 'ON シャ / kun くるま', okurigana entre parenthèses comme か（く）",
      ),
    kanji2: z
      .string()
      .describe("le deuxième kanji du mot, doit apparaître dans le champ mot"),
    kanji2Sens: z.string().describe("le sens du deuxième kanji, en français"),
    kanji2Lectures: z
      .string()
      .describe(
        "les lectures du deuxième kanji au format 'ON デン' ou 'ON シャ / kun くるま'",
      ),
    kanji3: z
      .string()
      .describe(
        "le troisième kanji du mot si le mot en compte 3, sinon une chaîne vide. Ne jamais remplir si kanji2 est vide",
      ),
    kanji3Sens: z
      .string()
      .describe("le sens du troisième kanji, chaîne vide si kanji3 est vide"),
    kanji3Lectures: z
      .string()
      .describe(
        "les lectures du troisième kanji, chaîne vide si kanji3 est vide",
      ),
    autresComposes: z
      .string()
      .describe(
        "3 à 4 autres mots composés réutilisant un des kanji du mot, déjà connus si possible, au format '漢字（かな）traduction' séparés par ' · '",
      ),
    exemple: z
      .string()
      .describe(
        "une phrase d'exemple en japonais utilisant le mot, avec furigana au format 漢字[かな]. IMPÉRATIF : un espace (ou le début du champ) doit précéder chaque segment annoté, sinon le rendu Anki casse, exemple correct : '毎朝 電車[でんしゃ]で 会社[かいしゃ]に 行[い]きます。'",
      ),
    exempleTraduction: z
      .string()
      .describe("la traduction française de la phrase d'exemple"),
    indice: z
      .string()
      .describe(
        "un indice affiché au recto de la carte, au format 'N kanji · thème' (exemple '2 kanji · transport'). Ne doit JAMAIS contenir le mot ni donner la réponse",
      ),
    notes: z
      .string()
      .describe(
        "une note courte expliquant une irrégularité de lecture, un suffixe productif ou ce que la carte apporte. Ne doit pas être vide",
      ),
    production: z
      .string()
      .describe(
        "'y' pour générer une carte de production (saisie du mot), sinon une chaîne vide. Mettre 'y' par défaut sauf indication contraire",
      ),
  }),
);

export type CardSchemaKanjiComposeType = z.infer<typeof CardSchemaKanjiCompose>;
