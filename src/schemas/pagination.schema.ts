import { z } from "zod";

export const queryPaginationSchema = z.object({
  page: z.coerce.number().positive().optional(),
  limit: z.coerce.number().positive().optional(),
});
