import { z } from "zod";

// areaSunExposureId wajib diisi -> ini yang dulu kena 422 karena
// input komponennya belum ada di form versi Svelte
export const areaInfoSchema = z
  .object({
    areaSunExposureId: z
      .number({ required_error: "Paparan sinar matahari wajib dipilih" })
      .nullable()
      .refine((val) => val !== null, {
        message: "Paparan sinar matahari wajib dipilih",
      }),
    gardenCount: z
      .number({ required_error: "Jumlah taman wajib diisi" })
      .min(1, "Minimal 1 taman"),
    gardenEntranceAccessNote: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (
      data.gardenCount > 1 &&
      (!data.gardenEntranceAccessNote || data.gardenEntranceAccessNote.trim() === "")
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["gardenEntranceAccessNote"],
        message: "Catatan akses wajib diisi jika taman lebih dari 1",
      });
    }
  });
