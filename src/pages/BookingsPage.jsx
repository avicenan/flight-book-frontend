import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { bookingsApiService } from "../services/api";

const BookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await bookingsApiService.getAll();
        setBookings(Array.isArray(response.data) ? response.data : []);
        setLoading(false);
        console.log(response.data);
      } catch (err) {
        setError("Failed to fetch bookings");
        setLoading(false);
        console.error(err);
      }
    };

    fetchBookings();
  }, []);

  const filteredBookings = bookings.filter((booking) => {
    const userName = booking.user?.name || "";
    const flightInfo = `${booking.flight?.flight_code || ""} ${booking.flight?.from || ""} ${booking.flight?.to || ""}`;
    return userName.toLowerCase().includes(search.toLowerCase()) || flightInfo.toLowerCase().includes(search.toLowerCase());
  });

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return date.toLocaleString("en-US", {
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
      case "cancelled":
        return "bg-red-100 text-red-800";
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
      {filteredBookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        filteredBookings.map((booking) => (
          <Link to={`/bookings/${booking.id}`} key={booking.id}>
            <div className="border border-gray-400 p-4 rounded-lg shadow hover:shadow-lg transition cursor-pointer">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold">{booking.user?.name}</p>
                  <p>{booking.user?.email}</p>
                  <p className="text-gray-600">
                    {booking.flight?.flight_code}: {booking.flight?.from} → {booking.flight?.to} ({booking.flight?.airline_name})
                  </p>
                  <p className="text-sm mt-2">Tickets: {booking.ticket_quantity}</p>
                </div>
                <div className="flex flex-col items-end">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>{booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}</span>
                  <p className="text-sm text-gray-500 mt-2">Ordered: {formatDateTime(booking.orderTime)}</p>
                </div>
              </div>
            </div>
          </Link>
        ))
      )}
    </div>
  );
};

export default BookingsPage;
