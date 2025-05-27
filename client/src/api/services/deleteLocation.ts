import apiClient from "../apiClient";

export const deleteLocation = async (id: number) => {
  const result = await apiClient.delete(`/locations/${id}`);

  if (result === false) return false;
};
