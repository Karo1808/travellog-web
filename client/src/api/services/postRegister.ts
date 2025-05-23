import type { RegisterBase } from "@/lib/validations/register";
import apiClient from "../apiClient";

export const postRegister = async (body: RegisterBase) => {
  const result = await apiClient.post("/auth/register", body);

  return result;
};
