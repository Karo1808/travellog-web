import {
  loginResponseSchema,
  type LoginBaseSchema,
} from "@/lib/validations/login";
import apiClient from "../apiClient";

export const postLogin = async (body: LoginBaseSchema) => {
  const result = await apiClient.post("/auth/login", body);

  return loginResponseSchema.parse(result);
};
