export type PromptParams = {
  typeCard: string;
  textFromPdf?: string;
  text?: string;
  romanji?: boolean;
  furigana?: boolean;
  kanji?: boolean;
  japanese?: boolean;
  numberOfCards: number;
  level: string;
};

const basicPrompt = (textFromPdf?: string, text?: string) => {
  return [
    textFromPdf && textFromPdf.length > 0
      ? `Voici le texte des fichiers PDF ou d'une image à partir duquel tu dois générer les cartes anki : ${textFromPdf}.`
      : "",
    text && text.length > 0
      ? `Voici le texte venant du formulaire à partir duquel tu dois générer les cartes anki voici les instructions : ${text}.`
      : "",
  ]
    .filter(Boolean)
    .join("\n");
};

const prompt = ({ typeCard, textFromPdf, text }: PromptParams): string => {
  if (typeCard === "basique") {
    return basicPrompt(textFromPdf, text);
  } else if (typeCard === "kanji-compose") {
    return [
      "Fais des cartes de mots composés de kanji (熟語, jukugo) de 2 ou 3 kanji, avec la décomposition kanji par kanji, des exemples de phrases avec furigana, et des mots composés proches. les KATAKANA sont interdits sauf dans les traductions.",
      basicPrompt(textFromPdf, text),
    ]
      .filter(Boolean)
      .join("\n");
  } else {
    return [
      "Fais des cartes avec des mots en KANJI, HIRAGANA pour apprendre les kanjis. les KATATANA sont interdits.",
      basicPrompt(textFromPdf, text),
    ]
      .filter(Boolean)
      .join("\n");
  }
};

export default prompt;
