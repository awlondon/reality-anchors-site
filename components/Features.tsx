const features = [
  {
    title: "Deterministic Workflows",
    description: "Apply hard governance rules so optimization outputs stay auditable and policy-safe across every team.",
  },
  {
    title: "Validation Pipeline",
    description: "Run multi-stage checks before execution to reduce fabrication errors and improve downstream confidence.",
  },
  {
    title: "Deployment Readiness",
    description: "Roll out templates rapidly to field crews with clear versioning, logs, and role-based controls.",
  },
];

export default function Features() {
  return (
    <section id="solutions" className="mx-auto max-w-7xl px-6 py-20">
      <h2 className="text-3xl font-semibold">Built for enterprise-grade reliability</h2>
      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {features.map((feature) => (
          <article
            key={feature.title}
            className="rounded-xl border border-white/15 bg-white/[0.03] p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <h3 className="text-xl font-medium">{feature.title}</h3>
            <p className="mt-3 text-white/75">{feature.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
