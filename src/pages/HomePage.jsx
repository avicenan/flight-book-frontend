import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { flightsApiService } from "../services/api";

function HomePage() {
  const { pathname } = useLocation();
  const [search, setSearch] = useState("");
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    flightsApiService
      .getAll()
      .then((res) => {
        if (!res.data) throw new Error("Failed to fetch flights");
        setFlights(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const filteredFlights = flights.filter((flight) => {
    const searchTerm = search.toLowerCase();
    return flight.airline_name.toLowerCase().includes(searchTerm) || flight.from.toLowerCase().includes(searchTerm) || flight.to.toLowerCase().includes(searchTerm) || flight.departure_time.toLowerCase().includes(searchTerm);
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

  const handleDelete = async (flightId) => {
    if (window.confirm("Are you sure you want to delete this flight?")) {
      try {
        await flightsApiService.delete(flightId);
        setFlights(flights.filter((flight) => flight.id !== flightId));
        console.log("Flight deleted successfully");
      } catch (error) {
        console.error("Failed to delete flight:", error);
        setError("Failed to delete flight. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Hero Section */}
      <div className="relative h-[400px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-800/80 z-10"></div>
        <img src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2074&auto=format&fit=crop" alt="Hero background" className="w-full h-full object-cover" />
        <div className="absolute inset-0 z-20 flex flex-col justify-center max-w-4xl mx-auto px-4 md:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Find Your Perfect Flight</h1>
          <p className="text-xl text-blue-100 mb-8">Book your next journey with ease and comfort</p>
          <div className="relative">
            <input
              type="text"
              placeholder="Search flights by airline, route, or time..."
              className="w-full px-6 py-4 rounded-lg shadow-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pl-12"
              onChange={(e) => setSearch(e.target.value)}
            />
            <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Available Flights</h2>
          <Link to="/add-flight" className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add Flight
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>
        ) : filteredFlights.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            <p className="mt-4 text-gray-500 text-lg">No flights found</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {filteredFlights.map((flight) => (
              <div key={flight.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{flight.airline_name}</h3>
                    <p className="text-sm text-gray-500">{flight.flight_code}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-600">Rp {flight.price?.toLocaleString()}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="w-20 text-gray-500">From:</span>
                        <span className="font-medium">{flight.from}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-20 text-gray-500">To:</span>
                        <span className="font-medium">{flight.to}</span>
                      </div>
                    </div>
                    {/* <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg> */}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="w-20 text-gray-500">Departure:</span>
                      <span className="font-medium">{formatDateTime(flight.departure_time)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-20 text-gray-500">Arrival:</span>
                      <span className="font-medium">{formatDateTime(flight.arrival_time)}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-2">
                  <button onClick={() => handleDelete(flight.id)} className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200">
                    Delete
                  </button>
                  <Link to={`/book/${flight.id}`} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
                    Book Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default HomePage;
