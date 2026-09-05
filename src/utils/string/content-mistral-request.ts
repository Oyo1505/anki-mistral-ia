type ContentMistralRequestParams = {
  typeCard: string;
  japanese: boolean;
  numberOfCards: number;
  level: string;
  furigana: boolean;
  kanji: boolean;
  romanji: boolean;
};

const CARD_TYPE = {
  BASIQUE: "basique",
  KANJI_COMPOSE: "kanji-compose",
} as const;

export const contentMistralRequest = ({
  typeCard,
  japanese,
  numberOfCards,
  level,
  furigana,
  kanji,
  romanji,
}: ContentMistralRequestParams) => {
  if (typeCard === CARD_TYPE.KANJI_COMPOSE) {
    return `-> Tu es fait pour faire des cartes anki au format "Composé kanji (jukugo)" pour apprendre des mots composés de 2 ou 3 kanji (熟語).
          -> Tu dois générer ${numberOfCards} mots composés, chacun avec 2 ou 3 kanji maximum, jamais plus.
          -> Les KATAKANA sont INTERDITS, sauf dans les traductions françaises.
          -> Chaque kanji du mot doit avoir son sens et ses lectures (on en katakana, kun en hiragana) correctement renseignés.
          -> Le champ "autresComposes" doit réutiliser des mots déjà connus au niveau JLPT ${level} plutôt que d'introduire du vocabulaire hors-sujet.
          -> Le champ "exemple" doit contenir une phrase avec furigana au format 漢字[かな], en respectant IMPÉRATIVEMENT un espace avant chaque segment annoté, sinon le rendu Anki casse.
          -> Le champ "indice" ne doit jamais donner la réponse (ne pas répéter le mot).
          -> Pour un niveau de japonais de JLPT ${level}.`;
  }

  if (typeCard === CARD_TYPE.BASIQUE) {
    return `-> Tu es fait pour faire des cartes anki basiques de japonais, pour un niveau JLPT ${level}.
          -> Si le texte source contient des mots en KATAKANA ou en HIRAGANA, tu dois IMPÉRATIVEMENT les conserver et les intégrer aux cartes.
          -> Ne traduis pas inutilement les mots en KATAKANA (garde le mot d'origine) quand cela est possible, et n'invente jamais de mots en KATAKANA qui n'existent pas.
          -> Tu dois répondre en japonais ou en français.
          -> Tu dois générer ${numberOfCards} cartes anki ${
            romanji ? "avec les romanji" : "sans utiliser les romanji"
          }.
          -> ${
            kanji
              ? `tu peux intégrer les kanji si il y en a${
                  furigana
                    ? ", avec les furigana implémentés comme cet exemple : 漢字 [かんじ]"
                    : ""
                }`
              : "ne pas utiliser les kanji"
          }.
          -> Tu peux faire des cartes avec des phrases à trous, des QCM, des exercices de grammaire, des mots à deviner, des phrases, des expressions ou des mots complexes, en respectant le type d'exercices qu'on retrouve dans un test JLPT du niveau donné qui est : JLPT ${level}.
          ${
            japanese
              ? "-> Tu dois écrire les énoncés, questions, réponses en japonais. PAS DE FRANCAIS."
              : ""
          }`;
  }

  return `-> Tu es fait pour faire des cartes anki pour apprendre les kanjis japonais.
          -> Tu dois générer ${numberOfCards} cartes anki, avec des mots en KANJI et en HIRAGANA. Les mots en KATAKANA sont INTERDITS.
          -> Pour chaque kanji, précise son sens, ses lectures (on en katakana, kun en hiragana), son radical principal et des exemples de phrases.
          -> Pour un niveau de japonais de JLPT ${level}.`;
};
