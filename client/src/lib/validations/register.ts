import { z } from "zod";

export const registerBaseSchema = z.object({
  username: z
    .string({ required_error: 'Nazwa użytkownika jest wymagana.' })
    .min(3, { message: 'Nazwa użytkownika musi mieć co najmniej 3 znaki.' })
    .regex(/^[a-zA-Z0-9_-]+$/, {
      message:
        'Nazwa użytkownika może zawierać tylko litery, cyfry, podkreślnik lub myślnik.',
    }),
  email: z
    .string({ required_error: 'Adres email jest wymagany.' })
    .email({ message: 'Nieprawidłowy adres email.' }),
  password: z
    .string({ required_error: 'Hasło jest wymagane.' })
    .min(6, { message: 'Hasło musi mieć co najmniej 6 znaków.' })
    .regex(/[a-z]/, { message: 'Hasło musi zawierać co najmniej jedną małą literę.' })
    .regex(/[A-Z]/, { message: 'Hasło musi zawierać co najmniej jedną wielką literę.' })
    .regex(/[0-9]/, { message: 'Hasło musi zawierać co najmniej jedną cyfrę.' })
    .regex(/[^a-zA-Z0-9]/, { message: 'Hasło musi zawierać co najmniej jeden znak specjalny.' }),
});

export type RegisterBase = z.infer<typeof registerBaseSchema>;

export const registerFormSchema = registerBaseSchema
  .extend({
    confirmPassword: z.string({ required_error: 'Potwierdź hasło jest wymagane.' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Hasła nie pasują do siebie.',
    path: ['confirmPassword'],
  });

export type RegisterFormValues = z.infer<typeof registerFormSchema>;
