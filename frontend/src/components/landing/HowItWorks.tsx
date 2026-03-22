import { MailCheck, Globe, Bell } from "lucide-react";
import {
  ScrollAnimation,
  scrollRevealFromIndex,
  scrollRevealStaggerDelay,
} from "../ui";

interface StepProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  stepIndex: number;
}

function Step({ icon, title, description, stepIndex }: StepProps) {
  return (
    <ScrollAnimation
      from={scrollRevealFromIndex(stepIndex)}
      delay={scrollRevealStaggerDelay(stepIndex, { step: 0.05 })}
      amount={0.15}
      className="text-center space-y-4"
    >
      <div className="inline-flex relative z-10 items-center justify-center w-20 h-20 rounded-2xl bg-primary mb-4 transition-transform duration-200 hover:scale-[1.04]">
        {icon}
      </div>

      <h3 className="text-2xl font-bold text-primary-2">{title}</h3>

      <p className="text-muted text-sm max-w-sm mx-auto">{description}</p>
    </ScrollAnimation>
  );
}

export default function HowItWorks() {
  const steps = [
    {
      icon: <MailCheck size={40} className="text-white" />,
      title: "Sign up & verify",
      description:
        "Create an account with your email and complete OTP verification — quick and secure.",
    },
    {
      icon: <Globe size={40} className="text-white" />,
      title: "Add monitors",
      description:
        "Add the URLs you care about, pick check intervals, and configure HTTP method and expectations.",
    },
    {
      icon: <Bell size={40} className="text-white" />,
      title: "Get alerted",
      description:
        "Turn on WhatsApp, Telegram, and/or email alerts so you know the moment status changes.",
    },
  ];

  return (
    <section
      id="how-it-works"
      className="py-20 px-4 relative bg-gradient-to-b from-background to-secondary/50 backdrop-blur"
    >
      <div className="main">
        <ScrollAnimation from="up" amount={0.15} className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold font-space text-primary-2 mb-4">
            How Gifted Monitor works
          </h2>
          <p className="text-muted text-sm max-w-2xl mx-auto">
            A simple flow from signup to alerts — built for reliability and clarity.
          </p>
        </ScrollAnimation>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          <div className="hidden md:block absolute top-10 left-1/6 right-1/6 h-0.5 bg-primary/80 drop-shadow-2xl drop-shadow-primary" />

          {steps.map((step, index) => (
            <Step key={step.title} {...step} stepIndex={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
