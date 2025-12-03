import api from "../utils/axiosConfig";

export const sendProctorEvent = (sessionToken, eventBody) =>
  api.post("/proctor/event", eventBody, { headers: { "x-session-token": sessionToken }});
