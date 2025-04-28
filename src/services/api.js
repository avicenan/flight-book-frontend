import axios from "axios";

// Create base API instances for each service
const usersApi = axios.create({
  baseURL: "http://localhost:8001/api",
  headers: {
    "Content-Type": "application/json",
  },
});

const flightsApi = axios.create({
  baseURL: "http://localhost:8002/api",
  headers: {
    "Content-Type": "application/json",
  },
});

const bookingsApi = axios.create({
  baseURL: "http://localhost:8003/api",
  headers: {
    "Content-Type": "application/json",
  },
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
