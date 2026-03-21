import { ScrollAnimation } from "../ui";

export default function Tutorial() {
  return (
    <section id="tutorial" className="py-20 relative main">
      {/* Header */}
      <ScrollAnimation className="text-center mb-16 max-w-2xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 font-space">
          Getting Started with EmpireHost
        </h2>
        <p className="text-muted text-sm max-w-2xl mx-auto">
          A quick walkthrough showing how to deploy, manage, and monitor your
          bots using EmpireHost.
        </p>
      </ScrollAnimation>

      {/* Video */}
      <ScrollAnimation>
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="w-full h-[500px] rounded-xl overflow-hidden border border-line bg-background">
            <iframe
              src="https://www.youtube.com/embed/1241IIr3q0U"
              title="EmpireHost Tutorial"
              frameBorder="0"
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            ></iframe>
          </div>

          <p className="text-center text-xs text-muted">
            Covers wallet funding, bot deployment, and basic runtime control.
          </p>
        </div>
      </ScrollAnimation>
    </section>
  );
}