import { locationOptions } from "@/api/queries/locationOptions";
import { useLocationStore } from "@/hooks/useLocationStore";
import { useMenuStore } from "@/hooks/useMenuStore";
import { formatPolishDate, splitTextToParagraphs } from "@/lib/utils";
import { useSuspenseQuery } from "@tanstack/react-query";
import { CalendarIcon, MapPinIcon } from "lucide-react";
import { toast } from "sonner";
import Dropdown from "./dropdown";

const ViewMenu = () => {
  const currentLocationId = useLocationStore(
    (state) => state.currentLocationId,
  );

  const closeMenu = useMenuStore((state) => state.close);

  if (!currentLocationId) return;

  const { data, error } = useSuspenseQuery(
    locationOptions.location(currentLocationId),
  );

  if (error) {
    toast.error("Nie znaleziono lokalizacji");
    closeMenu();

    return;
  }

  const { name, imageUrl, details, address, date, journal } = data!;

  const paragraphs = splitTextToParagraphs(journal, 3);

  return (
    <article className="h-[82vh] lg:h-full flex flex-col min-h-0">
      <img
        src={imageUrl}
        alt={details}
        className="w-full rounded-t-md h-3/7 object-cover"
      />
      <section className="flex flex-col min-h-0 p-7 lg:p-10 lg:pl-12 gap-3 text-md">
        <div>
          <div className="flex justify-between align-start">
            <h1 className="font-semibold text-xl">{name}</h1>
            <Dropdown />
          </div>
          <div className="text-xs flex gap-1 items-center mt-[11px]">
            <MapPinIcon size={15} className="text-primary" />
            <p className="text-foreground/90">{address}</p>
          </div>
        </div>
        <div className="text-xs flex gap-2 items-center">
          <CalendarIcon size={15} className="text-primary" />
          <p className="text-foreground/90">
            {`Odwiedzone dnia, ${formatPolishDate(date, { format: "long" })}`}
          </p>
        </div>
        <div className="w-full pr-3 h-full text-md text-foreground/90 mt-5 overflow-y-auto">
          {paragraphs.map((p, i) => (
            <p key={i} className="mb-4 last:mb-0">
              {p}
            </p>
          ))}
        </div>
      </section>
    </article>
  );
};

export default ViewMenu;
