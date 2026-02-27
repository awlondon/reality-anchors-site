'use client';

type Inputs = {
  annualTonsProcessed: number;
  avgMaterialCostPerTon: number;
  annualFabricationRevenue: number;
  annualFabricationLaborCost: number;
  incrementalContributionMarginPct: number;
  currentScrapRatePct: number;
  targetScrapRatePct: number;
  preventableReworkLaborPct: number;
  reworkReductionPct: number;
  throughputImprovementPct: number;
  includeOversightRisk: boolean;
  annualQALaborCost: number;
  annualMajorErrorCost: number;
  errorReductionPct: number;
};

function NumInput({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <label className="block">
      <span className="block text-sm text-neutral-600 mb-2">{label}</span>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full border border-neutral-300 rounded-md px-3 py-2 text-sm"
      />
    </label>
  );
}

export default function InputSection({ inputs, setInputs }: { inputs: Inputs; setInputs: (v: Inputs) => void }) {
  const setField = (key: keyof Inputs, value: number | boolean) => setInputs({ ...inputs, [key]: value });

  return (
    <div className="space-y-10">
      <section className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
        <h2 className="text-lg font-medium mb-6">Facility Profile</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <NumInput label="Annual Tons Processed" value={inputs.annualTonsProcessed} onChange={(v) => setField('annualTonsProcessed', v)} />
          <NumInput label="Avg Material Cost per Ton ($)" value={inputs.avgMaterialCostPerTon} onChange={(v) => setField('avgMaterialCostPerTon', v)} />
          <NumInput label="Annual Revenue ($)" value={inputs.annualFabricationRevenue} onChange={(v) => setField('annualFabricationRevenue', v)} />
          <NumInput label="Annual Fabrication Labor Cost ($)" value={inputs.annualFabricationLaborCost} onChange={(v) => setField('annualFabricationLaborCost', v)} />
          <NumInput label="Contribution Margin (%)" value={inputs.incrementalContributionMarginPct} onChange={(v) => setField('incrementalContributionMarginPct', v)} />
        </div>
      </section>

      <section className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
        <h2 className="text-lg font-medium mb-6">Impact Assumptions</h2>
        <div className="space-y-8">
          <div>
            <h3 className="text-sm font-semibold text-neutral-700 mb-3">Material Efficiency</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <NumInput label="Current Scrap Rate (%)" value={inputs.currentScrapRatePct} onChange={(v) => setField('currentScrapRatePct', v)} />
              <NumInput label="Target Scrap Rate (%)" value={inputs.targetScrapRatePct} onChange={(v) => setField('targetScrapRatePct', v)} />
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-neutral-700 mb-3">Labor Rework</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <NumInput label="Preventable Rework (% of labor)" value={inputs.preventableReworkLaborPct} onChange={(v) => setField('preventableReworkLaborPct', v)} />
              <NumInput label="Rework Reduction (%)" value={inputs.reworkReductionPct} onChange={(v) => setField('reworkReductionPct', v)} />
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-neutral-700 mb-3">Throughput Capacity</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <NumInput label="Throughput Improvement (%)" value={inputs.throughputImprovementPct} onChange={(v) => setField('throughputImprovementPct', v)} />
            </div>
          </div>

          <details className="border border-neutral-200 rounded-lg p-4" open={inputs.includeOversightRisk}>
            <summary className="cursor-pointer text-sm font-semibold text-neutral-700">Include Oversight & Risk Model</summary>
            <div className="mt-4 grid md:grid-cols-2 gap-6">
              <NumInput label="Annual QA / Inspection Cost ($)" value={inputs.annualQALaborCost} onChange={(v) => setField('annualQALaborCost', v)} />
              <NumInput label="Annual Major Error Cost ($)" value={inputs.annualMajorErrorCost} onChange={(v) => setField('annualMajorErrorCost', v)} />
              <NumInput label="Error Reduction (%)" value={inputs.errorReductionPct} onChange={(v) => setField('errorReductionPct', v)} />
              <label className="flex items-end gap-2 text-sm text-neutral-700">
                <input type="checkbox" checked={inputs.includeOversightRisk} onChange={(e) => setField('includeOversightRisk', e.target.checked)} />
                Enable oversight/risk contribution
              </label>
            </div>
          </details>
        </div>
      </section>
    </div>
  );
}
