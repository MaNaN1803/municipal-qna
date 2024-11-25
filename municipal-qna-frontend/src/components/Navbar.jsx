import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200 shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center py-3 px-6">
        <Link to="/home" className="text-xl font-bold text-gray-800">
          Municipal Q&A
        </Link>
        <div className="flex items-center space-x-6">
          {/* Search Form */}
          <form onSubmit={handleSearch} className="flex items-center">
            <input
              type="text"
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-gray-600"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-gray-800 text-white rounded-r-md hover:bg-black transition"
            >
              Search
            </button>
          </form>

          {/* Authenticated Links */}
          {token ? (
            <>
              <Link
                to="/submit-question"
                className="text-gray-600 hover:text-black transition"
              >
                Submit Question
              </Link>
              <Link
                to="/questions"
                className="text-gray-600 hover:text-black transition"
              >
                Questions
              </Link>
              <Link
  to="/profile"
  className="text-gray-600 hover:text-black transition"
>
  Profile
</Link>

              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-black transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-black transition"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-black transition"
              >
                Signup
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
