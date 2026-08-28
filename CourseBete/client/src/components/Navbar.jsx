import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, Menu, X, LogOut, LayoutDashboard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function Navbar() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const isLoggedIn = !!localStorage.getItem('token');
  const role = localStorage.getItem('userRole');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <nav className="glass sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">

          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="bg-blue-600 p-2 rounded-xl text-white group-hover:bg-blue-700 transition-colors duration-300">
                <GraduationCap size={28} />
              </div>
              <span className="text-2xl font-heading font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-blue-900 group-hover:from-blue-600 group-hover:to-blue-800 transition-all">CourseBete</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200">Home</Link>
            <Link to="/about" className="text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200">About</Link>

            {isLoggedIn ? (
              <div className="flex items-center gap-4">
                <Link
                  to={role === 'admin' ? '/admin' : '/dashboard'}
                  className="flex items-center gap-2 text-blue-600 font-bold hover:text-blue-800 transition-colors bg-blue-50 px-4 py-2 rounded-lg"
                >
                  <LayoutDashboard size={20} />
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-50 text-red-600 px-4 py-2 rounded-lg font-bold hover:bg-red-100 flex items-center gap-2 transition-all duration-200 hover:shadow-md"
                >
                  <LogOut size={18} />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-gray-600 hover:text-blue-600 font-bold transition-colors">Login</Link>
                <Link to="/register" className="bg-blue-600 text-white px-6 py-2.5 rounded-full hover:bg-blue-700 font-bold shadow-lg shadow-blue-200 hover:shadow-xl transition-all transform hover:-translate-y-0.5">
                  Get Started
                </Link>
              </div>
            )}
          </div>

          <div className="flex items-center md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 hover:text-blue-600 p-2 rounded-lg hover:bg-gray-100 transition-colors">
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white/95 backdrop-blur-lg border-t overflow-hidden"
          >
            <div className="p-4 space-y-4">
              <Link to="/" className="block p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" onClick={() => setIsOpen(false)}>Home</Link>
              <Link to="/about" className="block p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" onClick={() => setIsOpen(false)}>About</Link>
              {isLoggedIn ? (
                <>
                  <Link to={role === 'admin' ? '/admin' : '/dashboard'} className="block p-2 font-bold text-blue-600 bg-blue-50 rounded-lg" onClick={() => setIsOpen(false)}>Dashboard</Link>
                  <button onClick={handleLogout} className="block w-full text-left p-2 text-red-500 font-bold hover:bg-red-50 rounded-lg transition-colors">Sign Out</button>
                </>
              ) : (
                <div className="flex flex-col gap-3 pt-2">
                  <Link to="/login" className="block w-full text-center py-2 text-gray-600 font-bold border border-gray-200 rounded-lg hover:bg-gray-50" onClick={() => setIsOpen(false)}>Login</Link>
                  <Link to="/register" className="block w-full text-center py-2 bg-blue-600 text-white rounded-lg font-bold shadow-md" onClick={() => setIsOpen(false)}>Get Started</Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default Navbar;