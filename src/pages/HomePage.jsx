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
        console.log(res.data);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const filteredFlights = [];
  if (flights.length > 0) {
    flights.forEach((flight) => {
      if (
        flight.airline_name.toLowerCase().includes(search.toLowerCase()) ||
        flight.from.toLowerCase().includes(search.toLowerCase()) ||
        flight.to.toLowerCase().includes(search.toLowerCase()) ||
        flight.departure_time.toLowerCase().includes(search.toLowerCase())
      ) {
        filteredFlights.push(flight);
      }
    });
  }

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
    <div className="p-8 pt-20 flex flex-col min-h-screen text-left gap-4">
      <div className="jumbotron relative">
        <img
          src="https://plus.unsplash.com/premium_photo-1679830513869-cd3648acb1db?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8dHJhdmVsfGVufDB8fDB8fHww"
          alt=""
          className="h-60 rounded-2xl w-full object-cover"
        />
        <p className="absolute top-1 p-4 font-bold left-1 text-3xl">Flight Ticket Point of Sales</p>
      </div>

      <div className="flex justify-between items-center">
        <h1 className={`text-2xl font-bold`}>Available Flights</h1>
        <Link to="/add-flight">
          <button className="border border-blue-800 text-blue-800 hover:bg-blue-600 hover:text-white py-2 px-4 rounded">Add Flight</button>
        </Link>
      </div>

      {/* search box */}
      <div className="">
        <input type="text" placeholder="Search flights..." className="border border-gray-300 p-4 rounded-full w-full" onChange={(e) => setSearch(e.target.value)} />
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="text-red-500">Error: {error}</div>
      ) : (
        <div className="flex flex-col md:grid-cols-2 lg:grid-cols-3 gap-4 flex-1">
          {filteredFlights.map((flight) => (
            <div key={flight.id} className="border border-gray-400 p-4 rounded-lg shadow hover:shadow-lg transition flex justify-between items-end">
              <div className="">
                <h2 className="text-xl font-semibold">
                  {flight.airline_name} ({flight.flight_code})
                </h2>
                <p className="mt-2">
                  Route: {flight.from} → {flight.to}
                </p>
                <p className="font-bold mt-2">Price: Rp {flight.price ? flight.price.toLocaleString() : "N/A"}</p>
                <p className="font-bold mt-2">Departure Time: {formatDateTime(flight.departure_time)}</p>
                <p className="font-bold mt-2">Arrival Time: {formatDateTime(flight.arrival_time)}</p>
              </div>

              <div className="flex gap-2">
                <button onClick={() => handleDelete(flight.id)} className="mt-4 border border-red-500 text-red-500 hover:bg-red-600 hover:cursor-pointer hover:text-white py-2 px-4 rounded">
                  Delete
                </button>
                <Link to={`/book/${flight.id}`}>
                  <button className="mt-4 bg-blue-800 hover:bg-blue-600 hover:cursor-pointer text-white py-2 px-4 rounded">Book Now</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default HomePage;
