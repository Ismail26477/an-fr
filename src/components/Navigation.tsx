"use client"

import { Search, User, LogOut, Menu, X } from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/useAuth"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useState, useEffect, useRef } from "react"

const Navigation = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [showSearchModal, setShowSearchModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const searchInputRef = useRef<HTMLInputElement>(null)
  const { user, signOut } = useAuth()
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    if (showSearchModal && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [showSearchModal])

  const navItems = [
    { name: "Anime", path: "/anime" },
    { name: "Movies", path: "/movies" },
    ...(user ? [{ name: "My List", path: "/mylist" }] : []),
  ]

  const isActive = (path: string) => location.pathname === path

  return (
    <nav
      className={`w-full fixed top-0 left-0 right-0 z-50 transition-all duration-300
        ${isScrolled ? "bg-black/95 backdrop-blur-xl shadow-lg" : "bg-black"}
      `}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-16 gap-6">
          {/* LEFT SECTION: LOGO & DESKTOP NAVIGATION */}
          <div className="flex items-center gap-8 min-w-0 flex-1">
            {/* MOBILE MENU TOGGLE */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-white hover:bg-white/10 flex-shrink-0"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>

            {/* LOGO */}
            <Link to="/" className="flex items-center flex-shrink-0 text-2xl font-bold tracking-tight">
              <img src="/logo.png" alt="An!dost" className="h-8 md:h-9 w-auto object-contain" />
            </Link>

            {/* DESKTOP NAVIGATION MENU */}
            <div className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-sm font-medium transition-colors duration-200
                    ${isActive(item.path) ? "text-white" : "text-white/60 hover:text-white"}
                  `}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* RIGHT SECTION: SEARCH & USER MENU */}
          <div className="flex items-center gap-4 flex-shrink-0">
            {/* SEARCH BUTTON */}
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10"
              onClick={() => setShowSearchModal(true)}
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* USER MENU */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem className="text-xs text-white/70">{user?.email}</DropdownMenuItem>
                  <div className="border-t border-white/10 my-2" />
                  <DropdownMenuItem onClick={signOut} className="text-white hover:text-red-400 cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/auth">
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-sm font-medium">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* MOBILE NAVIGATION MENU */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 pt-2 border-t border-white/10 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-2 rounded text-sm font-medium transition-colors
                  ${isActive(item.path) ? "bg-white/10 text-white" : "text-white/60 hover:text-white hover:bg-white/5"}
                `}
              >
                {item.name}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* SEARCH MODAL */}
      {showSearchModal && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40 top-16" onClick={() => setShowSearchModal(false)} />
          <div className="fixed top-16 left-0 right-0 bg-black border-b border-white/10 z-50">
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
              <div className="relative">
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") {
                      setShowSearchModal(false)
                    }
                  }}
                  placeholder="Search anime, movies..."
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-purple-500 focus:bg-white/10 transition-all duration-200"
                />
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40 pointer-events-none" />
              </div>
            </div>
          </div>
        </>
      )}
    </nav>
  )
}

export default Navigation
