import { contentMistralRequest } from "../string/content-mistral-request";

describe("content mistral request", () => {
  it("returns basic content for basique typeCard with kanji and romanji", () => {
    const result = contentMistralRequest({
      typeCard: "basique",
      japanese: true,
      numberOfCards: 5,
      level: "N5",
      kanji: true,
      romanji: true,
    });
    expect(result).toContain("Tu dois générer 5 cartes anki avec les romanji");
    expect(result).toContain("tu peux intégrer les kanji si il y en a");
    expect(result).toContain("Pour un niveau de japonais de N5");
    expect(result).toContain(
      "Tu dois écrire les énoncés, questions, réponses en japonais. PAS DE FRANCAIS."
    );
  });

  it("returns basic content for basique typeCard without kanji and romanji", () => {
    const result = contentMistralRequest({
      typeCard: "basique",
      japanese: false,
      numberOfCards: 3,
      level: "N4",
      kanji: false,
      romanji: false,
    });
    expect(result).toContain(
      "Tu dois générer 3 cartes anki ne pas utiliser les romanji"
    );
    expect(result).toContain("ne pas utiliser les kanji");
    expect(result).toContain("Pour un niveau de japonais de N4");
    expect(result).not.toContain(
      "Tu dois écrire les énoncés, questions, réponses en japonais. PAS DE FRANCAIS."
    );
  });

  it("returns kanji content for kanji typeCard", () => {
    const result = contentMistralRequest({
      typeCard: "kanji",
      japanese: false,
      numberOfCards: 2,
      level: "N3",
      kanji: true,
      romanji: false,
    });
    expect(result).toContain(
      "Tu es fais pour faire des cartes anki pour apprendre les kanjis japonais"
    );
    expect(result).toContain("Tu dois générer 2 cartes anki.");
    expect(result).toContain("les mots en KATAKANA sont INTERDIT");
  });

  it("returns correct content for basique typeCard with japanese=false", () => {
    const result = contentMistralRequest({
      typeCard: "basique",
      japanese: false,
      numberOfCards: 4,
      level: "N1",
      kanji: true,
      romanji: false,
    });
    expect(result).toContain(
      "Tu dois générer 4 cartes anki ne pas utiliser les romanji"
    );
    expect(result).toContain("tu peux intégrer les kanji si il y en a");
    expect(result).not.toContain(
      "Tu dois écrire les énoncés, questions, réponses en japonais. PAS DE FRANCAIS."
    );
    expect(result).toContain("Pour un niveau de japonais de N1");
  });

  it("returns correct content for basique typeCard with japanese=true", () => {
    const result = contentMistralRequest({
      typeCard: "basique",
      japanese: true,
      numberOfCards: 6,
      level: "N2",
      kanji: false,
      romanji: true,
    });
    expect(result).toContain("Tu dois générer 6 cartes anki avec les romanji");
    expect(result).toContain("ne pas utiliser les kanji");
    expect(result).toContain(
      "Tu dois écrire les énoncés, questions, réponses en japonais. PAS DE FRANCAIS."
    );
    expect(result).toContain("Pour un niveau de japonais de N2");
  });

  it("returns correct content for kanji typeCard with kanji=false", () => {
    const result = contentMistralRequest({
      typeCard: "kanji",
      japanese: true,
      numberOfCards: 7,
      level: "N4",
      kanji: false,
      romanji: true,
    });
    expect(result).toContain(
      "Tu es fais pour faire des cartes anki pour apprendre les kanjis japonais"
    );
    expect(result).toContain("Tu dois générer 7 cartes anki.");
    expect(result).toContain("les mots en KATAKANA sont INTERDIT");
  });
});
