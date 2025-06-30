import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-black text-white p-4 shadow-md z-50 relative">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo and Title */}
        <Link to="/" className="flex items-center space-x-3">
          <img
            src="/logo.png"
            alt="Mini Arcade Logo"
            className="h-14 w-auto" // 👈 Increased height from h-10 to h-14
          />
          <span className="text-3xl font-bold text-purple-400">Mini Arcade</span>
        </Link>

        {/* Nav Links */}
        <div className="space-x-4">
          <Link to="/" className="hover:text-purple-400">Home</Link>
          <Link to="/games" className="hover:text-purple-400">Games</Link>
           <Link to="/about" className="hover:text-purple-400">About</Link> {/* 👈 New Link */}
        </div>
      </div>
    </nav>
  );
}
