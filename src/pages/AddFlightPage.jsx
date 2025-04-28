import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { flightsApiService } from "../services/api";

function AddFlightPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    flight_code: "",
    airline_name: "",
    departure_time: "",
    arrival_time: "",
    price: "",
    from: "",
    to: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Format the datetime to MySQL format (YYYY-MM-DD HH:mm:ss)
      const formattedData = {
        ...formData,
        departure_time: new Date(formData.departure_time).toISOString().slice(0, 19).replace("T", " "),
        arrival_time: formData.arrival_time ? new Date(formData.arrival_time).toISOString().slice(0, 19).replace("T", " ") : null,
      };

      console.log("Submitting form data:", formattedData);

      const response = await flightsApiService.create(formattedData);
      console.log("API Response:", response);

      if (response.status === 200 || response.status === 201) {
        alert("Flight added successfully!");
        navigate("/");
      } else {
        throw new Error(`Unexpected response status: ${response.status}`);
      }
    } catch (err) {
      console.error("Error creating flight:", err);
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        setError(err.response.data?.message || "Failed to add flight. Please try again.");
      } else if (err.request) {
        // The request was made but no response was received
        setError("No response received from server. Please check your connection.");
      } else {
        // Something happened in setting up the request that triggered an Error
        setError(err.message || "An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 pt-20 flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Add New Flight</h1>
        <button className="bg-gray-200 hover:bg-gray-300 text-black px-4 py-2 rounded" onClick={() => navigate("/")}>
          Back
        </button>
      </div>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>}

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md border border-gray-400">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="font-semibold">Flight Code</label>
            <input type="text" name="flight_code" value={formData.flight_code} onChange={handleChange} className="border p-2 rounded" required placeholder="e.g., GA-123" />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-semibold">Airline Name</label>
            <input type="text" name="airline_name" value={formData.airline_name} onChange={handleChange} className="border p-2 rounded" required placeholder="e.g., Garuda Indonesia" />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-semibold">From</label>
            <input type="text" name="from" value={formData.from} onChange={handleChange} className="border p-2 rounded" required placeholder="e.g., Jakarta" />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-semibold">To</label>
            <input type="text" name="to" value={formData.to} onChange={handleChange} className="border p-2 rounded" required placeholder="e.g., Bali" />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-semibold">Departure Time</label>
            <input type="datetime-local" name="departure_time" value={formData.departure_time} onChange={handleChange} className="border p-2 rounded" required />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-semibold">Arrival Time</label>
            <input type="datetime-local" name="arrival_time" value={formData.arrival_time} onChange={handleChange} className="border p-2 rounded" />
          </div>

          <div className="flex flex-col col-span-2 gap-2">
            <label className="font-semibold">Price</label>
            <input type="number" name="price" value={formData.price} onChange={handleChange} className="border p-2 rounded" required placeholder="e.g., 1000" />
          </div>
        </div>

        <div className="mt-6">
          <button type="submit" disabled={loading} className={`w-full py-2 px-4 rounded text-white ${loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"}`}>
            {loading ? "Adding Flight..." : "Add Flight"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddFlightPage;
