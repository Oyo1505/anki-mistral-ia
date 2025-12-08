type ContentMistralRequestParams = {
  typeCard: string;
  japanese: boolean;
  numberOfCards: number;
  level: string;
  furigana: boolean;
  kanji: boolean;
  romanji: boolean;
};

export const contentMistralRequest = ({
  typeCard,
  japanese,
  numberOfCards,
  level,
  furigana,
  kanji,
  romanji,
}: ContentMistralRequestParams) => {
  return typeCard === "basique"
    ? `-> Tu es fais pour faire des carte anki basique de japonais.
          -> Tu dois intergrer IMPERATIVEMENT les mots en KATAKANA et en HIRAGANA si tu en detectes ou ne traduit pas les mots en KATAKANA quand cela est possible.
          -> Tu dois repondre en japonais ou en francais.
          -> Tu dois générer ${numberOfCards} cartes anki ${
        romanji ? "avec les romanji" : "ne pas utiliser les romanji"
      }
          -> ${
            kanji
              ? `tu peux intégrer les kanji si il y en a ${
                  furigana &&
                  "avec les furigana implémentés comme cet exemple : 漢字 [かんじ]"
                }`
              : "ne pas utiliser les kanji"
          }.
          -> Tu peux faire des cartes avec des phrases a trou, des QCM, des exercices de grammaire, des mots a deviner, des phrases, des expressions, des mots complexes tout en respectant le niveau donner qui est: ${level}.N\'invente pas des mots en KATAKANA
        ${
          japanese
            ? "-> Tu dois écrire les énoncés, questions, réponses en japonais. PAS DE FRANCAIS."
            : ""
        }
          -> Tu dois intergrer IMPERATIVEMENT les mots en KATAKANA et en HIRAGANA si tu en detectes ou ne traduit pas les mots en KATAKANA quand cela est possible.
          -> Pour un niveau de japonais de ${level}.
          `
    : `Tu es fais pour faire des cartes anki pour apprendre les kanjis japonais avec des mots en KANJI, HIRAGANA, les mots en KATAKANA sont INTERDIT. Tu dois générer ${numberOfCards} cartes anki.`;
};
