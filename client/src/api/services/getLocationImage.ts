import apiClient from "../apiClient";

export const getLocationImage = async (id: number) => {
  const blob = await apiClient.get<Blob>(`/locations/image/${id}`, undefined, {
    responseType: "blob",
  });

  return { imageUrl: URL.createObjectURL(blob) };
};
