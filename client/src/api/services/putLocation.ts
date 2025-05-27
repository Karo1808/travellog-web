import apiClient from "../apiClient";
import {
  locationResponseSchema,
  type EditLocation,
} from "@/lib/validations/location";

export const putLocation = async (body: EditLocation) => {
  const formData = new FormData();

  formData.append("Id", body.id.toString());
  formData.append("Journal", body.journal);
  formData.append("Date", body.date.toLocaleDateString());
  formData.append("Image", body.image, body.image.name);

  const result = await apiClient.put(`/locations/${body.id}`, formData);

  return locationResponseSchema.parse(result);
};
