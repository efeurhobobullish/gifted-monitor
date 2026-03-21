import { Footer, Header } from "@/components/landing"
import { Pattern } from "@/components/ui"

export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return (
    <Pattern>
      <Header />
      <main className="text-main">
        {children}
      </main>
      <Footer />
    </Pattern>
  )
}
