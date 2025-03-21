import { z } from "zod";

export const FormDataSchema = z.object({
  level: z.string().min(1).default('N1'),
  numberOfCards: z.number().max(15, 'Le nombre de cartes ne peut pas dépasser 30'),
  files: z.array(z.instanceof(File)).refine(
    files => !files || files.every(file => file.size <= 5000000), 
    "Les fichiers ne doivent pas dépasser 5 MB"
  )
  .refine(
    files => !files || files.every(file => file.size >= 20000),
    "Les fichiers doivent faire au moins 20 KB pour une bonne qualité d'OCR"
  ).optional(),
  textFromPdf: z.string().optional(),
  text: z.string().max(5000, 'Le texte ne doit pas dépasser 15000 caractères').optional(),
  csv: z.boolean().optional(),
  romanji: z.boolean().optional().default(false),
  kanji: z.boolean().optional().default(false),
  japanese: z.boolean().optional().default(false),
  typeCard: z.string().optional().default('basique')
})

export type FormDataSchemaType = z.infer<typeof FormDataSchema>;