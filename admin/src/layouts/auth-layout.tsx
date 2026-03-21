import { Header } from "@/components/auth";
import { Footer } from "@/components/landing";
import { Pattern } from "@/components/ui";

export default function AuthLayout({
  children,
  title,
  description,
}: {
  children: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <>
      <Pattern>
        <Header />
        <main className="text-main container py-10">
          <div className="space-y-6 drop-shadow-2xl pt-10 drop-shadow-primary/10 dark:bg-secondary bg-background p-4 md:p-6 rounded-2xl border border-line">
            <div className="space-y-2 text-center">
              <h3 className="text-2xl font-bold font-space">{title}</h3>
              <p className="text-muted text-sm">{description}</p>
            </div>
            {children}
          </div>
        </main>
      </Pattern>
      <Footer />
    </>
  );
}
