import { Link } from "react-router-dom";

const FlightCard = ({ flight }) => (
  <div className="border p-4 rounded-lg shadow-md mb-4">
    <h3 className="text-xl font-bold">{flight.airline}</h3>
    <p>
      {flight.from} ➔ {flight.to}
    </p>
    <p className="text-green-600 font-semibold">Rp{flight.price}</p>
    <Link to={`/book/${flight.id}`}>
      <button className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Book Now</button>
    </Link>
  </div>
);

export default FlightCard;
