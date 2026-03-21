import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10"
    >
      <div className="main py-4">
        <div className="flex items-center justify-between">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="text-2xl font-bold bg-gradient-to-r from-[#FF10F0] via-[#8B5CF6] to-[#FFD700] bg-clip-text text-transparent"
          >
            SwingVector
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <a
              href="#home"
              className="text-main/80 hover:text-[#FF10F0] transition-colors"
            >
              Home
            </a>
            <a
              href="#how-it-works"
              className="text-main/80 hover:text-[#FF10F0] transition-colors"
            >
              How It Works
            </a>
            <a
              href="#technology"
              className="text-main/80 hover:text-[#FF10F0] transition-colors"
            >
              Technology
            </a>
            <a
              href="#pricing"
              className="text-main/80 hover:text-[#FF10F0] transition-colors"
            >
              Pricing
            </a>
            <a
              href="#testimonials"
              className="text-main/80 hover:text-[#FF10F0] transition-colors"
            >
              Testimonials
            </a>
            <a
              href="#faq"
              className="text-main/80 hover:text-[#FF10F0] transition-colors"
            >
              FAQ
            </a>
            <a
              href="#pricing"
              className="px-6 py-2 bg-gradient-to-r from-[#FF10F0] via-[#8B5CF6] to-[#FFD700] text-white rounded-lg font-semibold hover:opacity-90 transition-opacity glow-pink"
            >
              Get Started
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-main"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden mt-4 pb-4 space-y-4"
          >
            <a
              href="#home"
              className="block text-main/80 hover:text-[#FF10F0] transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Home
            </a>
            <a
              href="#how-it-works"
              className="block text-main/80 hover:text-[#FF10F0] transition-colors"
              onClick={() => setIsOpen(false)}
            >
              How It Works
            </a>
            <a
              href="#technology"
              className="block text-main/80 hover:text-[#FF10F0] transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Technology
            </a>
            <a
              href="#pricing"
              className="block text-main/80 hover:text-[#FF10F0] transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Pricing
            </a>
            <a
              href="#testimonials"
              className="block text-main/80 hover:text-[#FF10F0] transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Testimonials
            </a>
            <a
              href="#faq"
              className="block text-main/80 hover:text-[#FF10F0] transition-colors"
              onClick={() => setIsOpen(false)}
            >
              FAQ
            </a>
            <a
              href="#pricing"
              className="block px-6 py-2 bg-gradient-to-r from-[#FF10F0] via-[#8B5CF6] to-[#FFD700] text-white rounded-lg font-semibold text-center"
              onClick={() => setIsOpen(false)}
            >
              Get Started
            </a>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
}

