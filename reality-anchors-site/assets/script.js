(function () {
  "use strict";

  const BASELINES = {
    small_shop: { baseline: 0.08, delta: 0.02, label: "Small commercial shop" },
    prefab: { baseline: 0.055, delta: 0.015, label: "Prefab yard" },
    industrial: { baseline: 0.035, delta: 0.01, label: "Industrial" }
  };

  function formatMoneyUSD(value) {
    if (!isFinite(value)) return "—";
    return value.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 });
  }

  function formatPct(value) {
    if (!isFinite(value)) return "—";
    return (value * 100).toFixed(1) + "%";
  }

  function determinePlanTier(annualSavings) {
    if (!isFinite(annualSavings) || annualSavings <= 0) return "—";
    if (annualSavings < 15000) return "Up to $15k value → $2k–$3k/year";
    if (annualSavings < 50000) return "$15k–$50k value → $6k–$9k/year";
    if (annualSavings < 150000) return "$50k–$150k value → $15k–$25k/year";
    return "$150k+ value → Custom enterprise agreement";
  }

  function calculateSavings(params) {
    const {
      tonsPerMonth,
      steelCostPerTon,
      segment,
      laborRate,
      hoursSavedPerTon
    } = params;

    const seg = BASELINES[segment] || BASELINES.small_shop;
    const annualTons = tonsPerMonth * 12;

    const materialSavings = annualTons * steelCostPerTon * seg.delta;

    let laborSavings = 0;
    const useLabor = isFinite(laborRate) && laborRate > 0 && isFinite(hoursSavedPerTon) && hoursSavedPerTon > 0;
    if (useLabor) {
      laborSavings = annualTons * hoursSavedPerTon * laborRate;
    }

    const totalSavings = materialSavings + laborSavings;

    return {
      baselineScrap: seg.baseline,
      deltaScrap: seg.delta,
      materialSavings,
      laborSavings,
      totalSavings,
      planTier: determinePlanTier(totalSavings),
      segmentLabel: seg.label
    };
  }

  function attachFormListeners() {
    // Generic “log-only” forms
    const forms = document.querySelectorAll("form[data-form]");
    forms.forEach((form) => {
      form.addEventListener("submit", (e) => {
        e.preventDefault();

        const formName = form.getAttribute("data-form") || "form";
        const data = Object.fromEntries(new FormData(form).entries());

        // Calculator is handled separately (still logged)
        if (formName !== "calculator") {
          console.log(`[RealityAnchors] ${formName} submission`, data);
          alert("Submitted (logged locally). Replace with backend wiring when ready.");
          form.reset();
          return;
        }

        console.log(`[RealityAnchors] calculator submission`, data);
      });
    });

    // Calculator special handling (if present on page)
    const calcForm = document.getElementById("calcForm");
    if (!calcForm) return;

    const baselineEl = document.getElementById("baselineScrap");
    const deltaEl = document.getElementById("deltaScrap");
    const materialEl = document.getElementById("materialSavings");
    const laborEl = document.getElementById("laborSavings");
    const totalEl = document.getElementById("totalSavings");
    const tierEl = document.getElementById("planTier");

    function readNumber(id) {
      const el = document.getElementById(id);
      if (!el) return NaN;
      const v = parseFloat(el.value);
      return isFinite(v) ? v : NaN;
    }

    function readString(id) {
      const el = document.getElementById(id);
      return el ? String(el.value || "") : "";
    }

    function runCalc() {
      const tonsPerMonth = readNumber("tonsPerMonth");
      const steelCostPerTon = readNumber("steelCost");
      const segment = readString("segment") || "small_shop";
      const laborRate = readNumber("laborRate");
      const hoursSavedPerTon = readNumber("hoursSavedPerTon");

      const res = calculateSavings({
        tonsPerMonth,
        steelCostPerTon,
        segment,
        laborRate,
        hoursSavedPerTon
      });

      if (baselineEl) baselineEl.textContent = formatPct(res.baselineScrap);
      if (deltaEl) deltaEl.textContent = formatPct(res.deltaScrap);
      if (materialEl) materialEl.textContent = formatMoneyUSD(res.materialSavings);
      if (laborEl) laborEl.textContent = formatMoneyUSD(res.laborSavings);
      if (totalEl) totalEl.textContent = formatMoneyUSD(res.totalSavings);
      if (tierEl) tierEl.textContent = res.planTier;
    }

    calcForm.addEventListener("submit", (e) => {
      e.preventDefault();
      runCalc();
    });

    const resetBtn = document.getElementById("resetBtn");
    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        calcForm.reset();
        // Clear result fields
        if (baselineEl) baselineEl.textContent = "—";
        if (deltaEl) deltaEl.textContent = "—";
        if (materialEl) materialEl.textContent = "—";
        if (laborEl) laborEl.textContent = "—";
        if (totalEl) totalEl.textContent = "—";
        if (tierEl) tierEl.textContent = "—";
      });
    }

    // Initial populate
    runCalc();
  }

  // expose for debugging if needed
  window.RealityAnchors = {
    calculateSavings,
    determinePlanTier,
    attachFormListeners
  };

  document.addEventListener("DOMContentLoaded", attachFormListeners);
})();
