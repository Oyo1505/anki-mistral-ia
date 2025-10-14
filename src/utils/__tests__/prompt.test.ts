import prompt, { PromptParams } from "../string/prompt";

describe("prompt", () => {
  it('returns basic prompt when typeCard is "basique" and both texts are provided', () => {
    const params: PromptParams = {
      typeCard: "basique",
      textFromPdf: "Texte PDF",
      text: "Texte Formulaire",
      numberOfCards: 1,
      level: "N5",
    };
    expect(prompt(params)).toBe(
      "Voici le texte des fichiers PDF ou d'une image à partir duquel tu dois générer les cartes anki : Texte PDF.\n" +
        "Voici le texte venant du formulaire à partir duquel tu dois générer les cartes anki voici les instructions : Texte Formulaire."
    );
  });

  it('returns basic prompt when typeCard is "basique" and only textFromPdf is provided', () => {
    const params: PromptParams = {
      typeCard: "basique",
      textFromPdf: "Texte PDF",
      numberOfCards: 1,
      level: "N5",
    };
    expect(prompt(params)).toBe(
      "Voici le texte des fichiers PDF ou d'une image à partir duquel tu dois générer les cartes anki : Texte PDF."
    );
  });

  it('returns basic prompt when typeCard is "basique" and only text is provided', () => {
    const params: PromptParams = {
      typeCard: "basique",
      text: "Texte Formulaire",
      numberOfCards: 1,
      level: "N5",
    };
    expect(prompt(params)).toBe(
      "Voici le texte venant du formulaire à partir duquel tu dois générer les cartes anki voici les instructions : Texte Formulaire."
    );
  });

  it('returns empty string when typeCard is "basique" and no text is provided', () => {
    const params: PromptParams = {
      typeCard: "basique",
      numberOfCards: 1,
      level: "N5",
    };
    expect(prompt(params)).toBe("");
  });

  it('returns kanji prompt when typeCard is not "basique" and both texts are provided', () => {
    const params: PromptParams = {
      typeCard: "kanji",
      textFromPdf: "Texte PDF",
      text: "Texte Formulaire",
      numberOfCards: 1,
      level: "N5",
    };
    expect(prompt(params)).toBe(
      "Fais des cartes avec des mots en KANJI, HIRAGANA pour apprendre les kanjis. les KATATANA sont interdits.\n" +
        "Voici le texte des fichiers PDF ou d'une image à partir duquel tu dois générer les cartes anki : Texte PDF.\n" +
        "Voici le texte venant du formulaire à partir duquel tu dois générer les cartes anki voici les instructions : Texte Formulaire."
    );
  });

  it('returns kanji prompt when typeCard is not "basique" and only textFromPdf is provided', () => {
    const params: PromptParams = {
      typeCard: "kanji",
      textFromPdf: "Texte PDF",
      numberOfCards: 1,
      level: "N5",
    };
    expect(prompt(params)).toBe(
      "Fais des cartes avec des mots en KANJI, HIRAGANA pour apprendre les kanjis. les KATATANA sont interdits.\n" +
        "Voici le texte des fichiers PDF ou d'une image à partir duquel tu dois générer les cartes anki : Texte PDF."
    );
  });

  it('returns kanji prompt when typeCard is not "basique" and only text is provided', () => {
    const params: PromptParams = {
      typeCard: "kanji",
      text: "Texte Formulaire",
      numberOfCards: 1,
      level: "N5",
    };
    expect(prompt(params)).toBe(
      "Fais des cartes avec des mots en KANJI, HIRAGANA pour apprendre les kanjis. les KATATANA sont interdits.\n" +
        "Voici le texte venant du formulaire à partir duquel tu dois générer les cartes anki voici les instructions : Texte Formulaire."
    );
  });

  it('returns kanji prompt when typeCard is not "basique" and no text is provided', () => {
    const params: PromptParams = {
      typeCard: "kanji",
      numberOfCards: 1,
      level: "N5",
    };
    expect(prompt(params)).toBe(
      "Fais des cartes avec des mots en KANJI, HIRAGANA pour apprendre les kanjis. les KATATANA sont interdits."
    );
  });
});
