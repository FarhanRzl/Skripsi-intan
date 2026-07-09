import { z } from "zod";
import { areaInfoSchema } from "./areaInfoSchema";
import { structuresSchema } from "./structuresSchema";
import { photoSchema } from "./photoSchema";

// Re-export per-step schema -> dipakai untuk validasi "step ini aja"
export { areaInfoSchema, structuresSchema, photoSchema };

// Gabungan semua step -> dipakai untuk validasi final sebelum submit
export const fullSurveySchema = z.object({
  areaInfo: areaInfoSchema,
  structures: structuresSchema,
  photos: photoSchema.shape.photos,
});
