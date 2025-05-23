import { queryOptions } from "@tanstack/react-query";
import { getLocations } from "@/api/services/getLocations";
import { getLocation } from "@/api/services/getLocation";
import { postLocation } from "../services/postLocation";
import { getContext } from "@/providers/react-query";

export const locationOptions = {
  locations: () =>
    queryOptions({
      queryKey: ["locations"],
      queryFn: () => getLocations(),
    }),
  location: (id: number) =>
    queryOptions({
      queryKey: ["locations", id],
      queryFn: () => getLocation(id),
    }),
};

const { queryClient } = getContext();

queryClient.setMutationDefaults(["addLocation"], {
  mutationFn: postLocation,
  onSuccess: (newLocation) => {
    queryClient.setQueryData(
      locationOptions.location(newLocation.id).queryKey,
      newLocation,
    );

    queryClient.invalidateQueries({
      queryKey: locationOptions.locations().queryKey,
    });
  },
});
