import { create } from "zustand";

type Location = {
  name: string;
  details: string;
  address: string;
};

interface LocationState {
  location?: Location;
  setLocation: (loc?: Location) => void;
  currentLocationId?: number;
  setCurrentLocationId: (id: number) => void;
}

export const useLocationStore = create<LocationState>((set) => ({
  location: undefined,
  setLocation: (loc?: Location) => set({ location: loc }),
  currentLocationId: undefined,
  setCurrentLocationId: (id: number) => set({ currentLocationId: id }),
}));
