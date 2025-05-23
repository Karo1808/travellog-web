import { queryOptions } from "@tanstack/react-query";
import { getAuthMe } from "../services/getAuthMe";

export const authMeOptions = () => {
  return queryOptions({
    queryKey: ["auth", "me"],
    queryFn: () => getAuthMe(),
    retry: false,
  });
};
