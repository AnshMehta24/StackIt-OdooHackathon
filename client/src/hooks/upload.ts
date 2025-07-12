import { uploadService } from "@/services/upload";
import type { SuccessResponse } from "@/types";
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";

export function useUploadFile(
  options?: UseMutationOptions<
    SuccessResponse<{
      filePath: string;
      fullUrl: string;
    }>,
    Error,
    FormData
  >
) {
  return useMutation({
    mutationKey: ["upload_file"],
    mutationFn: uploadService.uploadFileFromEditor,
    ...options,
  });
}
