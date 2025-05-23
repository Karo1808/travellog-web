import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";
import type { ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--error-bg": "var(--popover)",
          "--error-text": "var(--destructive-foreground)",
          "--error-border": "var(--popover)",
          "--success-text": "var(--success-foreground)",
          "--success-bg": "var(--popover)",
          "--success-border": "var(--popover)",
        } as React.CSSProperties
      }
      toastOptions={{
        style: { fontSize: "15px" },
      }}
      {...props}
    />
  );
};

export { Toaster };
