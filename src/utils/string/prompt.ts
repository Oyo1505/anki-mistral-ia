export type PromptParams = {
  typeCard: string;
  textFromPdf?: string;
  text?: string;
  romanji?: boolean;
  kanji?: boolean;
  japanese?: boolean;
  numberOfCards: number;
  level: string;
};

const promptBasique = (textFromPdf?: string, text?: string) => {
  return [
    textFromPdf && textFromPdf.length > 0 ? `Voici le texte des fichiers PDF ou d'une image à partir duquel tu dois générer les cartes anki : ${textFromPdf}.` : '',
    text && text.length > 0 ? `Voici le texte venant du formulaire à partir duquel tu dois générer les cartes anki voici les instructions : ${text}.` : '',
  ].filter(Boolean).join('\n');
}

const prompt = ({
  typeCard,
  textFromPdf,
  text,
}: PromptParams): string => {
  if (typeCard === 'basique') {
    return promptBasique(textFromPdf, text);
  } else  {
    return [
      'Fais des cartes avec des mots en KANJI, HIRAGANA pour apprendre les kanjis. les KATATANA sont interdits.',
      promptBasique(textFromPdf, text),
    ].filter(Boolean).join('\n');
    }
  };

export default prompt;