import { postGeoCodeReverse } from "@/api/services/postGeocodeReverse";
import type { LatLon } from "@/lib/validations/geo";
import { useCallback, useEffect, useRef, useState } from "react";
import type { MapMouseEvent, MapRef, ViewState } from "react-map-gl/mapbox";
import { useLocationStore } from "./useLocationStore";
import { useMenuStore } from "./useMenuStore";
import { getContext } from "@/providers/react-query";
import { locationOptions } from "@/api/queries/locationOptions";

const initialViewState: ViewState = {
  longitude: 10,
  latitude: 50,
  zoom: 2.5,
  pitch: 0,
  bearing: 0,
  padding: {},
};

const ZOOM_THRESHOLD = 16 as const;
const MAX_ZOOM_ON_CLICK = 16.5 as const;
const AUTO_PITCH = 60 as const;

const handleFly = ({ mapRef, lat, lon }: LatLon & { mapRef: MapRef }) => {
  mapRef.flyTo({
    zoom: MAX_ZOOM_ON_CLICK,
    center: [lon, lat],
    essential: true,
    pitch: AUTO_PITCH,
    curve: 1.5,
    speed: 1.5,
  });
};

const useMyMap = () => {
  const mapRef = useRef<MapRef>(null);

  const [viewState, setViewState] = useState<ViewState>(initialViewState);

  const [hoveredPopup, setHoveredPopup] = useState<
    (LatLon & { location: string; id: number }) | null
  >(null);

  const [dimension, setDimension] = useState<"3d" | "2d">("2d");

  const setLocation = useLocationStore((state) => state.setLocation);
  const setCurrentLocationId = useLocationStore(
    (state) => state.setCurrentLocationId,
  );

  const openMenu = useMenuStore((state) => state.open);
  const closeMenu = useMenuStore((state) => state.close);
  const setMenuMode = useMenuStore((state) => state.setMode);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    function handleZoomEnd() {
      const zoom = map!.getZoom();
      const pitch = map!.getPitch();

      const crossedUp = zoom >= ZOOM_THRESHOLD && pitch < AUTO_PITCH;
      const crossedDown = zoom < ZOOM_THRESHOLD && pitch > 0;

      if (crossedUp || crossedDown) {
        map!.flyTo({
          pitch: crossedUp ? AUTO_PITCH : 0,
          bearing: 0,
          duration: 1000,
        });

        setDimension(crossedUp ? "3d" : "2d");
      }
    }

    map.on("zoomend", handleZoomEnd);

    return () => {
      map.off("zoomend", handleZoomEnd);
    };
  }, [mapRef.current?.getZoom()]);

  const onMove = useCallback(({ viewState }: { viewState: ViewState }) => {
    setViewState(viewState);
  }, []);

  const onMapClick = useCallback(
    async (executeBefore: () => void, e: MapMouseEvent) => {
      executeBefore();

      if (!mapRef.current) return;
      const { lat, lng: lon } = e.lngLat;

      handleFly({ mapRef: mapRef.current, lat, lon });

      mapRef.current?.once("moveend", () => {
        setTimeout(() => {
          openMenu();
        }, 400);
      });

      const { details, address, name } = await postGeoCodeReverse({
        lat,
        lon,
      });

      setLocation({ address, details, name });
      setMenuMode("create");
    },
    [],
  );

  const onMarkerClick = useCallback(
    (
      lat: number,
      lon: number,
      locationId: number,
      executeAfter?: (id: number) => void,
    ) => {
      if (!mapRef.current) return;

      handleFly({ mapRef: mapRef.current, lat, lon });

      mapRef.current?.once("moveend", () => {
        executeAfter?.(hoveredPopup?.id ?? 0);
        closeMenu();
        openMenu();
      });

      setMenuMode("view");
      setCurrentLocationId(locationId);
      const { queryClient } = getContext();

      queryClient.prefetchQuery(locationOptions.location(locationId));
    },
    [],
  );

  const onMarkerHover = useCallback(
    (lat: number, lon: number, location: string, id: number) => {
      setHoveredPopup({ lat, lon, location, id });
    },
    [hoveredPopup],
  );

  const onZoomClick = (type: "in" | "out") => {
    const map = mapRef.current;
    if (!map) return;

    const newZoom = type === "in" ? viewState.zoom + 0.5 : viewState.zoom - 0.5;

    map.flyTo({
      center: { lat: viewState.latitude, lon: viewState.longitude },
      zoom: newZoom,
      duration: 300,
    });
  };

  const onChangeDimensionClick = () => {
    const map = mapRef.current;

    if (!map) return;

    if (dimension === "2d") {
      setDimension("3d");
      map.flyTo({
        center: { lat: viewState.latitude, lon: viewState.longitude },
        pitch: AUTO_PITCH,
        duration: 500,
      });

      return;
    }

    setDimension("2d");
    map.flyTo({
      center: { lat: viewState.latitude, lon: viewState.longitude },
      pitch: 0,
      duration: 500,
    });
  };

  const onResetLocation = () => {
    const map = mapRef.current;

    if (!map) return;

    map.flyTo({
      center: { lat: viewState.latitude, lon: viewState.longitude },
      zoom: initialViewState.zoom,
      pitch: 0,
      speed: 1.8,
    });
  };

  return {
    mapRef,
    viewState,
    hoveredPopup,
    dimension,
    setHoveredPopup,
    onMove,
    onMapClick,
    onMarkerHover,
    onMarkerClick,
    onZoomClick,
    onChangeDimensionClick,
    onResetLocation,
  };
};

export default useMyMap;
