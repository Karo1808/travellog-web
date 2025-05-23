import { locationResponseSchema } from "@/lib/validations/location";
import apiClient from "../apiClient";

export const getLocation = async (id: number) => {
  const result = await apiClient.get(`/location/${id}`);

  return locationResponseSchema.parse(result);
};
