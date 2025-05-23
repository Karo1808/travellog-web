import { Button } from "./ui/button";
import { Popover, PopoverAnchor, PopoverContent } from "./ui/popover";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface MenuProps {
  isOpen: boolean;
  onClose: () => void;
  buttonClass?: string;
  children: React.ReactNode;
}

const Menu = ({
  isOpen = false,
  onClose,
  buttonClass,
  children,
}: MenuProps) => {
  return (
    <Popover open={isOpen} onOpenChange={onClose}>
      <PopoverAnchor asChild>
        <div aria-hidden className="fixed top-205 right-30 z-50 min-w-max" />
      </PopoverAnchor>
      <PopoverContent side="right" align="end" className="w-120 h-[80vh] p-10">
        <Button
          variant="ghost"
          className={cn(
            "absolute top-3 right-3 w-6 h-6 p-1 rounded-sm hover:bg-gray-100 text-fg/50 [&_svg:not([class*='size-'])]:size-5 ",
            buttonClass,
          )}
          onClick={onClose}
          type="button"
        >
          <X />
        </Button>
        {children}
      </PopoverContent>
    </Popover>
  );
};

export default Menu;
