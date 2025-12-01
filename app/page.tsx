import Link from "next/link"
import {
  Smartphone,
  Tablet,
  Laptop,
  Monitor,
  Gamepad2,
  Shield,
  Clock,
  Award,
  Lock,
  ChevronRight,
  CalendarCheck,
  Truck,
  CheckCircle2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { PublicLayout } from "@/components/public/public-layout"

const devices = [
  { icon: Smartphone, label: "Smartphone", description: "iPhone, Samsung, Xiaomi e altri" },
  { icon: Tablet, label: "Tablet", description: "iPad, Galaxy Tab e altri" },
  { icon: Laptop, label: "Laptop", description: "MacBook, ThinkPad, XPS e altri" },
  { icon: Monitor, label: "Desktop", description: "PC fissi e All-in-One" },
  { icon: Gamepad2, label: "Console", description: "PlayStation, Xbox, Nintendo" },
]

const steps = [
  {
    number: "01",
    icon: CalendarCheck,
    title: "Prenota Online",
    description: "Scegli il servizio e fissa un appuntamento in pochi click",
  },
  {
    number: "02",
    icon: Truck,
    title: "Porta il Dispositivo",
    description: "Vieni in negozio o richiedi il ritiro a domicilio",
  },
  {
    number: "03",
    icon: CheckCircle2,
    title: "Ritira Riparato",
    description: "Ti avvisiamo quando è pronto, garanzia inclusa",
  },
]

const features = [
  {
    icon: Shield,
    title: "Garanzia 12 Mesi",
    description: "Tutti i nostri interventi sono coperti da garanzia completa",
  },
  {
    icon: Award,
    title: "Ricambi Originali",
    description: "Utilizziamo solo componenti di alta qualità certificati",
  },
  {
    icon: Clock,
    title: "Riparazioni Rapide",
    description: "La maggior parte degli interventi in giornata",
  },
  {
    icon: Lock,
    title: "Privacy Garantita",
    description: "I tuoi dati sono sempre al sicuro con noi",
  },
]

export default function HomePage() {
  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden hero-gradient">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute top-1/2 -left-20 h-60 w-60 rounded-full bg-primary/5 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="animate-fade-up text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              <span className="block text-balance">Riparazione</span>
              <span className="block gradient-text text-balance">Smartphone e PC</span>
            </h1>
            <p
              className="animate-fade-up delay-100 mx-auto mt-6 max-w-xl text-lg text-muted-foreground leading-relaxed text-balance opacity-0"
              style={{ animationFillMode: "forwards" }}
            >
              Servizio rapido, professionale e garantito. Affida i tuoi dispositivi a mani esperte e torna operativo in
              giornata.
            </p>
            <div
              className="animate-fade-up delay-200 mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row opacity-0"
              style={{ animationFillMode: "forwards" }}
            >
              <Button
                asChild
                size="lg"
                className="rounded-full px-8 shadow-lg shadow-primary/25 transition-smooth hover:shadow-xl hover:shadow-primary/30 hover:scale-105"
              >
                <Link href="/booking">
                  Prenota una Riparazione
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-full px-8 transition-smooth hover:scale-105 bg-transparent"
              >
                <Link href="/services">Vedi i Servizi</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Devices Section */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Cosa Ripariamo</h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Esperti nella riparazione di ogni tipo di dispositivo elettronico
            </p>
          </div>
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {devices.map((device, index) => (
              <Link
                key={device.label}
                href={`/services?device=${device.label.toLowerCase()}`}
                className="group animate-fade-up opacity-0"
                style={{ animationDelay: `${index * 100}ms`, animationFillMode: "forwards" }}
              >
                <div className="flex flex-col items-center rounded-2xl border border-border bg-card p-8 text-center transition-smooth hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-smooth group-hover:bg-primary group-hover:text-primary-foreground">
                    <device.icon className="h-8 w-8" />
                  </div>
                  <h3 className="mt-6 text-lg font-semibold">{device.label}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{device.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="bg-secondary/50 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Come Funziona</h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Tre semplici passaggi per riavere il tuo dispositivo come nuovo
            </p>
          </div>
          <div className="mt-16 grid gap-8 lg:grid-cols-3">
            {steps.map((step, index) => (
              <div
                key={step.number}
                className="animate-fade-up opacity-0 relative"
                style={{ animationDelay: `${index * 150}ms`, animationFillMode: "forwards" }}
              >
                <div className="relative rounded-2xl border border-border bg-card p-8">
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                      <step.icon className="h-7 w-7" />
                    </div>
                    <span className="text-5xl font-bold text-primary/20">{step.number}</span>
                  </div>
                  <h3 className="mt-6 text-xl font-semibold">{step.title}</h3>
                  <p className="mt-3 text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="absolute -right-4 top-1/2 hidden h-0.5 w-8 bg-border lg:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Perché Sceglierci</h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Qualità, velocità e trasparenza sono i nostri punti di forza
            </p>
          </div>
          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="animate-fade-up opacity-0 group rounded-2xl border border-border bg-card p-8 transition-smooth hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5"
                style={{ animationDelay: `${index * 100}ms`, animationFillMode: "forwards" }}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-smooth group-hover:bg-primary group-hover:text-primary-foreground">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-6 text-lg font-semibold">{feature.title}</h3>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden bg-primary py-20 sm:py-28">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-white/5 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
            Pronto a Riparare il Tuo Dispositivo?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-primary-foreground/80">
            Prenota ora e ricevi un preventivo gratuito. La maggior parte delle riparazioni viene completata in
            giornata.
          </p>
          <div className="mt-10">
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="rounded-full px-8 transition-smooth hover:scale-105"
            >
              <Link href="/booking">
                Prenota Ora
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </PublicLayout>
  )
}
