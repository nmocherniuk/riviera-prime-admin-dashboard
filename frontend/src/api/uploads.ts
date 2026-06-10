import { api } from "./api";
import { getApiErrorMessage } from "./organizations";
import { commonContent } from "../content/common";

export type VehiclePhotoUploadResult = {
  url: string;
  path: string;
};

export async function uploadVehiclePhoto(
  file: File,
): Promise<VehiclePhotoUploadResult> {
  const formData = new FormData();
  formData.append("image", file);

  try {
    const { data } = await api.post<VehiclePhotoUploadResult>(
      "/uploads/vehicle-photo",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );
    return data;
  } catch (error) {
    throw new Error(
      getApiErrorMessage(error, commonContent.errors.uploadVehicleImage),
    );
  }
}
