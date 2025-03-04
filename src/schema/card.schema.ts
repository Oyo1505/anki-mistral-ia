import { z } from "zod";

export const CardSchema = z.array(
  z.object({
    recto: z.string().describe('tu peux faire des question de grammaire, des mots, des phrases, des expressions, des mots complexes, des questions a choix multiple. Ne pas faire les enoncés des questions en japonais sauf si l\'utilisateur le demande mais tu peux des questions en japonais.'),
    verso: z.string().describe('Soit preciser le mot en japonais, soit la phrase en japonais, soit la grammaire en japonais, soit la phrase en francais, soit l\'expression en francais, soit le mot en francais'),
  }));

export type CardSchemaType = z.infer<typeof CardSchema>;