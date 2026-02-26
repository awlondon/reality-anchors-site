"use client";

import { FormEvent, useState } from "react";
import { trackEvent } from "@/lib/analytics";

type FormErrors = {
  email?: string;
  name?: string;
};

export default function LeadForm() {
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSuccess(false);

    const form = event.currentTarget;
    const data = new FormData(form);

    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();

    const nextErrors: FormErrors = {};
    if (name.length < 2) nextErrors.name = "Please enter your full name.";
    if (!/^\S+@\S+\.\S+$/.test(email)) nextErrors.email = "Please enter a valid work email.";
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return;

    setLoading(true);
    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(data.entries())),
      });

      if (!response.ok) throw new Error("Lead submission failed");

      trackEvent("lead_submitted", { source: "homepage" });
      setSuccess(true);
      form.reset();
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="mx-auto max-w-7xl px-6 py-20">
      <div className="grid gap-8 rounded-2xl border border-white/15 bg-slate-900/50 p-8 md:grid-cols-2">
        <div>
          <h2 className="text-3xl font-semibold">Request a scoped consultation</h2>
          <p className="mt-3 text-white/75">Share your requirements and we’ll respond with fit assessment, scope, and rollout timeline.</p>
        </div>
        <form className="grid grid-cols-1 gap-4 sm:grid-cols-2" onSubmit={onSubmit} noValidate>
          <label>
            <span className="mb-1 block text-sm">Full Name</span>
            <input name="name" required className="w-full rounded-md border border-white/25 bg-slate-950 px-3 py-2" />
            {errors.name && <span className="mt-1 block text-sm text-rose-300">{errors.name}</span>}
          </label>
          <label>
            <span className="mb-1 block text-sm">Work Email</span>
            <input name="email" type="email" required className="w-full rounded-md border border-white/25 bg-slate-950 px-3 py-2" />
            {errors.email && <span className="mt-1 block text-sm text-rose-300">{errors.email}</span>}
          </label>
          <label>
            <span className="mb-1 block text-sm">Company</span>
            <input name="company" className="w-full rounded-md border border-white/25 bg-slate-950 px-3 py-2" />
          </label>
          <label>
            <span className="mb-1 block text-sm">Role</span>
            <input name="role" className="w-full rounded-md border border-white/25 bg-slate-950 px-3 py-2" />
          </label>
          <label className="sm:col-span-2">
            <span className="mb-1 block text-sm">Message (optional)</span>
            <textarea name="message" rows={4} className="w-full rounded-md border border-white/25 bg-slate-950 px-3 py-2" />
          </label>
          <button
            type="submit"
            disabled={loading}
            className="sm:col-span-2 rounded-md bg-indigoCalm px-5 py-3 font-medium transition hover:bg-indigo-400 disabled:opacity-70"
          >
            {loading ? "Submitting..." : "Request Demo"}
          </button>
          {success && <p className="sm:col-span-2 rounded border border-emerald-400/30 bg-emerald-500/10 p-3 text-emerald-200">Thanks! We’ll contact you shortly.</p>}
        </form>
      </div>
    </section>
  );
}
