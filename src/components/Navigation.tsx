"use client"

<<<<<<< HEAD
import { Search, User, LogOut, Menu, X } from "lucide-react"
=======
import { Search, Bell, User, LogOut, Menu, X } from "lucide-react"
>>>>>>> d89a649a2dae1233eddebf1334c64eb38779d39d
import { Link, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/useAuth"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
<<<<<<< HEAD
import { useState, useEffect, useRef } from "react"

const Navigation = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [showInlineSearch, setShowInlineSearch] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const searchInputRef = useRef<HTMLInputElement>(null)
=======
import { SearchModal } from "./SearchModal"
import { useState, useEffect } from "react"

const Navigation = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
>>>>>>> d89a649a2dae1233eddebf1334c64eb38779d39d
  const { user, signOut } = useAuth()
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
<<<<<<< HEAD
      const currentScrollY = window.scrollY

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false)
      } else {
        setIsVisible(true)
      }

      setLastScrollY(currentScrollY)
      setIsScrolled(currentScrollY > 20)
=======
      setIsScrolled(window.scrollY > 20)
>>>>>>> d89a649a2dae1233eddebf1334c64eb38779d39d
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
<<<<<<< HEAD
  }, [lastScrollY])

  useEffect(() => {
    if (showInlineSearch && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [showInlineSearch])
=======
  }, [])
>>>>>>> d89a649a2dae1233eddebf1334c64eb38779d39d

  const navItems = [
    { name: "Anime", path: "/anime", icon: null },
    { name: "Movies", path: "/movies", icon: null },
    ...(user ? [{ name: "My List", path: "/mylist", icon: null }] : []),
  ]

  const isActive = (path: string) => location.pathname === path

  return (
    <nav
<<<<<<< HEAD
      className={`w-full fixed top-0 left-0 right-0 z-50 transition-transform duration-300 
        ${isVisible ? "translate-y-0" : "-translate-y-full"}
        ${isScrolled ? "bg-black/90 backdrop-blur-lg shadow-2xl" : "bg-black md:bg-gradient-to-b md:from-black/80 md:to-transparent"}
      `}
    >
      <div className="max-w-9xl mx-auto px-3 md:px-6">
        <div className="flex items-center justify-between h-16 md:h-20 gap-2 md:gap-4">
          {/* LEFT SECTION: MENU & LOGO */}
          <div className="flex items-center gap-3 md:gap-4 min-w-0">
            {/* MOBILE MENU TOGGLE */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden hover:bg-white/10 text-white flex-shrink-0 transition-colors duration-200"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>

            {/* LOGO */}
            <Link to="/" className="flex items-center group transition-all duration-300 flex-shrink-0">
              <img
                src="/logo.png"
                alt="Anidost Logo"
                className="h-28 md:h-32 w-auto object-contain drop-shadow-lg group-hover:drop-shadow-[0_0_20px_rgba(168,85,247,0.8)] transition-all duration-300"
=======
      className={`w-full fixed top-0 left-0 right-0 z-50 transition-all duration-300
        ${isScrolled ? "bg-black/80 backdrop-blur-md shadow-lg" : "bg-gradient-to-b from-black/60 to-transparent"}
      `}
    >
      <div className="max-w-9xl mx-auto px-2 md:px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* LEFT SECTION - LOGO AND NAVIGATION */}
          <div className="flex items-center gap-8 md:gap-12">
            {/* LOGO */}
            <Link to="/" className="flex items-center group transition-transform duration-300 hover:scale-110">
              <img
                src="/logo.png"
                alt="Anidost Logo"
                className="h-28 md:h-32 w-auto object-contain drop-shadow-lg group-hover:drop-shadow-[0_0_20px_rgba(168,85,247,0.8)]"
>>>>>>> d89a649a2dae1233eddebf1334c64eb38779d39d
              />
            </Link>

            {/* DESKTOP NAVIGATION MENU */}
<<<<<<< HEAD
            <div className="hidden md:flex items-center gap-1 ml-6">
=======
            <div className="hidden md:flex items-center gap-2">
>>>>>>> d89a649a2dae1233eddebf1334c64eb38779d39d
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
<<<<<<< HEAD
                  className={`relative px-3 py-2 font-medium text-sm transition-all duration-300 group
=======
                  className={`relative px-4 py-2 font-medium text-sm transition-all duration-300 group
>>>>>>> d89a649a2dae1233eddebf1334c64eb38779d39d
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

<<<<<<< HEAD
          {/* CENTER SECTION: INLINE SEARCH BAR */}
          <div className="hidden md:flex flex-1 max-w-xs justify-center px-4">
            {showInlineSearch ? (
              <div className="relative w-full">
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onBlur={() => {
                    if (!searchQuery) setShowInlineSearch(false)
                  }}
                  placeholder="Search anime, movies..."
                  className="w-full px-4 py-2 bg-white/10 border border-white/30 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:border-purple-500 focus:bg-white/20 transition-all duration-200"
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50 pointer-events-none" />
              </div>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-white/10 text-white transition-all duration-200"
                onClick={() => setShowInlineSearch(true)}
                aria-label="Open search"
              >
                <Search className="h-5 w-5" />
              </Button>
            )}
          </div>

          {/* RIGHT SECTION: MOBILE SEARCH & USER MENU */}
          <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
=======
          {/* RIGHT SECTION - SEARCH, ICONS, AND USER */}
          <div className="flex items-center gap-3 md:gap-6">
            {/* DESKTOP SEARCH BAR */}
            <div className="hidden lg:block min-w-64">
              <SearchModal />
            </div>

>>>>>>> d89a649a2dae1233eddebf1334c64eb38779d39d
            {/* MOBILE SEARCH BUTTON */}
            <Button
              variant="ghost"
              size="icon"
<<<<<<< HEAD
              className="md:hidden hover:bg-white/10 text-white transition-all duration-200"
              onClick={() => setShowInlineSearch(!showInlineSearch)}
              aria-label="Search"
=======
              className="lg:hidden hover:bg-white/10 text-white transition-all duration-200"
              onClick={() => setMobileSearchOpen(true)}
>>>>>>> d89a649a2dae1233eddebf1334c64eb38779d39d
            >
              <Search className="h-5 w-5" />
            </Button>

<<<<<<< HEAD
=======
            {/* NOTIFICATION BELL */}
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-purple-500/20 text-white transition-all duration-200 relative group"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            </Button>

>>>>>>> d89a649a2dae1233eddebf1334c64eb38779d39d
            {/* USER MENU DROPDOWN */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-purple-500/20 text-white transition-all duration-200 group"
                  >
<<<<<<< HEAD
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center group-hover:shadow-lg group-hover:shadow-purple-500/50 transition-all duration-200">
=======
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center group-hover:shadow-lg group-hover:shadow-purple-500/50">
>>>>>>> d89a649a2dae1233eddebf1334c64eb38779d39d
                      <User className="h-4 w-4 text-white" />
                    </div>
                  </Button>
                </DropdownMenuTrigger>
<<<<<<< HEAD
                <DropdownMenuContent align="end" className="w-48 bg-black/95 border-white/20 backdrop-blur-sm">
=======
                <DropdownMenuContent align="end" className="w-48 bg-black/90 border-white/20">
>>>>>>> d89a649a2dae1233eddebf1334c64eb38779d39d
                  <DropdownMenuItem className="text-white/70 hover:text-white cursor-default">
                    <span className="text-xs">{user?.email}</span>
                  </DropdownMenuItem>
                  <div className="border-t border-white/20 my-2" />
                  <DropdownMenuItem
                    onClick={signOut}
<<<<<<< HEAD
                    className="text-white hover:text-red-400 cursor-pointer transition-colors duration-200"
=======
                    className="text-white hover:text-red-400 cursor-pointer transition-colors"
>>>>>>> d89a649a2dae1233eddebf1334c64eb38779d39d
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/auth">
<<<<<<< HEAD
                <Button className="hidden sm:inline-flex bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white transition-all duration-200 px-5 py-2 font-medium shadow-lg hover:shadow-purple-500/50">
=======
                <Button className="hidden sm:inline-flex bg-purple-600 hover:bg-purple-700 text-white transition-all duration-200 px-6">
>>>>>>> d89a649a2dae1233eddebf1334c64eb38779d39d
                  Sign In
                </Button>
                <Button variant="ghost" size="icon" className="sm:hidden text-white hover:bg-purple-500/20">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            )}
<<<<<<< HEAD
          </div>
        </div>

        {/* MOBILE INLINE SEARCH BAR */}
        {showInlineSearch && (
          <div className="md:hidden pb-4 pt-2 animate-in fade-in slide-in-from-top-2">
            <div className="relative">
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search anime, movies..."
                className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:border-purple-500 focus:bg-white/20 transition-all duration-200"
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50 pointer-events-none" />
            </div>
          </div>
        )}

        {/* MOBILE NAVIGATION MENU */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 border-t border-white/10 space-y-2 animate-in fade-in slide-in-from-top-2 relative z-50">
=======

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
>>>>>>> d89a649a2dae1233eddebf1334c64eb38779d39d
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-3 rounded-lg font-medium transition-all duration-200
                  ${
                    isActive(item.path)
<<<<<<< HEAD
                      ? "bg-gradient-to-r from-purple-600/30 to-pink-600/30 text-purple-400 border-l-2 border-purple-500"
=======
                      ? "bg-purple-600/20 text-purple-400 border-l-2 border-purple-500"
>>>>>>> d89a649a2dae1233eddebf1334c64eb38779d39d
                      : "text-white/70 hover:text-white hover:bg-white/5"
                  }
                `}
              >
                {item.name}
              </Link>
            ))}
          </div>
        )}
<<<<<<< HEAD

        {mobileMenuOpen && (
          <div className="fixed inset-0 bg-black/40 z-40 md:hidden" onClick={() => setMobileMenuOpen(false)} />
        )}
      </div>
=======
      </div>

      {/* MOBILE SEARCH MODAL OVERLAY */}
      {mobileSearchOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setMobileSearchOpen(false)}>
          <div
            className="absolute top-16 left-0 right-0 p-4 bg-black/95 backdrop-blur-md border-b border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <SearchModal onClose={() => setMobileSearchOpen(false)} />
          </div>
        </div>
      )}
>>>>>>> d89a649a2dae1233eddebf1334c64eb38779d39d
    </nav>
  )
}

export default Navigation
