import {
  reverseGeocodeResponseSchema,
  type LatLon,
} from "@/lib/validations/geo";
import apiClient from "../apiClient";

export const postGeoCodeReverse = async (body: LatLon) => {
  const result = await apiClient.post("/geocode/reverse", body);

  return reverseGeocodeResponseSchema.parse(result);
};
