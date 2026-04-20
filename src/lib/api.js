import axios from "axios";
import { unwrapLambdaResponse } from "./lambdaResponse";
import { getAuthToken } from "./firebase";

// Get API URL from environment or use default
const getApiUrl = () => {
  return import.meta.env.VITE_API_URL || "http://localhost:8000";
};

// Create axios instance with base URL from environment
const api = axios.create({
  baseURL: getApiUrl(),
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(async (config) => {
  let token = null;

  try {
    token = await getAuthToken();
  } catch (error) {
    console.warn("Skipping Firebase auth header:", error);
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else if (config.headers?.Authorization) {
    delete config.headers.Authorization;
  }

  return config;
});

// Unwrap Lambda Function URL envelope so callers get response.data as the actual body
api.interceptors.response.use((response) => {
  if (response?.data != null && typeof response.data === "object" && "body" in response.data && "statusCode" in response.data) {
    response.data = unwrapLambdaResponse(response.data);
  }
  return response;
});

export default api;
