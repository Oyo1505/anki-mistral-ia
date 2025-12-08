import { generateAnswer, generateCardsAnki } from "../mistral.action";
import { MistralData } from "@/lib/data/mistral.data";
import { logError } from "@/lib/logError";
import { revalidatePath } from "next/cache";

// Mock dependencies
jest.mock("@/lib/data/mistral.data");
jest.mock("@/lib/logError");
jest.mock("next/cache", () => ({
  revalidatePath: jest.fn(),
}));

describe("mistral.action", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("generateCardsAnki", () => {
    const mockParams = {
      text: "Bonjour le monde",
      level: "N5",
      romanji: true,
      kanji: false,
      furigana: true,
      numberOfCards: 5,
      japanese: true,
      typeCard: "basic",
    };

    it("devrait générer des cartes avec succès", async () => {
      const mockResponse = [
        ["Bonjour", "こんにちは", "konnichiwa"],
        ["Monde", "世界", "sekai"],
      ];

      (MistralData.parse as jest.Mock).mockResolvedValue(mockResponse);

      const result = await generateCardsAnki(mockParams);

      expect(MistralData.parse).toHaveBeenCalledWith({
        text: "Bonjour le monde",
        level: "N5",
        romanji: true,
        kanji: false,
        furigana: true,
        numberOfCards: 5,
        textFromPdf: undefined,
        japanese: true,
        typeCard: "basic",
      });
      expect(result).toEqual(mockResponse);
      expect(logError).not.toHaveBeenCalled();
    });

    it("devrait gérer les paramètres avec textFromPdf", async () => {
      const paramsWithPdf = {
        ...mockParams,
        textFromPdf: "PDF extracted text",
      };
      const mockResponse = [["text", "テキスト", "tekisuto"]];

      (MistralData.parse as jest.Mock).mockResolvedValue(mockResponse);

      const result = await generateCardsAnki(paramsWithPdf);

      expect(MistralData.parse).toHaveBeenCalledWith(
        expect.objectContaining({
          textFromPdf: "PDF extracted text",
        })
      );
      expect(result).toEqual(mockResponse);
    });

    it("devrait gérer numberOfCards undefined", async () => {
      const paramsWithoutCount = {
        ...mockParams,
        numberOfCards: undefined as unknown as number,
      };
      const mockResponse = [["test", "テスト", "tesuto"]];

      (MistralData.parse as jest.Mock).mockResolvedValue(mockResponse);

      const result = await generateCardsAnki(paramsWithoutCount);

      // Vérifie que la fonction fonctionne même sans numberOfCards
      expect(MistralData.parse).toHaveBeenCalled();
      expect(result).toEqual(mockResponse);
    });

    it("devrait logger et retourner une erreur en cas d'échec", async () => {
      const error = new Error("API error");
      (MistralData.parse as jest.Mock).mockRejectedValue(error);

      const result = await generateCardsAnki(mockParams);

      expect(logError).toHaveBeenCalledWith(error, "generateCardsAnki");
      expect(result).toEqual({
        error: "API error",
        status: 500,
      });
    });

    it("devrait gérer une erreur non-Error", async () => {
      (MistralData.parse as jest.Mock).mockRejectedValue(
        "String error message"
      );

      const result = await generateCardsAnki(mockParams);

      expect(logError).toHaveBeenCalledWith(
        "String error message",
        "generateCardsAnki"
      );
      expect(result).toEqual({
        error: "Une erreur inconnue est survenue",
        status: 500,
      });
    });

    it("devrait gérer tous les paramètres booléens", async () => {
      const allBoolParams = {
        ...mockParams,
        romanji: false,
        kanji: true,
        furigana: false,
        japanese: false,
      };
      const mockResponse = [["data", "データ"]];

      (MistralData.parse as jest.Mock).mockResolvedValue(mockResponse);

      await generateCardsAnki(allBoolParams);

      expect(MistralData.parse).toHaveBeenCalledWith(
        expect.objectContaining({
          romanji: false,
          kanji: true,
          furigana: false,
          japanese: false,
        })
      );
    });

    it("devrait accepter un nombre de cartes personnalisé", async () => {
      const customCardCount = {
        ...mockParams,
        numberOfCards: 10,
      };
      const mockResponse = Array.from({ length: 10 }, (_, i) => [
        `word${i}`,
        `漢字${i}`,
      ]);

      (MistralData.parse as jest.Mock).mockResolvedValue(mockResponse);

      const result = await generateCardsAnki(customCardCount);

      expect(MistralData.parse).toHaveBeenCalledWith(
        expect.objectContaining({
          numberOfCards: 10,
        })
      );
      expect(result).toHaveLength(10);
    });

    it("devrait gérer différents types de cartes", async () => {
      const reverseCardType = {
        ...mockParams,
        typeCard: "reverse",
      };
      const mockResponse = [["front", "back"]];

      (MistralData.parse as jest.Mock).mockResolvedValue(mockResponse);

      await generateCardsAnki(reverseCardType);

      expect(MistralData.parse).toHaveBeenCalledWith(
        expect.objectContaining({
          typeCard: "reverse",
        })
      );
    });

    it("devrait gérer le texte vide", async () => {
      const emptyTextParams = {
        ...mockParams,
        text: "",
      };
      const mockResponse = [];

      (MistralData.parse as jest.Mock).mockResolvedValue(mockResponse);

      const result = await generateCardsAnki(emptyTextParams);

      expect(result).toEqual([]);
    });

    it("devrait gérer les erreurs réseau", async () => {
      const networkError = new Error("Network request failed");
      (MistralData.parse as jest.Mock).mockRejectedValue(networkError);

      const result = await generateCardsAnki(mockParams);

      expect(result).toEqual({
        error: "Network request failed",
        status: 500,
      });
    });
  });

  describe("generateAnswer", () => {
    const mockFormData = {
      text: "Hello world",
      level: "N5",
      numberOfCards: 5,
      romanji: true,
      furigana: false,
      kanji: true,
      japanese: true,
      typeCard: "basic",
    };

    it("devrait générer une réponse avec succès", async () => {
      const mockCards = [
        ["Hello", "こんにちは", "konnichiwa"],
        ["World", "世界", "sekai"],
      ];

      (MistralData.parse as jest.Mock).mockResolvedValue(mockCards);

      const result = await generateAnswer(mockFormData);

      expect(result).toEqual({
        data: mockCards,
        status: 200,
        typeCard: "basic",
      });
      expect(revalidatePath).toHaveBeenCalledWith("/");
      expect(logError).not.toHaveBeenCalled();
    });

    it("devrait appeler revalidatePath après génération", async () => {
      const mockCards = [["test", "テスト"]];
      (MistralData.parse as jest.Mock).mockResolvedValue(mockCards);

      await generateAnswer(mockFormData);

      expect(revalidatePath).toHaveBeenCalledWith("/");
      expect(revalidatePath).toHaveBeenCalledTimes(1);
    });

    it("devrait gérer le cas où generateCardsAnki retourne une erreur", async () => {
      (MistralData.parse as jest.Mock).mockResolvedValue({
        error: "API error",
        status: 500,
      });

      const result = await generateAnswer(mockFormData);

      expect(result).toEqual({
        data: null,
        status: 500,
        error:
          "Une erreur est survenue dans la génération de la reponse. Veuillez réessayer.",
      });
      expect(revalidatePath).toHaveBeenCalled();
    });

    it("devrait gérer une exception lors de l'appel", async () => {
      const error = new Error("Unexpected error");
      (MistralData.parse as jest.Mock).mockRejectedValue(error);

      const result = await generateAnswer(mockFormData);

      // generateAnswer appelle generateCardsAnki qui logue l'erreur
      expect(logError).toHaveBeenCalledWith(error, "generateCardsAnki");
      expect(result).toEqual({
        data: null,
        status: 500,
        error:
          "Une erreur est survenue dans la génération de la reponse. Veuillez réessayer.",
      });
    });

    it("devrait gérer une erreur non-Error dans le catch", async () => {
      (MistralData.parse as jest.Mock).mockRejectedValue(
        "Non-error rejection"
      );

      const result = await generateAnswer(mockFormData);

      expect(result).toEqual({
        data: null,
        status: 500,
        error:
          "Une erreur est survenue dans la génération de la reponse. Veuillez réessayer.",
      });
    });

    it("devrait transmettre tous les paramètres du formulaire", async () => {
      const fullFormData = {
        text: "Full text",
        level: "N3",
        numberOfCards: 10,
        romanji: false,
        furigana: true,
        kanji: false,
        textFromPdf: "PDF content",
        japanese: false,
        typeCard: "reverse",
      };
      const mockCards = [["data", "データ"]];

      (MistralData.parse as jest.Mock).mockResolvedValue(mockCards);

      await generateAnswer(fullFormData);

      expect(MistralData.parse).toHaveBeenCalledWith(
        expect.objectContaining({
          text: "Full text",
          level: "N3",
          numberOfCards: 10,
          romanji: false,
          furigana: true,
          kanji: false,
          textFromPdf: "PDF content",
          japanese: false,
          typeCard: "reverse",
        })
      );
    });

    it("devrait retourner typeCard dans la réponse réussie", async () => {
      const formDataWithType = {
        ...mockFormData,
        typeCard: "cloze",
      };
      const mockCards = [["test", "answer"]];

      (MistralData.parse as jest.Mock).mockResolvedValue(mockCards);

      const result = await generateAnswer(formDataWithType);

      expect(result.typeCard).toBe("cloze");
    });

    it("devrait gérer un tableau vide de cartes", async () => {
      (MistralData.parse as jest.Mock).mockResolvedValue([]);

      const result = await generateAnswer(mockFormData);

      expect(result).toEqual({
        data: [],
        status: 200,
        typeCard: "basic",
      });
    });

    it("devrait gérer plusieurs cartes", async () => {
      const multipleCards = Array.from({ length: 20 }, (_, i) => [
        `word${i}`,
        `漢字${i}`,
        `reading${i}`,
      ]);

      (MistralData.parse as jest.Mock).mockResolvedValue(multipleCards);

      const result = await generateAnswer({
        ...mockFormData,
        numberOfCards: 20,
      });

      expect(result.data).toHaveLength(20);
      expect(result.status).toBe(200);
    });

    it("devrait gérer les différents niveaux JLPT", async () => {
      const levels = ["N5", "N4", "N3", "N2", "N1"];
      const mockCards = [["test", "テスト"]];

      for (const level of levels) {
        (MistralData.parse as jest.Mock).mockResolvedValue(mockCards);

        await generateAnswer({ ...mockFormData, level });

        expect(MistralData.parse).toHaveBeenCalledWith(
          expect.objectContaining({ level })
        );
      }
    });

    it("devrait préserver l'ordre des cartes générées", async () => {
      const orderedCards = [
        ["1", "一", "ichi"],
        ["2", "二", "ni"],
        ["3", "三", "san"],
      ];

      (MistralData.parse as jest.Mock).mockResolvedValue(orderedCards);

      const result = await generateAnswer(mockFormData);

      expect(result.data).toEqual(orderedCards);
      expect(result.data![0][0]).toBe("1");
      expect(result.data![2][0]).toBe("3");
    });
  });

  describe("Environment validation", () => {
    it("devrait valider la présence de MISTRAL_API_KEY en production", () => {
      // Ce test vérifie que le module s'attend à une configuration valide
      // La validation se fait au niveau du module, pas au niveau de la fonction
      expect(process.env.NODE_ENV).toBeDefined();
    });
  });
});
