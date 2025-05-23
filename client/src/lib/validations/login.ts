import { z } from "zod";

export const loginBaseSchema = z.object({
  email: z.string().email({ message: "Nieprawidłowy adres email." }),
  password: z
    .string()
    .max(128, { message: "Hasło nie może mieć więcej niż 128 znaków" }),
});

export type LoginBaseSchema = z.infer<typeof loginBaseSchema>;

export const loginResponseSchema = z.object({
  token: z.string(),
});
