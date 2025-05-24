import { locationResponseSchema } from "@/lib/validations/location";
import apiClient from "../apiClient";

export const getLocation = async (id: number) => {
  const result = await apiClient.get(`/locations/${id}`);

  const raw = locationResponseSchema.parse(result);

  if (!raw.imageUrl) return raw;

  const blob = await apiClient.get<Blob>(raw.imageUrl, undefined, {
    responseType: "blob",
  });

  const imgSrc = URL.createObjectURL(blob);

  return {
    ...raw,
    imageUrl: imgSrc,
  };
};
