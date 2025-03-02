import { z } from "zod";

export const CardSchema = z.array(
  z.object({
    japanese: z.string(),
    french: z.string(),
  }));

export type CardSchemaType = z.infer<typeof CardSchema>;