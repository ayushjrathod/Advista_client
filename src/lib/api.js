import axios from "axios";
import { unwrapLambdaResponse } from "./lambdaResponse";

// Get API URL from environment or use default
const getApiUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl) return envUrl;
};

// Create axios instance with base URL from environment
const api = axios.create({
  baseURL: getApiUrl(),
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Enable credentials for CORS
});

// Unwrap Lambda Function URL envelope so callers get response.data as the actual body
api.interceptors.response.use((response) => {
  if (response?.data != null && typeof response.data === "object" && "body" in response.data && "statusCode" in response.data) {
    response.data = unwrapLambdaResponse(response.data);
  }
  return response;
});

// Logout function
export const logout = async () => {
  try {
    await api.post("/api/v1/auth/logout");
    // Redirect to sign-in page
    window.location.href = "/sign-in";
  } catch (error) {
    console.error("Logout error:", error);
    // Still redirect even if logout fails
    window.location.href = "/sign-in";
  }
};

export default api;
