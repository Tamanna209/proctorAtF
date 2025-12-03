// frontend/src/api/admin.js
import api from "../utils/axiosConfig";

// Verify admin passkey
export const verifyAdminPasskey = async (passkey) => {
  return api.post(`/admin/verify-passkey`, { passkey });
};

// Get all test results (requires admin token)
export const getTestResults = async (adminToken) => {
  return api.get(`/admin/results`, {
    headers: {
      Authorization: `Bearer ${adminToken}`,
    },
  });
};
