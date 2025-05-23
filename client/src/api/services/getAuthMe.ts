import { meResponseSchema } from "@/lib/validations/me";
import apiClient from "../apiClient";

export const getAuthMe = async () => {
  const result = await apiClient.get("/auth/me");

  return meResponseSchema.parse(result);
};
