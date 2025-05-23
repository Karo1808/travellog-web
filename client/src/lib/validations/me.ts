import { z } from "zod";

export const meResponseSchema = z.object({
  id: z.string(),
  username: z.string(),
  email: z.string().email(),
});

export type MeResponse = z.infer<typeof meResponseSchema>;
