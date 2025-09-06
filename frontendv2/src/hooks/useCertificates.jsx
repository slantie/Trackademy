// src/hooks/useCertificates.jsx
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getMyCertificates,
  getCertificateById,
  createCertificate,
  createCertificateWithFile,
  updateCertificate,
  deleteCertificate,
  getCertificateStats,
  getStudentCertificates,
} from "../api/certificateService";

const CERTIFICATE_QUERY_KEY = "certificates";

/**
 * Hook to get all certificates for the current student
 */
export const useGetMyCertificates = () => {
  return useQuery({
    queryKey: [CERTIFICATE_QUERY_KEY, "my"],
    queryFn: getMyCertificates,
  });
};

/**
 * Hook to get a specific certificate by ID
 */
export const useGetCertificate = (certificateId) => {
  return useQuery({
    queryKey: [CERTIFICATE_QUERY_KEY, certificateId],
    queryFn: () => getCertificateById(certificateId),
    enabled: !!certificateId,
  });
};

/**
 * Hook to create a new certificate
 */
export const useCreateCertificate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCertificate,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [CERTIFICATE_QUERY_KEY],
      });
    },
  });
};

/**
 * Hook to create a new certificate with file upload
 */
export const useCreateCertificateWithFile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCertificateWithFile,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [CERTIFICATE_QUERY_KEY],
      });
    },
  });
};

/**
 * Hook to update a certificate
 */
export const useUpdateCertificate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ certificateId, certificateData }) =>
      updateCertificate(certificateId, certificateData),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [CERTIFICATE_QUERY_KEY],
      });
      queryClient.invalidateQueries({
        queryKey: [CERTIFICATE_QUERY_KEY, variables.certificateId],
      });
    },
  });
};

/**
 * Hook to delete a certificate
 */
export const useDeleteCertificate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCertificate,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [CERTIFICATE_QUERY_KEY],
      });
    },
  });
};

/**
 * Hook to get certificate statistics (faculty/admin only)
 */
export const useGetCertificateStats = () => {
  return useQuery({
    queryKey: [CERTIFICATE_QUERY_KEY, "stats"],
    queryFn: getCertificateStats,
  });
};

/**
 * Hook to get certificates for a specific student (faculty/admin only)
 */
export const useGetStudentCertificates = (studentId) => {
  return useQuery({
    queryKey: [CERTIFICATE_QUERY_KEY, "student", studentId],
    queryFn: () => getStudentCertificates(studentId),
    enabled: !!studentId,
  });
};
