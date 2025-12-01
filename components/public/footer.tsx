import Link from "next/link"
import { Wrench, MapPin, Phone, Mail, Clock } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border bg-secondary/30">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Wrench className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold">
                Tech<span className="gradient-text">Repair</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Centro assistenza specializzato nella riparazione di smartphone, tablet, laptop e dispositivi elettronici.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">Link Utili</h3>
            <ul className="space-y-3">
              {[
                { href: "/services", label: "I Nostri Servizi" },
                { href: "/booking", label: "Prenota Riparazione" },
                { href: "/customer/track", label: "Traccia Riparazione" },
                { href: "/admin", label: "Area Riservata" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground transition-smooth hover:text-primary">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">Contatti</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
                <span>Via Roma 123, 00100 Roma</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 shrink-0 text-primary" />
                <span>+39 06 1234567</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 shrink-0 text-primary" />
                <span>info@techrepair.it</span>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">Orari</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-muted-foreground">
                <Clock className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
                <div>
                  <p className="font-medium text-foreground">Lun - Ven</p>
                  <p>09:00 - 19:00</p>
                </div>
              </li>
              <li className="flex items-start gap-3 text-sm text-muted-foreground">
                <Clock className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
                <div>
                  <p className="font-medium text-foreground">Sabato</p>
                  <p>09:00 - 13:00</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} TechRepair. Tutti i diritti riservati.
          </p>
          <div className="flex gap-6">
            <Link href="#" className="text-sm text-muted-foreground transition-smooth hover:text-primary">
              Privacy Policy
            </Link>
            <Link href="#" className="text-sm text-muted-foreground transition-smooth hover:text-primary">
              Termini di Servizio
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
