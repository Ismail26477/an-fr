"use client"

import { Search, Bell, User, LogOut, Menu, X } from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/useAuth"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { SearchModal } from "./SearchModal"
import { useState, useEffect } from "react"

const Navigation = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { user, signOut } = useAuth()
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navItems = [
    { name: "Anime", path: "/animes", icon: null },
    { name: "Movies", path: "/movies", icon: null },
    ...(user ? [{ name: "My List", path: "/mylist", icon: null }] : []),
  ]

  const isActive = (path: string) => location.pathname === path

  return (
    <nav
      className={`w-full fixed top-0 left-0 right-0 z-50 transition-all duration-300
        ${isScrolled ? "bg-black/80 backdrop-blur-md shadow-lg" : "bg-gradient-to-b from-black/60 to-transparent"}
      `}
    >
      <div className="max-w-9xl mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-12 md:h-20">
          {/* LEFT SECTION - LOGO AND NAVIGATION */}
          <div className="flex items-center gap-8 md:gap-12">
            {/* LOGO */}
            <Link to="/" className="flex items-center group transition-transform duration-300 hover:scale-110">
              <img
                src="/logo.png"
                alt="Anidost Logo"
                className="h-28 md:h-32 w-auto object-contain drop-shadow-lg group-hover:drop-shadow-[0_0_20px_rgba(168,85,247,0.8)]"
              />
            </Link>

            {/* DESKTOP NAVIGATION MENU */}
            <div className="hidden md:flex items-center gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative px-4 py-2 font-medium text-sm transition-all duration-300 group
                    ${isActive(item.path) ? "text-purple-400" : "text-white/70 hover:text-white"}
                  `}
                >
                  {item.name}
                  <span
                    className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300
                    ${isActive(item.path) ? "scale-x-100" : "scale-x-0 group-hover:scale-x-50"}
                  `}
                  />
                </Link>
              ))}
            </div>
          </div>

          {/* RIGHT SECTION - SEARCH, ICONS, AND USER */}
          <div className="flex items-center gap-3 md:gap-6">
            {/* DESKTOP SEARCH BAR */}
            <div className="hidden lg:block min-w-64">
              <SearchModal />
            </div>

            {/* MOBILE SEARCH BUTTON */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden hover:bg-white/10 text-white transition-all duration-200"
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* NOTIFICATION BELL */}
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-purple-500/20 text-white transition-all duration-200 relative group"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            </Button>

            {/* USER MENU DROPDOWN */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-purple-500/20 text-white transition-all duration-200 group"
                  >
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center group-hover:shadow-lg group-hover:shadow-purple-500/50">
                      <User className="h-4 w-4 text-white" />
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-black/90 border-white/20">
                  <DropdownMenuItem className="text-white/70 hover:text-white cursor-default">
                    <span className="text-xs">{user?.email}</span>
                  </DropdownMenuItem>
                  <div className="border-t border-white/20 my-2" />
                  <DropdownMenuItem
                    onClick={signOut}
                    className="text-white hover:text-red-400 cursor-pointer transition-colors"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/auth">
                <Button className="hidden sm:inline-flex bg-purple-600 hover:bg-purple-700 text-white transition-all duration-200 px-6">
                  Sign In
                </Button>
                <Button variant="ghost" size="icon" className="sm:hidden text-white hover:bg-purple-500/20">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            )}

            {/* MOBILE MENU TOGGLE */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden hover:bg-white/10 text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* MOBILE NAVIGATION MENU */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 border-t border-white/10 space-y-2 animate-in fade-in slide-in-from-top-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-3 rounded-lg font-medium transition-all duration-200
                  ${
                    isActive(item.path)
                      ? "bg-purple-600/20 text-purple-400 border-l-2 border-purple-500"
                      : "text-white/70 hover:text-white hover:bg-white/5"
                  }
                `}
              >
                {item.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navigation
