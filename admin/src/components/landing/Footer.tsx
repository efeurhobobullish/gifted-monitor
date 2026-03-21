import { motion } from "framer-motion";
import {
  Linkedin,
  Send,
  Instagram,
  Mail,
  Twitter,
  MessageCircle,
} from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-line bg-secondary text-main">
      <div className="main py-12 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-10">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="font-space text-lg font-semibold">
              EmpireHost
            </h3>

            <p className="text-muted text-sm max-w-sm leading-relaxed">
              EmpireHost is a deployment and automation platform designed to help
              users run and scale messaging bots with reliability, transparency,
              and a coin-based runtime system.
            </p>

            <div className="flex gap-3 pt-2">
              <motion.a
                href="https://linkedin.com/in/efeurhobobullish"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -2 }}
                className="w-10 h-10 rounded-md border border-line bg-background flex items-center justify-center text-muted hover:text-primary hover:border-primary transition"
              >
                <Linkedin size={18} />
              </motion.a>

              <motion.a
                href="https://t.me/only_one_empire"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -2 }}
                className="w-10 h-10 rounded-md border border-line bg-background flex items-center justify-center text-muted hover:text-primary hover:border-primary transition"
              >
                <Send size={18} />
              </motion.a>

              <motion.a
                href="https://instagram.com/only_one__empire"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -2 }}
                className="w-10 h-10 rounded-md border border-line bg-background flex items-center justify-center text-muted hover:text-primary hover:border-primary transition"
              >
                <Instagram size={18} />
              </motion.a>

              <motion.a
                href="mailto:contact@empiretech.net.ng"
                whileHover={{ y: -2 }}
                className="w-10 h-10 rounded-md border border-line bg-background flex items-center justify-center text-muted hover:text-primary hover:border-primary transition"
              >
                <Mail size={18} />
              </motion.a>
            </div>
          </div>

          {/* Navigation */}
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h4 className="font-space text-sm font-semibold uppercase mb-4">
                Product
              </h4>
              <ul className="space-y-3">
                <li><a href="#" className="footer-link">Features</a></li>
                <li><a href="#pricing" className="footer-link">Pricing</a></li>
                <li><a href="#" className="footer-link">Documentation</a></li>
                <li><a href="#" className="footer-link">Status</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-space text-sm font-semibold uppercase mb-4">
                Company
              </h4>
              <ul className="space-y-3">
                <li><a href="#" className="footer-link">About</a></li>
                <li><a href="#faq" className="footer-link">FAQ</a></li>
                <li><a href="#" className="footer-link">Contact</a></li>
              </ul>
            </div>
          </div>

          {/* Follow */}
          <div>
            <h4 className="font-space text-sm font-semibold uppercase mb-4">
              Connect
            </h4>
            <div className="flex flex-col gap-3">
              <a
                href="https://instagram.com/only_one__empire"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-link flex items-center gap-2"
              >
                <Instagram size={16} />
                Instagram
              </a>

              <a
                href="https://twitter.com/only_one_Empire"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-link flex items-center gap-2"
              >
                <Twitter size={16} />
                Twitter (X)
              </a>

              <a
                href="https://t.me/only_one_empire"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-link flex items-center gap-2"
              >
                <MessageCircle size={16} />
                Telegram
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-6 border-t border-line flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted text-sm">
            © {currentYear} EmpireHost. All rights reserved.
          </p>

          <div className="flex gap-6">
            <a href="#" className="footer-link text-sm">
              Privacy Policy
            </a>
            <a href="#" className="footer-link text-sm">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}