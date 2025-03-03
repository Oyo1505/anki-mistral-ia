import { z } from "zod";

export const FormDataSchema = z.object({
  level: z.string().min(1).default('N1'),
  numberOfCards: z.number().max(30, 'Le nombre de cartes ne peut pas dépasser 30'),
  files: z.array(z.instanceof(File)).refine(
    files => !files || files.every(file => file.size <= 5000000), 
    "Les fichiers ne doivent pas dépasser 5 MB"
  )
  .refine(
    files => !files || files.every(file => file.size >= 90000),
    "Les fichiers doivent faire au moins 90 KB pour une bonne qualité d'OCR"
  ).optional(),
  textFromPdf: z.string().optional(),
  text: z.string().optional(),
  csv: z.boolean().optional(),
  romanji: z.boolean().optional().default(false),
  kanji: z.boolean().optional().default(false)
})

export type FormDataSchemaType = z.infer<typeof FormDataSchema>;