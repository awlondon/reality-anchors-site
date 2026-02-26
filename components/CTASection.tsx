import { trackEvent } from "@/lib/analytics";

export default function CTASection() {
  return (
    <section className="bg-slate-950 py-16">
      <div className="mx-auto max-w-5xl rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-10 text-center">
        <h2 className="text-3xl font-semibold">Ready to modernize fabrication?</h2>
        <p className="mt-3 text-white/75">Launch governed workflows, validate decisions, and accelerate measurable outcomes.</p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <a
            href="#contact"
            onClick={() => trackEvent("cta_click", { location: "cta_section", cta: "schedule_demo" })}
            className="rounded-md bg-indigoCalm px-5 py-3 font-medium hover:bg-indigo-400"
          >
            Schedule Demo
          </a>
          <a
            href="#"
            onClick={() => trackEvent("cta_click", { location: "cta_section", cta: "download_overview" })}
            className="rounded-md border border-white/35 px-5 py-3 font-medium hover:bg-white/10"
          >
            Download Technical Overview (PDF)
          </a>
        </div>
      </div>
    </section>
  );
}
