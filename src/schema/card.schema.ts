import { z } from "zod";

export const CardSchema = z.array(
  z.object({
    recto: z.string().describe('tu peux faire des question de grammaire, des mots, des phrases, des expressions, des mots complexes. Ne pas poser des questions en japonais'),
    verso: z.string().describe('Soit preciser le mot en japonais, soit la phrase en japonais, soit la grammaire en japonais, soit la phrase en francais, soit l\'expression en francais, soit le mot en francais'),
  }));

export type CardSchemaType = z.infer<typeof CardSchema>;