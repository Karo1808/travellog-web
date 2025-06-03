import { useState } from "react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./ui/dialog";
import { EllipsisVerticalIcon, PencilIcon, TrashIcon } from "lucide-react";
import { useMenuStore } from "@/hooks/useMenuStore";
import { useMutation } from "@tanstack/react-query";
import { deleteLocation } from "@/api/services/deleteLocation";
import { useLocationStore } from "@/hooks/useLocationStore";
import { getContext } from "@/providers/react-query";
import { locationOptions } from "@/api/queries/locationOptions";
import { toast } from "sonner";

const Dropdown = () => {
  const [open, setOpen] = useState(false);

  const closeMenu = useMenuStore((state) => state.close);
  const setMode = useMenuStore((state) => state.setMode);

  const currentLocationId = useLocationStore(
    (state) => state.currentLocationId,
  );

  const mutation = useMutation({
    mutationFn: async (id: number) => {
      await deleteLocation(id);
    },
    onSuccess: () => {
      const { queryClient } = getContext();
      queryClient.invalidateQueries({
        queryKey: locationOptions.locations().queryKey,
      });
    },
    onError: (error: Error) => {
      toast.error("Usuwanie lokalizacji nie powiodło się");
      console.error(error);
    },
  });

  const handleConfirmDelete = () => {
    mutation.mutate(currentLocationId ?? 0);
    setOpen(false);
    closeMenu();
  };

  const handleEditClick = () => {
    setMode("edit");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DropdownMenu modal>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-5 w-5 text-black/50 hover:text-black/80 hover:bg-transparent"
          >
            <EllipsisVerticalIcon size={16} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="min-w-fit ml-20 z-100">
          <DropdownMenuItem onClick={handleEditClick}>
            <PencilIcon className="size-3" /> Edytuj
          </DropdownMenuItem>
          <DialogTrigger asChild>
            <DropdownMenuItem>
              <TrashIcon className="size-3" /> Usuń
            </DropdownMenuItem>
          </DialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      <DialogContent className="z-3000">
        <DialogHeader>
          <DialogTitle>Potwierdź usunięcie</DialogTitle>
          <DialogDescription>
            Czy na pewno chcesz usunąć ten element? Tej operacji nie da się
            cofnąć.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Anuluj
          </Button>
          <Button variant="destructive" onClick={handleConfirmDelete}>
            Usuń
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Dropdown;
