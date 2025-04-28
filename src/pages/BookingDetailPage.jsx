import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { bookingsApiService, flightsApiService, usersApiService } from "../services/api";

function BookingDetailPage() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [flight, setFlight] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await bookingsApiService.getById(bookingId);
        setBooking(response.data.data);
        const flightResponse = await flightsApiService.getById(response.data.data.flight_id);
        setFlight(flightResponse.data.data);
        setLoading(false);
        const userResponse = await usersApiService.getById(response.data.data.user_id);
        // console.log(userResponse.data.data.email, "INII BANG");
        setUser(userResponse.data.data);
      } catch (err) {
        setError("Failed to fetch booking details");
        setLoading(false);
        console.error(err);
      }
    };

    fetchBooking();
  }, [bookingId]);

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return date.toLocaleString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="p-8 pt-20">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error || !booking || !flight) {
    return (
      <div className="p-8 pt-20">
        <h1 className="text-2xl font-bold mb-4">Booking Not Found</h1>
        <p>The booking you're looking for doesn't exist.</p>
      </div>
    );
  }

  return (
    <div className="p-8 pt-20">
      <div className="">
        <button className="mb-2 bg-white border border-gray-300 text-black px-4 py-2 rounded hover:bg-gray-200" onClick={() => navigate("/bookings")}>
          Back
        </button>
        <h1 className="text-2xl font-bold mb-6">Booking Details</h1>
        <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-400">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Passenger Information</h2>
            <div className="space-y-2">
              <p>
                <span className="font-medium">Name:</span> {user?.name}
              </p>
              <p>
                <span className="font-medium">Email:</span> {user?.email}
              </p>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Flight Information</h2>
            <div className="space-y-2">
              <p>
                <span className="font-medium">Flight Code:</span> {flight.flight_code}
              </p>
              <p>
                <span className="font-medium">Airline:</span> {flight.airline_name}
              </p>
              <p>
                <span className="font-medium">Route:</span> {flight.from} → {flight.to}
              </p>
              <p>
                <span className="font-medium">Departure Time:</span> {formatDateTime(flight.departure_time)}
              </p>
              <p>
                <span className="font-medium">Departure Time:</span> {formatDateTime(flight.arrival_time)}
              </p>
              <p>
                <span className="font-medium">Price:</span> Rp {flight.price ? flight.price?.toLocaleString() : 0}
              </p>
              <p>
                <span className="font-medium">Tickets:</span> {booking.ticket_quantity}
              </p>
              <p>
                <span className="font-medium">Total Price:</span> Rp {(flight.price * booking.ticket_quantity)?.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Booking Information</h2>
            <div className="space-y-2">
              <p>
                <span className="font-medium">Order Time:</span> {formatDateTime(booking.orderTime)}
              </p>
              <div className="flex items-center">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>{booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-4 mt-8">
            <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded hover:cursor-pointer" onClick={() => window.print()}>
              Print Ticket
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookingDetailPage;
