import Image from "next/image";

const studies = [
  {
    title: "Industrial Precast Group",
    summary: "Reduced scrap by 17% across two plants in 90 days by standardizing planning workflows and field validation practices.",
  },
  {
    title: "Commercial Rebar Network",
    summary: "Improved schedule adherence by 11% with stronger pre-dispatch validation and clearer execution handoffs.",
  },
  {
    title: "Independent Fabricators",
    summary: "Raised cut-list precision by 9% in month one through auditable AI-assisted decision workflows.",
  },
];

export default function CaseStudies() {
  return (
    <section id="case-studies" className="bg-white text-slate-900">
      <div className="mx-auto max-w-7xl px-6 py-20">
        <h2 className="text-3xl font-semibold">Case studies grounded in operations</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {studies.map((study) => (
            <article key={study.title} className="rounded-xl border border-slate-200 p-5 transition hover:-translate-y-1 hover:shadow-lg">
              <Image
                src="/fallback-hero.svg"
                alt="Abstract project thumbnail"
                width={480}
                height={280}
                className="h-36 w-full rounded-md object-cover"
              />
              <h3 className="mt-4 text-lg font-semibold">{study.title}</h3>
              <p className="mt-2 text-slate-700">{study.summary}</p>
              <a href="#contact" className="mt-4 inline-block font-medium text-indigo-700 hover:underline">Read More</a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
