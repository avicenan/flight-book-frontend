import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { flightsApiService } from "../services/api";

const BookingPage = () => {
  const { flightId } = useParams();
  const [flight, setFlight] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [passengerName, setPassengerName] = useState("");
  const [passengerEmail, setPassengerEmail] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    flightsApiService
      .getById(flightId)
      .then((res) => {
        if (!res.data) throw new Error("Flight not found");
        setFlight(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [flightId]);

  const handleBooking = () => {
    flightsApiService
      .createBooking({
        passengerName,
        passengerEmail,
        flightId: flight.id,
        flightInfo: `${flight.from} ➔ ${flight.to} (${flight.airline_name})`,
      })
      .then(() => {
        alert("Booking successful!");
        navigate("/bookings");
      })
      .catch((err) => {
        alert("Failed to create booking: " + err.message);
      });
  };

  if (loading) return <p>Loading flight details...</p>;
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
        <p className="text-green-600 font-semibold">Rp{flight.price?.toLocaleString() || "N/A"}</p>
      </div>

      <div className="mt-4 flex flex-col gap-2">
        <input className="border p-2 rounded" type="text" placeholder="Passenger Name" value={passengerName} onChange={(e) => setPassengerName(e.target.value)} />
        <input className="border p-2 rounded" type="email" placeholder="Passenger Email" value={passengerEmail} onChange={(e) => setPassengerEmail(e.target.value)} />
        <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600" onClick={handleBooking}>
          Confirm Booking
        </button>
      </div>
    </div>
  );
};

export default BookingPage;
