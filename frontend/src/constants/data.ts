import {
  LayoutDashboard,
  Bot,
  Coins,
  Store,
  Gift,
  Users,
  Code2,
} from "lucide-react";

/* ===========================
   TECH STACK (OPTIONAL UI USE)
=========================== */
export const libraries = [
  "React",
  "React Router",
  "Tailwind CSS",
  "Lucide React",
  "React Hook Form",
  "Zustand",
  "Axios",
  "Zod",
  "Sonner",
  "Framer Motion",
];

/* ===========================
   HERO (OPTIONAL – LANDING)
=========================== */
export const heroData = {
  title: "Monitor uptime 24/7",
  description:
    "Gifted Monitor checks your sites on a schedule and alerts you via WhatsApp, Telegram, or email when something fails or recovers.",
};

/* ===========================
   DASHBOARD NAV LINKS
   (USED BY HEADER + SLIDING MENU)
=========================== */
export const navlinks = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Monitors",
    href: "/monitors",
    icon: Bot,
  },
  {
    title: "My Coins",
    href: "/dashboard/coins",
    icon: Coins,
  },
  {
    title: "Store",
    href: "/dashboard/store",
    icon: Store,
  },
  {
    title: "Referral",
    href: "/dashboard/referral",
    icon: Gift,
  },
  {
    title: "Community",
    href: "/dashboard/community",
    icon: Users,
  },
  {
    title: "Developers",
    href: "/dashboard/developers",
    icon: Code2,
  },
];
/* ===========================
   OPTIONAL: BOT TEMPLATES
   (FOR TEMPLATES PAGE)
=========================== */
export const botTemplates = [
  {
    name: "Empire MD",
    description: "Feature-rich WhatsApp bot with admin tools and media support.",
    previewUrl: "https://github.com/efeurhobobullish/Empire-MD",
    repoUrl: "https://github.com/efeurhobobullish/Empire-MD",
    slug: "empire-md",
  },
  {
    name: "Gifted MD",
    description: "Lightweight WhatsApp bot optimized for speed and stability.",
    previewUrl: "https://github.com/efeurhobobullish/Gifted-MD",
    repoUrl: "https://github.com/efeurhobobullish/Gifted-MD",
    slug: "gifted-md",
  },
];