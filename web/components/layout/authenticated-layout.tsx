"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import {
  Home,
  Users,
  Award,
  Code,
  Send,
  PresentationIcon as PresentationScreen,
  User,
  Menu,
  X,
  Bell,
  LogOut,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface AuthenticatedLayoutProps {
  children: React.ReactNode
}

export default function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  // Fermer le menu mobile lors du changement de page
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  const navigation = [
    { name: "Tableau de bord", href: "/dashboard", icon: Home },
    { name: "Équipe", href: "/team", icon: Users },
    { name: "Défis", href: "/challenges", icon: Code },
    { name: "Classement", href: "/leaderboard", icon: Award },
    { name: "Soumissions", href: "/submissions", icon: Send },
  ]

  // Utilisateur fictif pour la démo
  const user = {
    name: "Ahmed Ben Ali",
    email: "ahmed@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    isAdmin: true,
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Barre de navigation */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/dashboard" className="flex items-center">
                <Image
                  src="/placeholder.svg?height=40&width=80"
                  alt="Logo IMSET"
                  width={80}
                  height={40}
                  className="h-8 w-auto"
                />
                <span className="ml-2 text-lg font-semibold text-[#222222] hidden sm:inline-block">
                  Hackathon IMSET
                </span>
              </Link>
            </div>

            {/* Navigation desktop */}
            <nav className="hidden md:flex space-x-4">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive ? "bg-[#d7b369]/10 text-[#d7b369]" : "text-[#000000de] hover:bg-gray-100"
                    }`}
                  >
                    <item.icon className="h-4 w-4 mr-2" />
                    {item.name}
                  </Link>
                )
              })}
              {user.isAdmin && (
                <Link
                  href="/datashow"
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    pathname === "/datashow" ? "bg-[#d7b369]/10 text-[#d7b369]" : "text-[#000000de] hover:bg-gray-100"
                  }`}
                >
                  <PresentationScreen className="h-4 w-4 mr-2" />
                  Data Show
                </Link>
              )}
            </nav>

            {/* Profil utilisateur et notifications */}
            <div className="flex items-center space-x-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-[#d7b369]"></span>
                    <span className="sr-only">Notifications</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="max-h-80 overflow-y-auto">
                    <div className="p-3 hover:bg-gray-100 cursor-pointer">
                      <p className="text-sm font-medium">Nouveau défi disponible</p>
                      <p className="text-xs text-gray-500">Il y a 2 heures</p>
                    </div>
                    <div className="p-3 hover:bg-gray-100 cursor-pointer">
                      <p className="text-sm font-medium">Votre équipe a un nouveau membre</p>
                      <p className="text-xs text-gray-500">Il y a 1 jour</p>
                    </div>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar>
                      <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profil</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/team" className="cursor-pointer flex items-center">
                      <Users className="mr-2 h-4 w-4" />
                      <span>Mon équipe</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/" className="cursor-pointer flex items-center text-[#710e20de]">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Déconnexion</span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Bouton menu mobile */}
              <div className="md:hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  aria-label="Menu principal"
                >
                  {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Menu mobile */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 z-20">
          <div className="container mx-auto px-4 py-2">
            <nav className="flex flex-col space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive ? "bg-[#d7b369]/10 text-[#d7b369]" : "text-[#000000de] hover:bg-gray-100"
                    }`}
                  >
                    <item.icon className="h-4 w-4 mr-2" />
                    {item.name}
                  </Link>
                )
              })}
              {user.isAdmin && (
                <Link
                  href="/datashow"
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    pathname === "/datashow" ? "bg-[#d7b369]/10 text-[#d7b369]" : "text-[#000000de] hover:bg-gray-100"
                  }`}
                >
                  <PresentationScreen className="h-4 w-4 mr-2" />
                  Data Show
                </Link>
              )}
            </nav>
          </div>
        </div>
      )}

      {/* Contenu principal */}
      <main className="flex-grow bg-gray-50">{children}</main>
    </div>
  )
}
