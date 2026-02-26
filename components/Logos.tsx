const logos = ["Precast Systems", "Commercial Build", "Infrastructure Ops", "Fabrication Labs"];

export default function Logos() {
  return (
    <section className="border-y border-white/10 bg-white/[0.02] py-8">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-6 md:grid-cols-4">
        {logos.map((logo) => (
          <div
            key={logo}
            className="rounded border border-white/10 bg-white/[0.03] px-4 py-3 text-center text-sm text-white/60 transition hover:text-white"
          >
            {logo}
          </div>
        ))}
      </div>
    </section>
  );
}
