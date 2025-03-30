import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold">
              Logo
            </Link>
            <div className="flex gap-6 ml-6">
              <Link to="/zone">Zone</Link>
              <Link to="/">About Us</Link>
              <Link to="/sign">Sign Up</Link>
              <Link to="/sign">Login</Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;