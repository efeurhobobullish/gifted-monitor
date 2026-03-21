import { Header } from "@/components/home"
import { Pattern } from "@/components/ui"

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <Pattern>
      <Header />
      <main className="text-main">
        {children}
      </main>
    </Pattern>
  )
}
