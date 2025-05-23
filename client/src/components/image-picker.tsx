import { cn } from "@/lib/utils";
import {
  forwardRef,
  useRef,
  useEffect,
  useState,
  type InputHTMLAttributes,
  type ChangeEvent,
} from "react";
import { Upload } from "lucide-react";

export interface ImagePickerProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "value" | "onChange" | "type"
  > {
  value: File | null;
  onChange: (file: File | null) => void;
  previewImage: string;
}

const ImagePicker = forwardRef<HTMLInputElement, ImagePickerProps>(
  ({ value, onChange, onBlur, name, previewImage, ...inputProps }, ref) => {
    const hiddenInput = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState<string>(previewImage);

    useEffect(() => {
      if (value) {
        const url = URL.createObjectURL(value);
        setPreview(url);
        return () => URL.revokeObjectURL(url);
      }
      setPreview(previewImage);
    }, [value, previewImage]);

    const openFileDialog = () => hiddenInput.current?.click();

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0] ?? null;
      onChange(file);
    };

    return (
      <div
        className={cn(
          "relative group cursor-pointer w-full h-full",
          inputProps["aria-invalid"] && "border border-destructive rounded-md",
        )}
        onClick={openFileDialog}
      >
        <img
          src={preview}
          alt="Preview"
          className="rounded-md object-cover w-full h-full"
        />
        <div className="absolute inset-0 rounded-md flex items-end gap-2 p-4 bg-black/0 transition-colors group-hover:bg-black/30">
          <span className="text-white text-sm opacity-0 group-hover:opacity-100">
            Dodaj zdjęcie
          </span>
          <Upload className="text-white opacity-0 group-hover:opacity-100" />
        </div>
        <input
          type="file"
          accept="image/*"
          ref={(node) => {
            if (typeof ref === "function") ref(node);
            else if (ref) ref.current = node;
            hiddenInput.current = node;
          }}
          name={name}
          onBlur={onBlur}
          onChange={handleFileChange}
          className="hidden"
          {...inputProps}
        />
      </div>
    );
  },
);

ImagePicker.displayName = "ImagePicker";
export default ImagePicker;
