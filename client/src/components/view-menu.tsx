import { locationOptions } from "@/api/queries/locationOptions";
import { useLocationStore } from "@/hooks/useLocationStore";
import { useMenuStore } from "@/hooks/useMenuStore";
import { formatPolishDate, splitTextToParagraphs } from "@/lib/utils";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import {
  CalendarIcon,
  EllipsisVerticalIcon,
  MapPinIcon,
  PencilIcon,
  SearchIcon,
  TrashIcon,
} from "lucide-react";
import { toast } from "sonner";
import { ScrollArea } from "./ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";

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
    <article className="h-full">
      <img
        src={imageUrl}
        alt={details}
        className="w-full rounded-t-md h-3/7 object-cover"
      />
      <section className="flex flex-col p-10 pl-12 gap-3 text-md flex-1">
        <div>
          <div className="flex justify-between align-start">
            <h1 className="font-semibold text-xl">{name}</h1>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant={"ghost"}
                  size={"sm"}
                  className="h-5 w-5 text-black/50 hover:text-black/80 hover:bg-transparent"
                >
                  <EllipsisVerticalIcon size={3} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="min-w-fit ml-20">
                <DropdownMenuItem className="w-full">
                  <SearchIcon className="size-3" /> Szukaj
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <PencilIcon className="size-3" /> Edytuj
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <TrashIcon className="size-3" /> Usuń
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
        <ScrollArea className="w-full pr-3 flex text-md text-foreground/90 mt-5">
          {paragraphs.map((p, i) => (
            <p key={i} className="mb-4 last:mb-0">
              {p}
            </p>
          ))}
        </ScrollArea>
      </section>
    </article>
  );
};

export default ViewMenu;
