import api from "../utils/axiosConfig";

// backend expects POST /api/auth/register to create user + send OTP
export const sendOtp = (payload) => api.post("/auth/register", payload);
export const verifyOtp = (payload) => api.post("/auth/verify-otp", payload);
export const createSession = (payload) =>
  api.post("/auth/create-session", payload);
