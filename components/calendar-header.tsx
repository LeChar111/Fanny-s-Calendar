"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { CalendarDays, Sun, Moon, Search, ChevronDown, User, Heart, Database } from "lucide-react"

interface CalendarHeaderProps {
  selectedContinent: string
  onContinentChange: (continent: string) => void
  currentMonth: string
  onMonthChange: (month: string) => void
  searchQuery: string
  onSearchChange: (query: string) => void
  selectedEventType: string | null
  onEventTypeChange: (type: string | null) => void
  isLoggedIn: boolean
  userEmail: string
  savedEventsCount: number
  showOnlySaved: boolean
  onShowOnlySavedChange: (show: boolean) => void
  onSignOut: () => void
}

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

const continents = [
  { value: "all", label: "Filter by Continent" },
  { value: "Asia", label: "Asia" },
  { value: "Europe", label: "Europe" },
  { value: "Latin America", label: "Latin America" },
  { value: "North America", label: "North America" },
  { value: "Oceania", label: "Oceania" },
  { value: "Africa", label: "Africa" },
  { value: "Middle East", label: "Middle East" },
  { value: "Online", label: "Online" },
]

const eventTypes = ["conference", "workshop", "meetup", "festival", "online"] as const

export function CalendarHeader({
  selectedContinent,
  onContinentChange,
  currentMonth,
  onMonthChange,
  searchQuery,
  onSearchChange,
  selectedEventType,
  onEventTypeChange,
  isLoggedIn,
  userEmail,
  savedEventsCount,
  showOnlySaved,
  onShowOnlySavedChange,
  onSignOut,
}: CalendarHeaderProps) {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [authDialogOpen, setAuthDialogOpen] = useState(false)
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin")
  const [authEmail, setAuthEmail] = useState("")
  const [authPassword, setAuthPassword] = useState("")

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme")
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    const shouldBeDark = savedTheme === "dark" || (!savedTheme && prefersDark)

    setIsDarkMode(shouldBeDark)
    if (shouldBeDark) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [])

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Demo: just store email in localStorage
    localStorage.setItem("demoUser", authEmail)
    setAuthDialogOpen(false)
    setAuthEmail("")
    setAuthPassword("")
    // Reload to update parent state
    window.location.reload()
  }

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode
    setIsDarkMode(newDarkMode)

    if (newDarkMode) {
      document.documentElement.classList.add("dark")
      localStorage.setItem("theme", "dark")
    } else {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("theme", "light")
    }
  }

  const handleMonthSelect = (month: string) => {
    onMonthChange(month)
    window.location.hash = month.toLowerCase()
  }

  return (
    <>
      <header className="sticky top-0 z-50 border-b bg-background">
        <div className="max-w-[1400px] mx-auto px-4 py-4 space-y-4">
          {/* Top row: Title and User Actions */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <CalendarDays className="h-6 w-6 text-primary" />
              <div>
                <h1 className="text-4xl font-bold">Calendrier de Fanny</h1>
                <p className="text-sm text-muted-foreground">Réservation de créneaux facile pour tous ses potes, c'est une femme occupée</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <Sun className="h-4 w-4" />
                <Switch checked={isDarkMode} onCheckedChange={toggleDarkMode} aria-label="Toggle dark mode" />
                <Moon className="h-4 w-4" />
              </div>

              {isLoggedIn && (
                <Button
                  variant={showOnlySaved ? "default" : "outline"}
                  size="sm"
                  onClick={() => onShowOnlySavedChange(!showOnlySaved)}
                >
                  <Heart className="h-4 w-4 mr-2" />
                  My Events ({savedEventsCount})
                </Button>
              )}

              {isLoggedIn ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <User className="h-4 w-4 mr-2" />
                      {userEmail}
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={onSignOut}>Sign Out</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button variant="outline" size="sm" onClick={() => setAuthDialogOpen(true)}>
                  <User className="h-4 w-4 mr-2" />
                  Sign In
                </Button>
              )}

              <Button variant="outline" size="sm" onClick={() => window.print()}>
                Imprimer
              </Button>
            </div>
          </div>

          {/* Bottom row: Search, Button, and Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px] max-w-[300px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-9"
              />
            </div>

            <div className="flex-1 flex justify-center">
              <Dialog open={authDialogOpen} onOpenChange={setAuthDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="default" size="sm">
                    Réserver un créneau
                  </Button>
                </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>{authMode === "signin" ? "Sign In" : "Create Account"}</DialogTitle>
                  <DialogDescription>
                    {authMode === "signin"
                      ? "Sign in to save events and access them across devices."
                      : "Create an account to save events and access them across devices."}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAuthSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="authEmail">Email</Label>
                    <Input
                      id="authEmail"
                      type="email"
                      required
                      value={authEmail}
                      onChange={(e) => setAuthEmail(e.target.value)}
                      placeholder="you@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="authPassword">Password</Label>
                    <Input
                      id="authPassword"
                      type="password"
                      required
                      value={authPassword}
                      onChange={(e) => setAuthPassword(e.target.value)}
                      placeholder="Enter your password"
                    />
                  </div>
                  <DialogFooter>
                    <Button type="submit" className="w-full">
                      {authMode === "signin" ? "Sign In" : "Create Account"}
                    </Button>
                  </DialogFooter>
                  <div className="text-center text-sm text-muted-foreground">
                    {authMode === "signin" ? (
                      <>
                        Don't have an account?{" "}
                        <button
                          type="button"
                          className="underline hover:text-foreground"
                          onClick={() => setAuthMode("signup")}
                        >
                          Sign up
                        </button>
                      </>
                    ) : (
                      <>
                        Already have an account?{" "}
                        <button
                          type="button"
                          className="underline hover:text-foreground"
                          onClick={() => setAuthMode("signin")}
                        >
                          Sign in
                        </button>
                      </>
                    )}
                  </div>
                  <div className="flex items-start gap-2 p-3 rounded-md bg-muted/50 text-sm text-muted-foreground">
                    <User className="h-4 w-4 mt-0.5 shrink-0" />
                    <p>
                      For demo purposes, you can still sign in with any email and password to test the saved events
                      feature.
                    </p>
                  </div>
                  <div className="flex items-start gap-2 p-3 rounded-md bg-muted text-sm text-muted-foreground">
                    <Database className="h-4 w-4 mt-0.5 shrink-0" />
                    <p>
                      To enable real authentication, connect a database (Supabase, Neon, etc.) with auth support.
                    </p>
                  </div>
                </form>
              </DialogContent>
              </Dialog>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Select value={currentMonth} onValueChange={handleMonthSelect}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Choisir un mois" />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month) => (
                    <SelectItem key={month} value={month}>
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedContinent} onValueChange={onContinentChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by Continent" />
                </SelectTrigger>
                <SelectContent>
                  {continents.map((continent) => (
                    <SelectItem key={continent.value} value={continent.value}>
                      {continent.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    {selectedEventType
                      ? selectedEventType.charAt(0).toUpperCase() + selectedEventType.slice(1)
                      : "Event Type"}
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEventTypeChange(null)}>All Types</DropdownMenuItem>
                  {eventTypes.map((type) => (
                    <DropdownMenuItem key={type} onClick={() => onEventTypeChange(type)}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>
    </>
  )
}
