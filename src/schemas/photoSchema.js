import { z } from "zod";

export const photoSchema = z.object({
  photos: z
    .array(
      z.object({
        id: z.string(),
        url: z.string(),
        caption: z.string().optional(),
      })
    )
    .min(1, "Minimal 1 foto area wajib diunggah"),
});
