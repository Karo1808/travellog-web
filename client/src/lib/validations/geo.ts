import { z } from "zod";

export const LatLonSchema = z.object({
  lat: z
    .number({
      required_error: "Latitude is required",
      invalid_type_error: "Latitude must be a number",
    })
    .min(-90, "Latitude must be ≥ -90")
    .max(90, "Latitude must be ≤ 90"),

  lon: z
    .number({
      required_error: "Longitude is required",
      invalid_type_error: "Longitude must be a number",
    })
    .min(-180, "Longitude must be ≥ -180")
    .max(180, "Longitude must be ≤ 180"),
});

export type LatLon = z.infer<typeof LatLonSchema>;

export const reverseGeocodeResponseSchema = z.object({
  formatted: z.string(),
  name: z.string().nullable().optional(),
  placeType: z.array(z.string()).optional().nullable(),
  longitude: z.number(),
  latitude: z.number(),
});

export type ReverseGeocodeResponse = z.infer<
  typeof reverseGeocodeResponseSchema
>;
