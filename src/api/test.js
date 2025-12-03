import api from "../utils/axiosConfig";

export const startTestApi = (sessionToken) =>
  api.get("/test/start", { headers: { "x-session-token": sessionToken } });

export const submitTestApi = (sessionToken, payload) =>
  api.post("/test/submit", payload, {
    headers: { "x-session-token": sessionToken },
  });

export const checkAttemptApi = (sessionToken) =>
  api.get("/test/status", { headers: { "x-session-token": sessionToken } });
