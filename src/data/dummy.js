export const flights = [
  {
    id: 1,
    flight_code: "GA-123",
    airline_name: "Garuda Indonesia",
    departure_time: "2024-03-20T08:00:00",
    from: "Jakarta",
    to: "Bali",
    price: 1200000,
  },
  {
    id: 2,
    flight_code: "AK-456",
    airline_name: "AirAsia",
    departure_time: "2024-03-21T10:30:00",
    from: "Jakarta",
    to: "Singapore",
    price: 900000,
  },
  {
    id: 3,
    flight_code: "JT-789",
    airline_name: "Lion Air",
    departure_time: "2024-03-22T14:15:00",
    from: "Surabaya",
    to: "Jakarta",
    price: 700000,
  },
];

export const users = [
  { id: 1, name: "John Doe", email: "john.doe@example.com" },
  { id: 2, name: "Jane Smith", email: "jane.smith@example.com" },
  { id: 3, name: "Alex Johnson", email: "alex.johnson@example.com" },
  { id: 4, name: "Emily Brown", email: "emily.brown@example.com" },
  { id: 5, name: "Michael Davis", email: "michael.davis@example.com" },
];

export const bookings = [
  {
    id: 1,
    user_id: 1,
    flight_id: 1,
    ticket_quantity: 2,
    status: "confirmed",
    orderTime: "2024-03-15T10:30:00",
  },
  {
    id: 2,
    user_id: 2,
    flight_id: 2,
    ticket_quantity: 1,
    status: "pending",
    orderTime: "2024-03-14T15:45:00",
  },
  {
    id: 3,
    user_id: 3,
    flight_id: 3,
    ticket_quantity: 3,
    status: "cancelled",
    orderTime: "2024-03-13T09:15:00",
  },
];
