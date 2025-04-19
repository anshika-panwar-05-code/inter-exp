import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Toggle menu visibility
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="bg-blue-500 text-white py-4 px-6 sticky top-0 z-50">
      <div className="flex items-center justify-between">
        {/* Header title */}
        <h1 className="text-2xl font-bold tracking-wide">Interview Experience Platform</h1>

        {/* Hamburger menu for mobile */}
        <div className="lg:hidden">
          <button onClick={toggleMenu} className="text-white focus:outline-none">
            <svg
              className="w-6 h-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {/* Navigation links for desktop */}
        <nav className="hidden lg:flex space-x-6">
          <Link to="/" className="text-white hover:bg-blue-600 px-4 py-2 rounded-md">Home</Link>
          <Link to="/login" className="text-white hover:bg-blue-600 px-4 py-2 rounded-md">Login</Link>
          <Link to="/register" className="text-white hover:bg-blue-600 px-4 py-2 rounded-md">Register</Link>
          <Link to="/submissions" className="text-white hover:bg-blue-600 px-4 py-2 rounded-md">Submissions</Link>
          <Link to="/submit-experience" className="text-white hover:bg-blue-600 px-4 py-2 rounded-md">Submit Experience</Link>
        </nav>
      </div>

      {/* Mobile Menu */}
      {/* Mobile Menu */}
{isMenuOpen && (
  <div className="lg:hidden mt-4 space-y-4">
    <Link
      to="/"
      onClick={() => setIsMenuOpen(false)}
      className="block text-white hover:bg-blue-600 px-4 py-2 rounded-md"
    >
      Home
    </Link>
    <Link
      to="/login"
      onClick={() => setIsMenuOpen(false)}
      className="block text-white hover:bg-blue-600 px-4 py-2 rounded-md"
    >
      Login
    </Link>
    <Link
      to="/register"
      onClick={() => setIsMenuOpen(false)}
      className="block text-white hover:bg-blue-600 px-4 py-2 rounded-md"
    >
      Register
    </Link>
    <Link
      to="/submissions"
      onClick={() => setIsMenuOpen(false)}
      className="block text-white hover:bg-blue-600 px-4 py-2 rounded-md"
    >
      Submissions
    </Link>
    <Link
      to="/submit-experience"
      onClick={() => setIsMenuOpen(false)}
      className="block text-white hover:bg-blue-600 px-4 py-2 rounded-md"
    >
      Submit Experience
    </Link>
  </div>
)}

    </header>
  );
};

export default Header;
