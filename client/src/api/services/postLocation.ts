import apiClient from "../apiClient";
import {
  locationResponseSchema,
  type locationRequestSchema,
} from "@/lib/validations/location";

export const postLocation = async (body: locationRequestSchema) => {
  const formData = new FormData();

  formData.append("Name", body.name);
  formData.append("Details", body.details);
  formData.append("Address", body.address);
  formData.append("Journal", body.journal);
  formData.append("Date", body.date.toLocaleDateString());
  formData.append("Latitude", body.latitude.toString());
  formData.append("Longitude", body.longitude.toString());
  formData.append("Image", body.image, body.image.name);

  const result = await apiClient.post("/locations", formData);

  return locationResponseSchema.parse(result);
};
