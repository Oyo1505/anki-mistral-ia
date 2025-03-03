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
  ),
  textFromPdf: z.string().optional(),
  text: z.string().nonempty('Le texte ne peut pas être vide'),
  csv: z.boolean().optional(),
  romanji: z.boolean().optional().default(false),
  kanji: z.boolean().optional().default(false)
}).refine(
  data => (data.text && data.text.trim() !== '') || (data.files && data.files.length > 0), 
  {
    message: "Vous devez fournir soit du texte, soit au moins un fichier",
    path: ["text"]
  }
);


export type FormDataSchemaType = z.infer<typeof FormDataSchema>;