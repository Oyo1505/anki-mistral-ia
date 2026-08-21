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
  if (typeCard === "kanji-compose") {
    return `-> Tu es fais pour faire des cartes anki au format "Composé kanji (jukugo)" pour apprendre des mots composés de 2 ou 3 kanji (熟語).
          -> Tu dois générer ${numberOfCards} mots composés, chacun avec 2 ou 3 kanji maximum, jamais plus.
          -> Les KATAKANA sont INTERDITS, sauf dans les traductions françaises.
          -> Chaque kanji du mot doit avoir son sens et ses lectures (ON en katakana, kun en hiragana) correctement renseignés.
          -> Le champ "autresComposes" doit réutiliser des mots déjà connus au niveau JLPT ${level} plutôt que d'introduire du vocabulaire hors-sujet.
          -> Le champ "exemple" doit contenir une phrase avec furigana au format 漢字[かな], en respectant IMPÉRATIVEMENT un espace avant chaque segment annoté, sinon le rendu Anki casse.
          -> Le champ "indice" ne doit jamais donner la réponse (ne pas répéter le mot).
          -> Pour un niveau de japonais de JLPT ${level}.`;
  }

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
          -> Tu peux faire des cartes avec des phrases a trou, des QCM, des exercices de grammaire, des mots a deviner, des phrases, des expressions, des mots complexes tout en respectant ou avec des exercices qu'on retrouve dans un test de JLPT le niveau donner qui est: JLPT ${level}.N\'invente pas des mots en KATAKANA
        ${
          japanese
            ? "-> Tu dois écrire les énoncés, questions, réponses en japonais. PAS DE FRANCAIS."
            : ""
        }
          -> Tu dois intergrer IMPERATIVEMENT les mots en KATAKANA et en HIRAGANA si tu en detectes ou ne traduit pas les mots en KATAKANA quand cela est possible.
          -> Pour un niveau de japonais de JLPT ${level}.
          `
    : `Tu es fais pour faire des cartes anki pour apprendre les kanjis japonais avec des mots en KANJI, HIRAGANA, les mots en KATAKANA sont INTERDIT. Tu dois générer ${numberOfCards} cartes anki.`;
};
