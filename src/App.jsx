import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import BookingPage from "./pages/BookingPage";
import BookingsPage from "./pages/BookingsPage";
import UsersPage from "./pages/UsersPage";
import BookingDetailPage from "./pages/BookingDetailPage";
import Navbar from "./components/Navbar";
import AddFlightPage from "./pages/AddFlightPage";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/book/:flightId" element={<BookingPage />} />
        <Route path="/bookings" element={<BookingsPage />} />
        <Route path="/bookings/:bookingId" element={<BookingDetailPage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/add-flight" element={<AddFlightPage />} />
      </Routes>
    </Router>
  );
}

export default App;
