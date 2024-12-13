import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.clear(); // Clear all local storage data
    navigate('/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery(''); // Clear the search input after submission
    }
  };

  const closeMobileMenu = () => setIsMenuOpen(false);

  return (
    <nav className="bg-white border-b border-gray-200 shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center py-3 px-6">
        {/* Logo */}
        <Link to="/home" className="text-xl font-bold text-gray-800" onClick={closeMobileMenu}>
          Municipal Q&A
        </Link>

        {/* Hamburger Icon for Small Screens */}
        <div className="block lg:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-gray-800 focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center space-x-6">
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
              <Link to="/submit-question" className="text-gray-600 hover:text-black transition">
                Submit Question
              </Link>
              <Link to="/questions" className="text-gray-600 hover:text-black transition">
                Questions
              </Link>
              <Link to="/questions/unanswered" className="text-gray-600 hover:text-black transition">
                Unanswered
              </Link>
              <Link to="/profile" className="text-gray-600 hover:text-black transition">
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
              <Link to="/login" className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-black transition">
                Login
              </Link>
              <Link to="/signup" className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-black transition">
                Signup
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`lg:hidden ${isMenuOpen ? 'block' : 'hidden'} bg-gray-800 text-white px-6 py-4`}>
        <form onSubmit={handleSearch} className="flex items-center mb-4">
          <input
            type="text"
            placeholder="Search questions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-gray-600 w-full"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-gray-600 text-white rounded-r-md hover:bg-black transition mt-2 lg:mt-0"
          >
            Search
          </button>
        </form>

        {/* Authenticated Links */}
        {token ? (
          <>
            <Link to="/submit-question" className="block text-white py-2 hover:bg-gray-600 transition" onClick={closeMobileMenu}>
              Submit Question
            </Link>
            <Link to="/questions" className="block text-white py-2 hover:bg-gray-600 transition" onClick={closeMobileMenu}>
              Questions
            </Link>
            <Link to="/questions/unanswered" className="block text-white py-2 hover:bg-gray-600 transition" onClick={closeMobileMenu}>
              Unanswered
            </Link>
            <Link to="/profile" className="block text-white py-2 hover:bg-gray-600 transition" onClick={closeMobileMenu}>
              Profile
            </Link>
            <button
              onClick={() => {
                handleLogout();
                closeMobileMenu();
              }}
              className="block w-full text-white py-2 bg-gray-600 hover:bg-black transition mt-4"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="block text-white py-2 bg-gray-600 hover:bg-black transition" onClick={closeMobileMenu}>
              Login
            </Link>
            <Link to="/signup" className="block text-white py-2 bg-gray-600 hover:bg-black transition" onClick={closeMobileMenu}>
              Signup
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
