import { locationsArraySchema } from "@/lib/validations/location";
import apiClient from "../apiClient";

export const getLocations = async () => {
  const result = await apiClient.get("/locations");

  const raw = locationsArraySchema.parse(result);

  const withImages = await Promise.all(
    raw.map(async (location) => {
      if (!location.imageUrl) return location;

      const blob = await apiClient.get<Blob>(location.imageUrl, undefined, {
        responseType: "blob",
      });

      const imgSrc = URL.createObjectURL(blob);

      return {
        ...location,
        imageUrl: imgSrc,
      };
    }),
  );

  return withImages;
};
