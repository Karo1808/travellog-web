import { env } from "@/env";
import Map, { Marker, Popup, Source, type MapProps } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect } from "react";
import { useAuth } from "@/providers/auth";
import { useNavigate } from "@tanstack/react-router";
import { locationOptions } from "@/api/queries/locationOptions";
import { useSuspenseQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import MapPin from "./map-pin";
import { Box, Locate, MapPinIcon, Minus, Plus, Square } from "lucide-react";
import useMyMap from "@/hooks/useMyMap";
import Capsule from "./capsule";
import { Button } from "./ui/button";
import { useMediaQuery } from "react-responsive";

interface MyMapProps extends MapProps {}

function MyMap(props: MyMapProps) {
  const {
    hoveredPopup,
    dimension,
    onMapClick,
    onMarkerClick,
    onMarkerHover,
    onZoomClick,
    onChangeDimensionClick,
    viewState,
    onResetLocation,
    mapRef,
    setHoveredPopup,
    onMove,
  } = useMyMap();

  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const { data: locations, error } = useSuspenseQuery(
    locationOptions.locations(isAuthenticated),
  );

  const isMobile = useMediaQuery({ maxWidth: 1000 });

  useEffect(() => {
    if (error) {
      toast.error("Nie można wczytać twoich lokalizacji, odśwież stronę");
    }
  }, [error]);

  const handleAuth = () => {
    if (!isAuthenticated || !user?.id) {
      navigate({ to: "/auth/login" });
      return;
    }
  };

  return (
    <>
      <Map
        {...props}
        {...viewState}
        id="myMap"
        onMove={onMove}
        language="pl"
        attributionControl={false}
        mapboxAccessToken={env.VITE_MAPBOX_ACCESS_TOKEN}
        style={{
          width: isMobile ? "100vw" : "calc(100vw - 24px)",
          height: isMobile ? "100vh" : "calc(100vh - 24px)",
          zIndex: "1",
        }}
        doubleClickZoom={false}
        projection={"mercator"}
        mapStyle="mapbox://styles/karo1808/cmb6i9qxl00nc01qxdos970aa"
        terrain={{ source: "mapbox-dem", exaggeration: 1.5 }}
        ref={mapRef}
        onClick={(e) => {
          onMapClick(handleAuth, e);
        }}
        onLoad={({ target: map }) => {
          map.addLayer({
            id: "3d-buildings",
            source: "composite",
            "source-layer": "building",
            filter: ["==", "extrude", "true"],
            type: "fill-extrusion",
            minzoom: 15,
            paint: {
              "fill-extrusion-color": "#aaa",
              "fill-extrusion-height": ["get", "height"],
              "fill-extrusion-base": ["get", "min_height"],
              "fill-extrusion-opacity": 0.6,
            },
          });
        }}
      >
        <Source
          id="mapbox-dem"
          type="raster-dem"
          url="mapbox://mapbox.mapbox-terrain-dem-v1"
          tileSize={512}
          maxzoom={14}
        />
        {locations.map((location) => (
          <Marker
            key={location.id}
            latitude={location.latitude}
            anchor="bottom"
            longitude={location.longitude}
            offset={[0, 22]}
            onClick={({ originalEvent }) => {
              originalEvent.stopPropagation();
              onMarkerClick(location.latitude, location.longitude, location.id);
            }}
          >
            <MapPin
              className="z-10"
              src={location.imageUrl}
              size={64}
              onMouseEnter={() => {
                onMarkerHover(
                  location.latitude,
                  location.longitude,
                  location.name,
                  location.id,
                );
              }}
              onMouseLeave={() => {
                setHoveredPopup(null);
              }}
            />
          </Marker>
        ))}

        {hoveredPopup && (
          <Popup
            latitude={hoveredPopup.lat}
            longitude={hoveredPopup.lon}
            anchor="bottom"
            offset={[0, -65]}
            closeButton={false}
            style={{
              borderRadius: "50%",
            }}
            className="text-[13px] max-w-50"
          >
            <div className="flex gap-2">
              <MapPinIcon strokeWidth={2} size={20} className="text-primary" />
              <h2>{hoveredPopup.location}</h2>
            </div>
          </Popup>
        )}
        <div className="flex flex-col gap-5 bottom-7 right-7 lg:bottom-10 lg:right-10 fixed z-10 ">
          <Capsule>
            <Button
              onClick={() => {
                onZoomClick("in");
              }}
              className="rounded-t-md rounded-b-none border-b-1 border-accent hover:text-primary cursor-pointer [&_svg:not([class*='size-'])]:size-5"
              variant="ghost"
            >
              <Plus />
            </Button>
            <Button
              onClick={() => {
                onZoomClick("out");
              }}
              className="rounded-b-md rounded-t-none border-accent hover:text-primary cursor-pointer [&_svg:not([class*='size-'])]:size-5"
              variant="ghost"
            >
              <Minus />
            </Button>
          </Capsule>
          <Capsule>
            <Button
              className="rounded-t-md rounded-b-none border-b-1 border-accent hover:text-primary [&_svg:not([class*='size-'])]:size-5"
              variant="ghost"
              onClick={onChangeDimensionClick}
            >
              {dimension === "2d" ? <Box /> : <Square />}
            </Button>
            <Button
              className="rounded-b-md rounded-t-none border-accent hover:text-primary [&_svg:not([class*='size-'])]:size-5"
              variant="ghost"
              onClick={onResetLocation}
            >
              <Locate />
            </Button>
          </Capsule>
        </div>
      </Map>
    </>
  );
}

export default MyMap;
