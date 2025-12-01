"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X, Wrench } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/services", label: "Servizi" },
    { href: "/booking", label: "Prenota" },
    { href: "/customer/track", label: "Traccia Riparazione" },
  ]

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "glass border-b border-border/50 shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-smooth group-hover:scale-105">
              <Wrench className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold tracking-tight">
              Tech<span className="gradient-text">Repair</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm font-medium text-muted-foreground transition-smooth hover:text-foreground rounded-lg hover:bg-secondary"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Button
              asChild
              size="lg"
              className="rounded-full px-6 shadow-lg shadow-primary/25 transition-smooth hover:shadow-xl hover:shadow-primary/30 hover:scale-105"
            >
              <Link href="/booking">Prenota Ora</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="flex h-10 w-10 items-center justify-center rounded-lg md:hidden hover:bg-secondary transition-smooth"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="animate-fade-in border-t border-border/50 bg-background pb-6 md:hidden">
            <div className="flex flex-col gap-2 pt-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-4 py-3 text-base font-medium text-muted-foreground transition-smooth hover:text-foreground rounded-lg hover:bg-secondary"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-4 px-4">
                <Button asChild size="lg" className="w-full rounded-full">
                  <Link href="/booking">Prenota Ora</Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
