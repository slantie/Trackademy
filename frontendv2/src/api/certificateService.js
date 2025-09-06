// src/api/certificateService.js
import apiClient from "./apiClient";
import { API_ENDPOINTS } from "../constants/apiEndpoints";

/**
 * Get all certificates for the current student
 * @returns {Promise} The API response containing certificates data
 */
export const getMyCertificates = async () => {
  const response = await apiClient.get(
    API_ENDPOINTS.CERTIFICATES.MY_CERTIFICATES
  );
  return response.data;
};

/**
 * Get a specific certificate by ID
 * @param {string} certificateId - The ID of the certificate
 * @returns {Promise} The API response containing certificate data
 */
export const getCertificateById = async (certificateId) => {
  const response = await apiClient.get(
    API_ENDPOINTS.CERTIFICATES.DETAILS(certificateId)
  );
  return response.data;
};

/**
 * Create a new certificate
 * @param {object} certificateData - The certificate data to be sent to the API
 * @returns {Promise} The API response for the created certificate
 */
export const createCertificate = async (certificateData) => {
  const response = await apiClient.post(
    API_ENDPOINTS.CERTIFICATES.LIST_CREATE,
    certificateData
  );
  return response.data;
};

/**
 * Create a new certificate with file upload
 * @param {FormData} formData - The form data containing certificate info and file
 * @returns {Promise} The API response for the created certificate
 */
export const createCertificateWithFile = async (formData) => {
  const response = await apiClient.post(
    API_ENDPOINTS.CERTIFICATES.UPLOAD,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

/**
 * Update an existing certificate
 * @param {string} certificateId - The ID of the certificate to update
 * @param {object} certificateData - The updated certificate data
 * @returns {Promise} The API response for the updated certificate
 */
export const updateCertificate = async (certificateId, certificateData) => {
  const response = await apiClient.patch(
    API_ENDPOINTS.CERTIFICATES.UPDATE(certificateId),
    certificateData
  );
  return response.data;
};

/**
 * Delete a certificate
 * @param {string} certificateId - The ID of the certificate to delete
 * @returns {Promise} The API response for the deletion
 */
export const deleteCertificate = async (certificateId) => {
  const response = await apiClient.delete(
    API_ENDPOINTS.CERTIFICATES.DELETE(certificateId)
  );
  return response.data;
};

/**
 * Get certificate statistics (faculty/admin only)
 * @returns {Promise} The API response containing certificate statistics
 */
export const getCertificateStats = async () => {
  const response = await apiClient.get(API_ENDPOINTS.CERTIFICATES.STATS);
  return response.data;
};

/**
 * Get certificates for a specific student (faculty/admin only)
 * @param {string} studentId - The ID of the student
 * @returns {Promise} The API response containing student certificates
 */
export const getStudentCertificates = async (studentId) => {
  const response = await apiClient.get(
    API_ENDPOINTS.CERTIFICATES.STUDENT_CERTIFICATES(studentId)
  );
  return response.data;
};
