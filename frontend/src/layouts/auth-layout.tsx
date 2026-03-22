import {
  AuthLoginAside,
  AuthMobileBrand,
  AuthSignupAside,
} from "@/components/auth/auth-side-panels";
import { Footer, Header } from "@/components/landing";
import { Pattern } from "@/components/ui";

export type AuthLayoutVariant = "login" | "signup" | "default";

export default function AuthLayout({
  children,
  title,
  description,
  variant = "default",
}: {
  children: React.ReactNode;
  title: string;
  description: string;
  variant?: AuthLayoutVariant;
}) {
  const split = variant === "login" || variant === "signup";

  return (
    <>
      <Pattern>
        <Header />
        <main
          className={
            split
              ? "text-main w-full max-w-[90%] 2xl:max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-10 lg:py-12"
              : "text-main container py-10"
          }
        >
          {split ? (
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-12 lg:items-stretch">
              <aside className="hidden lg:flex lg:flex-col lg:border-r lg:border-line/80 lg:pr-8">
                {variant === "login" ? <AuthLoginAside /> : <AuthSignupAside />}
              </aside>

              <div className="flex min-h-0 flex-col justify-center">
                <AuthMobileBrand mode={variant} />
                <div className="mx-auto w-full max-w-md space-y-6 rounded-2xl border border-line bg-background p-5 shadow-sm drop-shadow-2xl drop-shadow-primary/5 dark:bg-secondary md:p-7 lg:mx-0 lg:max-w-none">
                  <div className="space-y-2 text-center lg:text-left">
                    <h2 className="font-space text-xl font-bold md:text-2xl">{title}</h2>
                    <p className="text-sm text-muted">{description}</p>
                  </div>
                  {children}
                </div>
              </div>
            </div>
          ) : (
            <div className="mx-auto max-w-md space-y-6 rounded-2xl border border-line bg-background p-4 pt-10 shadow-sm drop-shadow-2xl drop-shadow-primary/10 dark:bg-secondary md:p-6">
              <div className="space-y-2 text-center">
                <h3 className="font-space text-2xl font-bold">{title}</h3>
                <p className="text-sm text-muted">{description}</p>
              </div>
              {children}
            </div>
          )}
        </main>
      </Pattern>
      <Footer />
    </>
  );
}
