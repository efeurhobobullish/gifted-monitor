import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { useState, useEffect } from "react";

interface Testimonial {
  name: string;
  role: string;
  content: string;
}

const testimonials: Testimonial[] = [
  {
    name: "Daniel Okafor",
    role: "Automation Developer",
    content:
      "EmpireHost removed all the infrastructure stress for my WhatsApp bots. I deploy once and manage everything from the dashboard without worrying about uptime or crashes.",
  },
  {
    name: "Aisha Bello",
    role: "Small Business Owner",
    content:
      "I needed reliable automation for customer responses. EmpireHost made it simple to run my bot continuously without technical setup or maintenance.",
  },
  {
    name: "Michael Torres",
    role: "Backend Engineer",
    content:
      "The coin-based usage model is clear and fair. I can see exactly what each bot consumes, which makes scaling predictable.",
  },
  {
    name: "Grace Liu",
    role: "Startup Founder",
    content:
      "We run multiple bot instances for support and onboarding. EmpireHost keeps everything isolated and stable, which is critical for our operations.",
  },
  {
    name: "Samuel Adeyemi",
    role: "Product Manager",
    content:
      "Monitoring and logs are straightforward. When something goes wrong, we know immediately and can act without digging through servers.",
  },
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const goToPrevious = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  return (
    <section
      id="testimonials"
      className="py-20 px-4 relative bg-gradient-to-b from-background to-secondary/50 backdrop-blur"
    >
      <div className="main">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold font-space text-primary-2 mb-4">
            Trusted by teams building automation
          </h2>
          <p className="text-muted text-sm max-w-2xl mx-auto">
            Developers, businesses, and teams rely on EmpireHost to run and
            manage bot infrastructure reliably.
          </p>
        </motion.div>

        {/* Carousel */}
        <div className="relative max-w-4xl mx-auto">
          <div className="relative overflow-hidden rounded-2xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 80 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -80 }}
                transition={{ duration: 0.45 }}
                className="bg-background rounded-2xl p-6 md:p-12 border border-line"
              >
                <div className="flex flex-col gap-8">
                  <Quote size={36} className="text-primary" />

                  <p className="text-main leading-relaxed text-base">
                    “{testimonials[currentIndex].content}”
                  </p>

                  <div>
                    <h4 className="font-semibold text-main">
                      {testimonials[currentIndex].name}
                    </h4>
                    <p className="text-sm text-muted">
                      {testimonials[currentIndex].role}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full border border-line bg-background flex items-center justify-center hover:border-primary transition-colors"
          >
            <ChevronLeft size={22} />
          </button>

          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full border border-line bg-background flex items-center justify-center hover:border-primary transition-colors"
          >
            <ChevronRight size={22} />
          </button>

          {/* Indicators */}
          <div className="flex items-center justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? "w-8 bg-primary"
                    : "w-2 bg-muted/40 hover:bg-muted"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}