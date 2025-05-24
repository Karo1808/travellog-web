import type { ComponentPropsWithoutRef } from "react";

interface MapPinProps extends ComponentPropsWithoutRef<"svg"> {
  src: string;
  size: number;
}

function MapPin({ src, size, ...props }: MapPinProps) {
  const pinW = 24;
  const viewH = 32;

  return (
    <svg
      {...props}
      width={size}
      height={(size / pinW) * viewH}
      viewBox={`0 0 ${pinW} ${viewH}`}
      className="drop-shadow-lg text-[#FAF9F7]"
    >
      <defs>
        <path
          id="pin-outline"
          d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7z"
        />

        <clipPath id="pin-clip">
          <use href="#pin-outline" />
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
        href="#pin-outline"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.7"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

export default MapPin;
