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
import type { EditLocation, LocationForm } from "@/lib/validations/location";
import { useMap } from "react-map-gl/mapbox";
import { toast } from "sonner";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import useDelayedSpinner from "@/hooks/useDelayedSpinner";
import { locationOptions } from "@/api/queries/locationOptions";
import { getContext } from "@/providers/react-query";
import { useEffect, useRef } from "react";
import { useLocationStore } from "@/hooks/useLocationStore";
import { useMenuStore } from "@/hooks/useMenuStore";
import { putLocation } from "@/api/services/putLocation";

const EditMenu = () => {
  const currentLocationId = useLocationStore(
    (state) => state.currentLocationId,
  );

  if (!currentLocationId) return;

  const { data: location } = useSuspenseQuery(
    locationOptions.location(currentLocationId),
  );

  const closeMenu = useMenuStore((state) => state.close);
  const setMenuMode = useMenuStore((state) => state.setMode);

  const form = useForm<LocationForm>({
    resolver: zodResolver(locationFormSchema),
    defaultValues: {
      date: location.date,
      image: undefined,
      journal: location.journal,
    },
  });

  const blobUrlRef = useRef<string | null>(null);

  if (form.getValues()?.image)
    blobUrlRef.current = URL.createObjectURL(form.getValues()?.image);
  const imageUrl = blobUrlRef.current;

  useEffect(() => {
    if (!location.imageUrl) return;

    (async () => {
      try {
        const res = await fetch(location.imageUrl);
        if (!res.ok) throw new Error("Image fetch failed");
        const blob = await res.blob();

        const file = new File([blob], "current-image.jpg", { type: blob.type });

        const dt = new DataTransfer();
        dt.items.add(file);

        form.setValue("image", dt.files[0], { shouldValidate: true });

        blobUrlRef.current = URL.createObjectURL(file);
      } catch (err) {
        console.error(err);
      }
    })();
  }, [location]);

  const mutation = useMutation({
    mutationFn: async (body: EditLocation) => await putLocation(body),
    onError: () => {
      toast.error("Lokalizacja nie została edytowana");
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

    if (!location) return;

    const body: EditLocation = {
      id: currentLocationId,
      date: values.date,
      image: values.image,
      journal: values.journal,
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
                  previewImage={location.imageUrl}
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
            Edytuj wpis
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EditMenu;
