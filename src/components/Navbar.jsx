import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const { pathname } = useLocation();

  const navItems = [
    { path: "/", label: "Home", icon: "🏠" },
    { path: "/bookings", label: "Bookings", icon: "✈️" },
    { path: "/users", label: "Users", icon: "👥" },
  ];

  return (
    <nav className="bg-gradient-to-r from-blue-800 to-blue-600 text-white fixed top-0 left-0 right-0 shadow-lg z-99">
      <div className="max-w-screen-lg mx-auto">
        <div className="flex items-center justify-between h-16 px-4 md:px-8">
          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
            <div className="bg-gradient-to-r from-blue-100 to-white p-2 rounded-full shadow-md">
              <span className="text-xl">✈️</span>
            </div>
            <span className="font-bold text-xl hidden md:block">Flight Booking</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-1 md:gap-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  px-4 py-2 rounded-lg text-sm md:text-base font-medium
                  transition-all duration-200 ease-in-out
                  flex items-center gap-2
                  ${pathname === item.path ? "bg-white/20 text-white font-semibold" : "text-blue-100 hover:bg-white/10 hover:text-white"}
                `}
              >
                <span className="hidden md:inline">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </div>

          {/* User Section - You can uncomment and modify this if you have user functionality */}
          {/*
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
            <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center">
              <span className="text-sm font-medium">JD</span>
            </div>
          </div>
          */}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
