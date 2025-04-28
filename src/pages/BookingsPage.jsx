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
      <div className="min-h-screen bg-gray-50 p-8 pt-20">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 pt-20">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8 pt-20">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Bookings</h1>
          <div className="relative">
            <input
              type="text"
              placeholder="Search bookings..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64 bg-white"
              onChange={(e) => setSearch(e.target.value)}
            />
            <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
        </div>

        {!loading && !error && filteredBookings.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <p className="mt-4 text-gray-500 text-lg">No bookings found</p>
          </div>
        )}

        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <Link to={`/bookings/${booking.id}`} key={booking.id} className="block">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
                <div className="flex flex-col md:flex-row justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <svg className="h-6 w-6 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <h2 className="text-xl font-semibold text-gray-800">{booking.user?.name || "Unknown User"}</h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500">Flight:</span>
                          <span className="font-medium">{booking.flight?.flight_code || "N/A"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500">Airline:</span>
                          <span className="font-medium">{booking.flight?.airline_name || "N/A"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500">Route:</span>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{booking.flight?.from || "N/A"}</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                            <span className="font-medium">{booking.flight?.to || "N/A"}</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500">Departure:</span>
                          <span className="font-medium">{formatDateTime(booking.flight?.departure_time)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500">Arrival:</span>
                          <span className="font-medium">{formatDateTime(booking.flight?.arrival_time)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500">Tickets:</span>
                          <span className="font-medium">{booking.ticket_quantity || 0}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>{booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1) || "Unknown"}</span>
                        <span className="text-sm text-gray-500">Ordered: {formatDateTime(booking.created_at)}</span>
                      </div>
                      <div className="font-bold text-lg text-green-600">Rp {(booking.ticket_quantity * booking.flight?.price)?.toLocaleString("id-ID") || 0}</div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookingsPage;
