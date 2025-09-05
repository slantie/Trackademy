// src/hooks/useUpload.jsx
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadData } from "../api/uploadService";

export const useUploadData = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uploadData,
    onSuccess: () => {
      // Invalidate and refetch relevant queries after successful upload
      queryClient.invalidateQueries({ queryKey: ["students"] });
      queryClient.invalidateQueries({ queryKey: ["faculty"] });
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
      queryClient.invalidateQueries({ queryKey: ["examResults"] });
      queryClient.invalidateQueries({ queryKey: ["attendance"] });
    },
  });
};
