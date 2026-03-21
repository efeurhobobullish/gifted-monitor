import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import ModeToggle from "../ui/mode-toggle";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const navs = [
  { label: "Home", href: "/" },
  { label: "Tutorial", href: "#tutorial" },
  { label: "Pricing", href: "#pricing" },
  { label: "Docs", href: "#docs" },
  { label: "FAQ", href: "#faq" },
];
  return (
    <>
      <header className="sticky z-100 w-full top-0 bg-gradient-to-b from-background via-background/80 to-transparent">
        <nav className="main flex items-center justify-between h-[90px] text-main">
          <Link to="/">
            <h3 className="font-semibold text-lg font-space">
              EmpireHost{" "}
              <span className="text-primary text-2xl">&bull;</span>
            </h3>
          </Link>

          <ul className="md:flex hidden items-center hover:gap-10 transition-all duration-300 border border-line gap-6 drop-shadow-2xl dark:drop-shadow-primary/30 drop-shadow-primary/10 bg-background dark:bg-secondary/30 backdrop-blur rounded-full px-6 py-4">
            {navs.map((nav) => (
              <li key={nav.href}>
                <a
                  href={nav.href}
                  className="text-xs font-medium hover:text-primary text-main/80 transition-colors"
                >
                  {nav.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-4">
            <ModeToggle />
            <Link
              to="/login"
              className="btn bg-secondary/70 backdrop-blur-sm px-4 h-10 rounded-full border border-line"
            >
              Login
            </Link>

            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(true)}
                className="h-10 w-10 bg-secondary/70 backdrop-blur-sm rounded-full"
              >
                <Menu size={20} />
              </button>
            </div>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scaleY: 0.5 }}
            animate={{ opacity: 1, scaleY: 1 }}
            exit={{ opacity: 0, scaleY: 0.5 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            style={{ originY: 0 }}
            className="fixed z-100 inset-0 bg-background/80 backdrop-blur h-[100vh] w-full flex flex-col pb-10"
          >
            <header className="main flex items-center justify-between h-[70px] text-main w-full">
              <h3 className="font-space text-xl font-medium">
                EmpireHost{" "}
                <span className="text-primary text-2xl">&bull;</span>
              </h3>
              <button onClick={() => setIsOpen(false)}>
                <X size={24} />
              </button>
            </header>

            <ul className="main grid grid-cols-1 w-full">
              {navs.map((nav, index) => (
                <motion.li
                  key={nav.href}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.3 }}
                  onClick={() => setIsOpen(false)}
                  className="border-b text-center py-4 border-line hover:bg-secondary/50 transition-all duration-300"
                >
                  <a
                    href={nav.href}
                    className="text-main/80 block text-lg hover:text-primary"
                  >
                    {nav.label}
                  </a>
                </motion.li>
              ))}
            </ul>

            <div className="main mt-auto w-full">
              <Link
                to="/login"
                className="btn btn-primary w-full h-10 rounded-full"
              >
                Login
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}