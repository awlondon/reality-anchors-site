const BASELINES = {
  small_shop: { label: "Small Shop", scrap: 0.08, delta: 0.02 },
  prefab_yard: { label: "Prefab Yard", scrap: 0.055, delta: 0.015 },
  industrial: { label: "Industrial", scrap: 0.035, delta: 0.01 }
};

function determinePlanTier(annualSavings) {
  if (annualSavings < 15000) return "<$15k savings → Estimated plan: $2k/year";
  if (annualSavings < 50000) return "$15–50k savings → Estimated plan: $6k/year";
  if (annualSavings < 150000) return "$50–150k savings → Estimated plan: $15k/year";
  return "$150k+ savings → Estimated plan: Custom";
}

function calculateSavings() {
  const tonsInput = document.getElementById("tonsPerMonth");
  const costInput = document.getElementById("steelCostPerTon");
  const segmentInput = document.getElementById("segment");

  if (!tonsInput || !costInput || !segmentInput) return;

  const tonsPerMonth = Number(tonsInput.value) || 0;
  const steelCostPerTon = Number(costInput.value) || 0;
  const segmentKey = segmentInput.value;

  const config = BASELINES[segmentKey];
  if (!config) return;

  const annualMaterialSavings = tonsPerMonth * 12 * steelCostPerTon * config.delta;

  const annualSavingsEl = document.getElementById("annualSavings");
  const planTierEl = document.getElementById("planTier");

  if (annualSavingsEl) {
    annualSavingsEl.textContent = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0
    }).format(annualMaterialSavings);
  }

  if (planTierEl) {
    planTierEl.textContent = determinePlanTier(annualMaterialSavings);
  }
}

function attachFormListeners() {
  const forms = document.querySelectorAll(".capture-form");
  forms.forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const formData = new FormData(form);
      const payload = Object.fromEntries(formData.entries());
      console.log(`[form:${form.dataset.form || "unknown"}] submission`, payload);
      form.reset();
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  attachFormListeners();

  const calculatorForm = document.getElementById("savings-form");
  if (calculatorForm) {
    calculatorForm.addEventListener("submit", (event) => {
      event.preventDefault();
      calculateSavings();
    });
  }
});
