import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { bookingsApiService, usersApiService, flightsApiService } from "../services/api";

const BookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await bookingsApiService.getAll();
        if (response.data && response.data.data) {
          // Fetch user and flight details for each booking
          const bookingsWithDetails = await Promise.all(
            response.data.data.map(async (booking) => {
              try {
                const [userResponse, flightResponse] = await Promise.all([usersApiService.getById(booking.user_id), flightsApiService.getById(booking.flight_id)]);

                return {
                  ...booking,
                  user: userResponse.data?.data || null,
                  flight: flightResponse.data?.data || null,
                };
              } catch (err) {
                console.error(`Error fetching details for booking ${booking.id}:`, err);
                return {
                  ...booking,
                  user: null,
                  flight: null,
                };
              }
            })
          );

          setBookings(bookingsWithDetails);
        } else {
          throw new Error("Invalid response format");
        }
        setLoading(false);
      } catch (err) {
        setError(err.message || "Failed to fetch bookings");
        setLoading(false);
        console.error(err);
      }
    };

    fetchBookings();
  }, []);

  const filteredBookings = bookings.filter((booking) => {
    const searchTerm = search.toLowerCase();
    const userName = booking.user?.name?.toLowerCase() || "";
    const flightCode = booking.flight?.flight_code?.toLowerCase() || "";
    const from = booking.flight?.from?.toLowerCase() || "";
    const to = booking.flight?.to?.toLowerCase() || "";

    return userName.includes(searchTerm) || flightCode.includes(searchTerm) || from.includes(searchTerm) || to.includes(searchTerm);
  });

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return "N/A";
    try {
      const date = new Date(dateTimeString);
      return date.toLocaleString("en-US", {
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

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="p-8 pt-20 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 pt-20">
        <div className="text-red-500 text-center">{error}</div>
      </div>
    );
  }

  return (
    <div className="p-8 pt-20 flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Bookings</h1>

      <div className="mb-2">
        <input type="text" placeholder="Search by name or flight..." className="border border-gray-300 p-4 rounded-full w-full" onChange={(e) => setSearch(e.target.value)} />
      </div>

      {!loading && !error && filteredBookings.length === 0 && <div className="text-center text-gray-500">No bookings found</div>}

      <div className="grid gap-4">
        {filteredBookings.map((booking) => (
          <Link to={`/bookings/${booking.id}`} key={booking.id}>
            <div className="border border-gray-400 p-4 rounded-lg shadow hover:shadow-lg transition cursor-pointer">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold text-lg">{booking.user?.name || "Unknown User"}</p>
                  <p className="text-gray-600">
                    Flight: {booking.flight?.flight_code || "N/A"} ({booking.flight?.airline_name || "N/A"})
                  </p>
                  <p className="text-gray-600">
                    Route: {booking.flight?.from || "N/A"} → {booking.flight?.to || "N/A"}
                  </p>
                  <p className="text-gray-600">Departure Time: {formatDateTime(booking.flight?.departure_time)}</p>
                  <p className="text-gray-600">Arrival Time: {formatDateTime(booking.flight?.arrival_time)}</p>
                  <div className="flex gap-2">
                    <p className="text-sm mt-2">Tickets: {booking.ticket_quantity || 0}</p>
                    <p className="text-sm mt-2">Total Price: Rp {booking.ticket_quantity * booking.flight?.price || 0}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>{booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1) || "Unknown"}</span>
                  <p className="text-sm text-gray-500 mt-2">Created: {formatDateTime(booking.created_at)}</p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BookingsPage;
