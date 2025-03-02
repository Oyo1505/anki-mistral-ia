import { z } from "zod";

export const FormDataSchema = z.object({
  level: z.string().min(1).default('N1'),
  numberOfCards: z.number().max(100),
  file: z.instanceof(File).optional(),
  text: z.string().min(1),
  csv: z.boolean().optional(),
  romanji: z.boolean().optional().default(false),
  kanji: z.boolean().optional().default(false)
});

export type FormDataSchemaType = z.infer<typeof FormDataSchema>;