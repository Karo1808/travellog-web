import type { ContentProps } from "vaul";
import { cva, type VariantProps } from "class-variance-authority";
import MyDrawer from "./my-drawer";

const menuVariants = cva(
  "relative group/drawer-content bg-background fixed z-50 flex h-full flex-col sm:max-h-[90dvh]max-h-[90vh]",
  {
    variants: {
      variant: {
        create: "p-10",
        view: "p-0 border-0",
      },
    },
  },
);

type MenuVariant = VariantProps<typeof menuVariants>["variant"];

interface MobileMenuProps extends ContentProps {
  children: React.ReactNode;
  className?: string;
  menuVariant: MenuVariant;
  thumbClassName?: string;
}

const MobileMenu = ({
  children,
  menuVariant,
  thumbClassName,
  className,
  ...props
}: MobileMenuProps) => {
  return (
    <MyDrawer
      menuVariant={menuVariant}
      thumbClassName={thumbClassName}
      {...props}
    >
      {children}
    </MyDrawer>
  );
};

export default MobileMenu;
