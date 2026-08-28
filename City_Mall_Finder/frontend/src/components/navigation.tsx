"use client"

import { Link } from "react-router-dom"
import { Menu } from "lucide-react"
import { useState } from "react"

function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-800 bg-black">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="text-xl font-bold text-white hover:text-gray-300">
              Addis Mall Finder
            </Link>
            <div className="hidden md:flex gap-6">
              <Link to="/" className="text-sm text-gray-400 hover:text-white transition-colors">
                Search
              </Link>
              <Link to="/register" className="text-sm text-gray-400 hover:text-white transition-colors">
                Register Shop
              </Link>
              <Link to="/admin" className="text-sm text-gray-400 hover:text-white transition-colors">
                Admin
              </Link>
            </div>
          </div>
          <button
            className="md:hidden p-2 text-gray-400 hover:text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link to="/" className="block py-2 text-sm text-gray-400 hover:text-white">
              Search
            </Link>
            <Link to="/register" className="block py-2 text-sm text-gray-400 hover:text-white">
              Register Shop
            </Link>
            <Link to="/admin" className="block py-2 text-sm text-gray-400 hover:text-white">
              Admin
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navigation
