import { z } from "zod";

export const locationFormSchema = z.object({
  date: z
    .date({
      required_error: "Data jest wymagana",
      invalid_type_error: "Niepoprawna data",
    })
    .max(new Date(), { message: "Data nie może być w przyszłości" }),

  image: z
    .custom<File>((v) => v instanceof File, { message: "Dodaj zdjęcie" })
    .refine((file) => file.size <= 5 * 1024 * 1024, {
      message: "Plik musi być mniejszy niż 5 MB",
    })
    .refine(
      (file) => ["image/jpeg", "image/png", "image/webp"].includes(file.type),
      { message: "Dozwolone formaty: JPG, PNG, WEBP" },
    ),
  journal: z
    .string()
    .min(1, "Notatka jest wymagana")
    .max(1000, "Maksymalnie 1000 znaków"),
});

export const locationRequestSchema = locationFormSchema.extend({
  name: z
    .string({ required_error: "Nazwa jest wymagana" })
    .min(1, { message: "Nazwa nie może być pusta" }),
  details: z
    .string({ required_error: "Dłuższa nazwa jest wymagana" })
    .min(1, { message: "Dłuższa Nazwa nie może być pusta" }),
  address: z
    .string({ required_error: "Adres jest wymagany" })
    .min(1, { message: "Adres nie może być pusta" }),
  latitude: z
    .number({ required_error: "Szerokość geograficzna jest wymagana" })
    .min(-90, { message: "Szerokość geograficzna musi być ≥ -90" })
    .max(90, { message: "Szerokość geograficzna musi być ≤ 90" }),
  longitude: z
    .number({ required_error: "Długość geograficzna jest wymagana" })
    .min(-180, { message: "Długość geograficzna musi być ≥ -180" })
    .max(180, { message: "Długość geograficzna musi być ≤ 180" }),
});

export type locationRequestSchema = z.infer<typeof locationRequestSchema>;

export type LocationForm = z.infer<typeof locationFormSchema>;

export const locationResponseSchema = z.object({
  id: z.number().int({ message: "Id musi być liczbą całkowitą" }),
  name: z
    .string({ required_error: "Nazwa jest wymagana" })
    .min(1, { message: "Nazwa nie może być pusta" }),
  details: z
    .string({ required_error: "Dłuższa nazwa jest wymagana" })
    .min(1, { message: "Dłuższa Nazwa nie może być pusta" }),
  address: z
    .string({ required_error: "Adres jest wymagany" })
    .min(1, { message: "Adres nie może być pusta" }),
  imageUrl: z.string(),
  journal: z.string({ required_error: "Dziennik jest wymagany" }),
  date: z
    .string({ required_error: "Data jest wymagana" })
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Nieprawidłowy format daty",
    })
    .transform((val) => new Date(val)),
  latitude: z
    .number({ required_error: "Szerokość geograficzna jest wymagana" })
    .min(-90, { message: "Szerokość geograficzna musi być ≥ -90" })
    .max(90, { message: "Szerokość geograficzna musi być ≤ 90" }),
  longitude: z
    .number({ required_error: "Długość geograficzna jest wymagana" })
    .min(-180, { message: "Długość geograficzna musi być ≥ -180" })
    .max(180, { message: "Długość geograficzna musi być ≤ 180" }),
});

export type LocationResponse = z.infer<typeof locationResponseSchema>;

export const locationsArraySchema = z.array(locationResponseSchema);

export type LocationsArray = z.infer<typeof locationsArraySchema>;
