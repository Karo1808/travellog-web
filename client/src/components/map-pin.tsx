import type { ComponentPropsWithoutRef } from "react";

interface MapPinProps extends ComponentPropsWithoutRef<"svg"> {
  src: string;
  size: number;
}

function MapPin({ src, size, ...props }: MapPinProps) {
  const pinW = 24; // Lucide viewBox is always 0 0 24 24
  const viewH = 32; // a bit taller so the “tail” isn’t cut off

  return (
    <svg
      {...props}
      width={size}
      height={(size / pinW) * viewH}
      viewBox={`0 0 ${pinW} ${viewH}`}
      className="drop-shadow-lg"
    >
      <defs>
        <clipPath id="pin-clip">
          <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7z" />
        </clipPath>
      </defs>

      <image
        href={src}
        width={pinW}
        height={viewH}
        clipPath="url(#pin-clip)"
        preserveAspectRatio="xMidYMid slice"
      />

      <use
        href="#pin-clip"
        fill="none"
        strokeWidth="0.8"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

export default MapPin;
