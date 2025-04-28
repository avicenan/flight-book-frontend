import axios from "axios";

// Create base API instances for each service
const usersApi = axios.create({
  baseURL: "http://localhost:8001/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: false,
});

const flightsApi = axios.create({
  baseURL: "http://localhost:8002/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: false,
});

const bookingsApi = axios.create({
  baseURL: "http://localhost:8003/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: false,
});

// Add request interceptor for debugging
const addRequestInterceptor = (api) => {
  api.interceptors.request.use(
    (config) => {
      console.log("Request Config:", {
        url: config.url,
        method: config.method,
        headers: config.headers,
        data: config.data,
      });
      return config;
    },
    (error) => {
      console.error("Request Error:", error);
      return Promise.reject(error);
    }
  );
};

// Add response interceptor for debugging
const addResponseInterceptor = (api) => {
  api.interceptors.response.use(
    (response) => {
      console.log("Response:", response);
      return response;
    },
    (error) => {
      console.error("Response Error:", {
        message: error.message,
        response: error.response,
        request: error.request,
      });
      return Promise.reject(error);
    }
  );
};

// Add interceptors to all APIs
[usersApi, flightsApi, bookingsApi].forEach((api) => {
  addRequestInterceptor(api);
  addResponseInterceptor(api);
});

// Users API
export const usersApiService = {
  getAll: () => usersApi.get("/users"),
  getById: (id) => usersApi.get(`/users/${id}`),
  create: (data) => usersApi.post("/users", data),
  update: (id, data) => usersApi.put(`/users/${id}`, data),
  delete: (id) => usersApi.delete(`/users/${id}`),
};

// Flights API
export const flightsApiService = {
  getAll: () => flightsApi.get("/flights"),
  getById: (id) => flightsApi.get(`/flights/${id}`),
  create: (data) => flightsApi.post("/flights", data),
  update: (id, data) => flightsApi.put(`/flights/${id}`, data),
  delete: (id) => flightsApi.delete(`/flights/${id}`),
};

// Bookings API
export const bookingsApiService = {
  getAll: () => bookingsApi.get("/bookings"),
  getById: (id) => bookingsApi.get(`/bookings/${id}`),
  create: (data) => bookingsApi.post("/bookings", data),
  update: (id, data) => bookingsApi.put(`/bookings/${id}`, data),
  delete: (id) => bookingsApi.delete(`/bookings/${id}`),
  cancel: (id) => bookingsApi.put(`/bookings/${id}/cancel`),
};

export { usersApi, flightsApi, bookingsApi };
