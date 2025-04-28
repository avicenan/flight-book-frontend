import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const { pathname } = useLocation();
  return (
    <nav className=" bg-blue-800 text-white flex gap-4 fixed top-0 left-0 right-0 z-10 shadow ">
      <div className="flex w-full justify-start gap-8 items-center max-w-screen-lg mx-auto p-4 px-8">
        <div className="p-1 rounded-full ">
          <span>✈️</span>
        </div>
        <Link className={`hover:underline text-xl ${pathname === "/" ? "font-bold" : ""}`} to="/">
          Home
        </Link>
        <Link className={`hover:underline text-xl ${pathname === "/bookings" ? "font-bold" : ""}`} to="/bookings">
          Bookings
        </Link>
        <Link className={`hover:underline text-xl ${pathname === "/users" ? "font-bold" : ""}`} to="/users">
          Users
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
