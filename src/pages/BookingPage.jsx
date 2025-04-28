import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { flightsApiService, bookingsApiService, usersApiService } from "../services/api";

const BookingPage = () => {
  const { flightId } = useParams();
  const [flight, setFlight] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState("");
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch flight details
    flightsApiService
      .getById(flightId)
      .then((res) => {
        if (!res.data) throw new Error("Flight not found");
        setFlight(res.data.data);
        setTotalPrice(res.data.data.price * ticketQuantity);
      })
      .catch((err) => {
        setError(err.message);
      });

    // Fetch users
    usersApiService
      .getAll()
      .then((res) => {
        if (!res.data) throw new Error("Failed to fetch users");
        setUsers(res.data.data);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [flightId]);

  const handleQuantityChange = (e) => {
    const newQuantity = parseInt(e.target.value);
    setTicketQuantity(newQuantity);
    if (flight) {
      setTotalPrice(flight.price * newQuantity);
    }
  };

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return "N/A";
    try {
      const date = new Date(dateTimeString);
      return date.toLocaleString("id-ID", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid date";
    }
  };

  const handleBooking = () => {
    if (!userId) {
      alert("Please select a user");
      return;
    }

    const bookingData = {
      user_id: userId,
      flight_id: flightId,
      ticket_quantity: Number(ticketQuantity),
    };

    bookingsApiService
      .create(bookingData)
      .then(() => {
        alert("Booking successful!");
        navigate("/bookings");
      })
      .catch((err) => {
        alert("Failed to create booking: " + err.message);
      });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!flight) return <p className="text-red-600">Flight not found</p>;

  return (
    <div className="p-8 pt-20 flex flex-col gap-4">
      <div className="">
        <button className="bg-white border border-gray-300 text-black px-4 py-2 rounded hover:bg-gray-200" onClick={() => navigate("/")}>
          Back
        </button>
      </div>
      <div className="bg-white rounded-lg shadow-lg p-4 border border-gray-400">
        <h2 className="text-2xl font-bold mb-2">
          {flight.airline_name} ({flight.flight_code})
        </h2>
        <p className="mb-2">
          {flight.from} ➔ {flight.to}
        </p>
        <p className="text-green-600 font-semibold mb-3">Departure Time: {formatDateTime(flight.departure_time)}</p>
        {flight.arrival_time && <p className="text-green-600 font-semibold mb-3">Arrival Time: {formatDateTime(flight.arrival_time)}</p>}
        <p className="text-lg font-semibold">Price per ticket: {flight.price ? `Rp${flight.price.toLocaleString()}` : "N/A"}</p>
      </div>

      <div className="mt-4 flex flex-col gap-2">
        <select className="border p-2 rounded" value={userId} onChange={(e) => setUserId(e.target.value)} required>
          <option value="">Select a user</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>

        <input className="border p-2 rounded" type="number" placeholder="Number of Tickets" value={ticketQuantity} onChange={handleQuantityChange} min="1" />
        <div className="text-lg font-semibold">Total Price: Rp{totalPrice.toLocaleString()}</div>
        <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 hover:cursor-pointer" onClick={handleBooking}>
          Confirm Booking
        </button>
      </div>
    </div>
  );
};

export default BookingPage;
