import { z } from "zod";

export const structuresSchema = z
  .object({
    fixedStructures: z.array(z.number()).default([]),
    fixedStructuresNote: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    // id 5 = "Lainnya" -> wajib isi catatan
    if (data.fixedStructures.includes(5) && !data.fixedStructuresNote) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["fixedStructuresNote"],
        message: "Sebutkan struktur lainnya",
      });
    }
  });
