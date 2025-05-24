import { cn } from "@/lib/utils";
import { DatePicker } from "./ui/date-picker";
import ImagePicker from "./image-picker";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Loader2, MapPin } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormMessage } from "./ui/form";
import { locationFormSchema } from "@/lib/validations/location";
import type {
  LocationForm,
  locationRequestSchema,
} from "@/lib/validations/location";
import { useMap } from "react-map-gl/mapbox";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { postLocation } from "@/api/services/postLocation";
import useDelayedSpinner from "@/hooks/useDelayedSpinner";
import { locationOptions } from "@/api/queries/locationOptions";
import { getContext } from "@/providers/react-query";
import { useRef } from "react";
import { useLocationStore } from "@/hooks/useLocationStore";
import { useMenuStore } from "@/hooks/useMenuStore";

const CreateMenu = () => {
  const location = useLocationStore((state) => state.location);
  const setCurrentLocationId = useLocationStore(
    (state) => state.setCurrentLocationId,
  );

  const closeMenu = useMenuStore((state) => state.close);
  const setMenuMode = useMenuStore((state) => state.setMode);

  const form = useForm<LocationForm>({
    resolver: zodResolver(locationFormSchema),
    defaultValues: {
      date: undefined,
      image: undefined,
      journal: "",
    },
  });

  const blobUrlRef = useRef<string | null>(null);

  if (form.getValues()?.image)
    blobUrlRef.current = URL.createObjectURL(form.getValues()?.image);
  const imageUrl = blobUrlRef.current;

  const mutation = useMutation({
    mutationKey: ["addLocation"],
    mutationFn: postLocation,
    onError: () => {
      toast.error("Lokalizacja nie została dodana");
    },
    onSuccess: async (newLocation) => {
      const { queryClient } = getContext();

      queryClient.setQueryData(
        locationOptions.location(newLocation.id).queryKey,
        { ...newLocation, imageUrl: imageUrl! },
      );

      queryClient.setQueryData(
        locationOptions.locations().queryKey,
        (old = []) => [...old, { ...newLocation, imageUrl: imageUrl! }],
      );

      queryClient.invalidateQueries({
        queryKey: locationOptions.locations().queryKey,
        refetchType: "inactive",
      });

      form.reset();

      setCurrentLocationId(newLocation.id);
      setMenuMode("view");
    },
    onSettled: () => {
      stopSpinner();
    },
  });

  const { showSpinner, startSpinner, stopSpinner } = useDelayedSpinner(500);

  const maps = useMap();
  const map = maps["myMap"];

  const onSubmit = async (values: LocationForm) => {
    startSpinner();

    const { lat, lng } = map!.getCenter();

    if (!location) return;

    const body: locationRequestSchema = {
      name: location?.name,
      details: location?.details,
      address: location?.address,
      date: values.date,
      image: values.image,
      journal: values.journal,
      latitude: lat,
      longitude: lng,
    };

    mutation.mutate(body);
  };

  if (!map) {
    toast.error("Mapa nie została załadowana");
    closeMenu();
    return;
  }

  return (
    <Form {...form}>
      <form
        className="relative h-full overflow-y-auto"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="text-[#333130] font-medium flex gap-6 flex-col items-start h-full">
          <div className="flex gap-2">
            <MapPin strokeWidth={2} className="text-primary" />
            <h2>{location?.details}</h2>
          </div>
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="w-full">
                <DatePicker
                  className={cn(
                    "bg-[#FAF9F7]",
                    form.formState.errors.date && "border-destructive",
                  )}
                  field={field}
                />
                <FormMessage className="text-destructive text-sm mt-1" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <ImagePicker
                  previewImage="/placeholder-2.jpg"
                  value={field.value}
                  onChange={field.onChange}
                  ref={field.ref}
                  name={field.name}
                />
                <FormMessage className="text-destructive text-sm mt-1" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="journal"
            render={({ field }) => (
              <FormItem className="w-full h-full">
                <Textarea
                  className={cn(
                    "h-full resize-none placeholder:text-foreground/60",
                    form.formState.errors.journal && "border-destructive",
                  )}
                  placeholder="Zapisz swoje notatki"
                  {...field}
                />
                <FormMessage className="text-destructive text-sm mt-1" />
              </FormItem>
            )}
          />
          <Button className="w-full justify-self-end">
            {showSpinner && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Dodaj wpis
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CreateMenu;
