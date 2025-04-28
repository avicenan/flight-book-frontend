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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 pt-20">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error || !booking || !flight) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 pt-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-4 text-red-600">Booking Not Found</h1>
          <p>The booking you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8 pt-20">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Booking Details</h1>
          <button className="px-4 py-2 bg-white shadow-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center gap-2" onClick={() => navigate("/bookings")}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Bookings
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Passenger Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <h2 className="text-xl font-semibold text-gray-800">Passenger Information</h2>
            </div>
            <div className="space-y-3">
              <div className="flex items-center">
                <span className="text-gray-600 w-20">Name:</span>
                <span className="font-medium text-gray-900">{user?.name}</span>
              </div>
              <div className="flex items-center">
                <span className="text-gray-600 w-20">Email:</span>
                <span className="font-medium text-gray-900">{user?.email}</span>
              </div>
            </div>
          </div>

          {/* Booking Summary Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h2 className="text-xl font-semibold text-gray-800">Booking Summary</h2>
            </div>
            <div className="space-y-3">
              <div className="flex items-center">
                <span className="text-gray-600 w-32">Order Time:</span>
                <span className="font-medium text-gray-900">{formatDateTime(booking.created_at)}</span>
              </div>
              <div className="flex items-center">
                <span className="text-gray-600 w-32">Tickets:</span>
                <span className="font-medium text-gray-900">{booking.ticket_quantity}</span>
              </div>
              <div className="flex items-center">
                <span className="text-gray-600 w-32">Price per Ticket:</span>
                <span className="font-medium text-gray-900">Rp {flight.price?.toLocaleString("id-ID")}</span>
              </div>
              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center">
                  <span className="text-gray-900 font-semibold w-32">Total Price:</span>
                  <span className="font-bold text-lg text-green-600">Rp {(flight.price * booking.ticket_quantity)?.toLocaleString("id-ID")}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Flight Details Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" />
              </svg>
              <h2 className="text-xl font-semibold text-gray-800">Flight Details</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-center">
                  <span className="text-gray-600 w-32">Flight Code:</span>
                  <span className="font-medium text-gray-900">{flight.flight_code}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-600 w-32">Airline:</span>
                  <span className="font-medium text-gray-900">{flight.airline_name}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-600 w-32">Route:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">{flight.from}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                    <span className="font-medium text-gray-900">{flight.to}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center">
                  <span className="text-gray-600 w-32">Departure:</span>
                  <span className="font-medium text-gray-900">{formatDateTime(flight.departure_time)}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-600 w-32">Arrival:</span>
                  <span className="font-medium text-gray-900">{formatDateTime(flight.arrival_time)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 flex items-center gap-2 shadow-sm" onClick={() => window.print()}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clipRule="evenodd" />
            </svg>
            Print Ticket
          </button>
        </div>
      </div>
    </div>
  );
}

export default BookingDetailPage;
