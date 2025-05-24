import { queryOptions } from "@tanstack/react-query";
import { getLocations } from "@/api/services/getLocations";
import { getLocation } from "@/api/services/getLocation";

export const locationOptions = {
  locations: (isAuthenticated?: boolean) =>
    queryOptions({
      queryKey: ["locations"],
      queryFn: () => getLocations(),
      enabled: Boolean(isAuthenticated),
    }),
  location: (id: number) =>
    queryOptions({
      queryKey: ["locations", id],
      queryFn: () => getLocation(id),
    }),
};
