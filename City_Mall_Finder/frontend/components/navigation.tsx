"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, LayoutDashboard, Store } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="border-b border-gray-800 bg-black">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-xl font-bold text-white">
              Addis Mall Finder
            </Link>
            <div className="flex gap-2">
              <Button
                variant={pathname === "/" ? "secondary" : "ghost"}
                size="sm"
                asChild
                className={pathname === "/" ? "bg-gray-900 text-white" : "text-gray-400 hover:text-white"}
              >
                <Link href="/">
                  <Home className="mr-2 h-4 w-4" />
                  Search
                </Link>
              </Button>
              <Button
                variant={pathname === "/register" ? "secondary" : "ghost"}
                size="sm"
                asChild
                className={pathname === "/register" ? "bg-gray-900 text-white" : "text-gray-400 hover:text-white"}
              >
                <Link href="/register">
                  <Store className="mr-2 h-4 w-4" />
                  Register Shop
                </Link>
              </Button>
              <Button
                variant={pathname === "/admin" ? "secondary" : "ghost"}
                size="sm"
                asChild
                className={pathname === "/admin" ? "bg-gray-900 text-white" : "text-gray-400 hover:text-white"}
              >
                <Link href="/admin">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Admin
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navigation
