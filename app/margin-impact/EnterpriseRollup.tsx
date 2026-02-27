'use client';

import { ReactNode, useMemo, useState } from 'react';
import { formatPct, formatUSD } from '@/lib/marginModel';
import { calculateIRR, calculateNPV } from '@/lib/finance';

function AcronymHint({ acronym, caption }: { acronym: string; caption: string }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const isOpen = isHovered || isPinned;

  return (
    <span className="relative inline-flex items-center gap-1">
      <button
        type="button"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onFocus={() => setIsHovered(true)}
        onBlur={() => setIsHovered(false)}
        onClick={() => setIsPinned((prev) => !prev)}
        className="underline decoration-dotted underline-offset-4 hover:text-neutral-900"
        aria-expanded={isOpen}
        aria-label={`${acronym}: ${caption}`}
      >
        {acronym}
      </button>
      {isOpen ? (
        <span className="absolute left-0 top-full z-20 mt-1 w-64 rounded-md bg-neutral-900 px-3 py-2 text-[11px] font-normal normal-case tracking-normal text-white shadow-lg">
          {caption}
        </span>
      ) : null}
    </span>
  );
}

function Input({ label, value, onChange }: { label: ReactNode; value: number; onChange: (n: number) => void }) {
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

function SummaryCard({ title, value }: { title: ReactNode; value: string }) {
  return (
    <div>
      <div className="text-sm text-neutral-500">{title}</div>
      <div className="text-lg font-semibold mt-1">{value}</div>
    </div>
  );
}

function Metric({ label, value }: { label: ReactNode; value: string }) {
  return (
    <div>
      <div className="text-neutral-400 text-xs uppercase tracking-wide">{label}</div>
      <div className="text-xl font-semibold mt-2">{value}</div>
    </div>
  );
}

type Scenario = 'low' | 'base' | 'high';

type Cohort = {
  yearStarted: number;
  facilities: number;
  arrPerFacility: number;
};

const SCENARIO_MULTIPLIER: Record<Scenario, number> = {
  low: 0.75,
  base: 1,
  high: 1.35,
};

const CAPTURE_RATE: Record<Scenario, number> = {
  low: 0.08,
  base: 0.12,
  high: 0.15,
};

export default function EnterpriseRollup({
  perFacilityEbitdaIncrease,
  perFacilityRevenue,
}: {
  perFacilityEbitdaIncrease: number;
  perFacilityRevenue: number;
}) {
  const term = {
    EBITDA: () => <AcronymHint acronym="EBITDA" caption="Earnings Before Interest, Taxes, Depreciation, and Amortization" />,
    ARR: () => <AcronymHint acronym="ARR" caption="Annual Recurring Revenue" />,
    NRR: () => <AcronymHint acronym="NRR" caption="Net Revenue Retention" />,
    LTV: () => <AcronymHint acronym="LTV" caption="Lifetime Value" />,
    ROI: () => <AcronymHint acronym="ROI" caption="Return on Investment" />,
    NPV: () => <AcronymHint acronym="NPV" caption="Net Present Value" />,
    IRR: () => <AcronymHint acronym="IRR" caption="Internal Rate of Return" />,
    SaaS: () => <AcronymHint acronym="SaaS" caption="Software as a Service" />,
    RD: () => <AcronymHint acronym="R&D" caption="Research and Development" />,
    GA: () => <AcronymHint acronym="G&A" caption="General and Administrative" />,
  };

  const [investorMode, setInvestorMode] = useState(false);
  const [scenario, setScenario] = useState<Scenario>('base');
  const [captureBand, setCaptureBand] = useState<Scenario>('base');

  const [totalFacilities, setTotalFacilities] = useState(100);
  const [deploymentYears, setDeploymentYears] = useState(3);
  const [projectionYears, setProjectionYears] = useState(5);
  const [discountRate, setDiscountRate] = useState(10);
  const [valuationMultiple, setValuationMultiple] = useState(8);
  const [arrMultiple, setArrMultiple] = useState(8);

  const [hardwareCost, setHardwareCost] = useState(8000);
  const [implementationCost, setImplementationCost] = useState(12000);
  const [annualSubscription, setAnnualSubscription] = useState(70000);

  const [grossChurnPct, setGrossChurnPct] = useState(5);
  const [expansionPct, setExpansionPct] = useState(12);

  const [grossMarginPct, setGrossMarginPct] = useState(80);
  const [salesPct, setSalesPct] = useState(25);
  const [rdPct, setRdPct] = useState(18);
  const [gaPct, setGaPct] = useState(12);

  const model = useMemo(() => {
    const safeDeploymentYears = Math.max(1, deploymentYears);
    const safeProjectionYears = Math.max(1, projectionYears);
    const facilitiesPerYear = totalFacilities / safeDeploymentYears;

    const scenarioMultiplier = SCENARIO_MULTIPLIER[scenario];
    const captureRate = CAPTURE_RATE[captureBand];
    const adjustedEbitda = perFacilityEbitdaIncrease * scenarioMultiplier;

    const churnRate = Math.max(0, grossChurnPct / 100);
    const expansionRate = Math.max(0, expansionPct / 100);
    const netRevenueRetention = Math.max(0, 1 - churnRate + expansionRate);

    const grossMargin = Math.max(0, grossMarginPct / 100);
    const salesRate = Math.max(0, salesPct / 100);
    const rdRate = Math.max(0, rdPct / 100);
    const gaRate = Math.max(0, gaPct / 100);

    let cumulativeImpact = 0;
    let cumulativeInvestment = 0;
    let cumulativeNet = 0;
    let paybackYear: number | null = null;

    const cashFlows: number[] = [0];
    const arrByYear: number[] = [];
    const saasEbitdaByYear: number[] = [];
    const cohorts: Cohort[] = [];

    for (let year = 1; year <= safeProjectionYears; year++) {
      const deployed = year <= safeDeploymentYears ? facilitiesPerYear * year : totalFacilities;
      const newlyDeployed = year <= safeDeploymentYears ? facilitiesPerYear : 0;

      const annualBenefit = deployed * adjustedEbitda;
      const annualCapex = newlyDeployed * (hardwareCost + implementationCost);
      const annualOpex = deployed * annualSubscription;
      const annualNet = annualBenefit - annualCapex - annualOpex;

      cumulativeImpact += annualBenefit;
      cumulativeInvestment += annualCapex + annualOpex;
      cumulativeNet += annualNet;
      cashFlows.push(annualNet);

      if (paybackYear === null && cumulativeNet > 0) paybackYear = year;

      if (newlyDeployed > 0) {
        cohorts.push({
          yearStarted: year,
          facilities: newlyDeployed,
          arrPerFacility: adjustedEbitda * captureRate,
        });
      }

      let totalARRThisYear = 0;
      cohorts.forEach((cohort) => {
        const yearsActive = year - cohort.yearStarted;
        const growthFactor = Math.pow(netRevenueRetention, yearsActive);
        const cohortARR = cohort.facilities * cohort.arrPerFacility * growthFactor;
        totalARRThisYear += cohortARR;
      });

      arrByYear.push(totalARRThisYear);

      const grossProfit = totalARRThisYear * grossMargin;
      const operatingCosts = totalARRThisYear * (salesRate + rdRate + gaRate);
      saasEbitdaByYear.push(grossProfit - operatingCosts);
    }

    const annualPortfolioImpact = adjustedEbitda * totalFacilities;
    const portfolioRevenue = perFacilityRevenue * totalFacilities;
    const portfolioMarginLiftPct = portfolioRevenue > 0 ? (annualPortfolioImpact / portfolioRevenue) * 100 : 0;
    const roiMultiple = cumulativeInvestment > 0 ? cumulativeNet / cumulativeInvestment : 0;

    const npv = calculateNPV(Math.max(0, discountRate / 100), cashFlows);
    const irr = calculateIRR(cashFlows);

    const initialARR = arrByYear[0] || 0;
    const finalYearARR = arrByYear[arrByYear.length - 1] || 0;
    const arrCagr = safeProjectionYears > 1 && initialARR > 0
      ? Math.pow(finalYearARR / initialARR, 1 / (safeProjectionYears - 1)) - 1
      : 0;

    const finalYearSaasEbitda = saasEbitdaByYear[saasEbitdaByYear.length - 1] || 0;
    const saasEbitdaMarginPct = finalYearARR > 0 ? (finalYearSaasEbitda / finalYearARR) * 100 : 0;

    const arrValuationImpact = finalYearARR * arrMultiple;
    const ebitdaValuationImpact = finalYearSaasEbitda * valuationMultiple;
    const ruleOf40Pct = arrCagr * 100 + saasEbitdaMarginPct;

    const ltvPerFacility =
      churnRate > 0 && cohorts.length > 0
        ? (cohorts[0].arrPerFacility * grossMargin) / churnRate
        : null;

    const cohortFinalYearContributions = cohorts.map((cohort) => {
      const yearsActive = safeProjectionYears - cohort.yearStarted;
      return {
        label: `Cohort Year ${cohort.yearStarted}`,
        value: cohort.facilities * cohort.arrPerFacility * Math.pow(netRevenueRetention, yearsActive),
      };
    });

    function buildScenarioSnapshot(multiplier: number, benefitHaircut = 1, deploymentSlowdown = 1) {
      const scenarioEbitda = perFacilityEbitdaIncrease * multiplier * benefitHaircut;
      const scenarioCohorts: Cohort[] = [];
      const scenarioArrByYear: number[] = [];
      const scenarioSaasEbitda: number[] = [];
      const scenarioCashFlows: number[] = [0];
      const effectiveDeploymentYears = Math.max(1, Math.ceil(safeDeploymentYears * deploymentSlowdown));
      const scenarioFacilitiesPerYear = totalFacilities / effectiveDeploymentYears;
      let scenarioCumulativeNet = 0;
      let scenarioPaybackYear: number | null = null;

      for (let year = 1; year <= safeProjectionYears; year++) {
        const deployed = year <= effectiveDeploymentYears ? scenarioFacilitiesPerYear * year : totalFacilities;
        const newlyDeployed = year <= effectiveDeploymentYears ? scenarioFacilitiesPerYear : 0;

        const annualBenefit = deployed * scenarioEbitda;
        const annualCapex = newlyDeployed * (hardwareCost + implementationCost);
        const annualOpex = deployed * annualSubscription;
        const annualNet = annualBenefit - annualCapex - annualOpex;

        scenarioCumulativeNet += annualNet;
        scenarioCashFlows.push(annualNet);
        if (scenarioPaybackYear === null && scenarioCumulativeNet > 0) scenarioPaybackYear = year;

        if (newlyDeployed > 0) {
          scenarioCohorts.push({ yearStarted: year, facilities: newlyDeployed, arrPerFacility: scenarioEbitda * captureRate });
        }

        let scenarioArr = 0;
        for (const cohort of scenarioCohorts) {
          const yearsActive = year - cohort.yearStarted;
          scenarioArr += cohort.facilities * cohort.arrPerFacility * Math.pow(netRevenueRetention, yearsActive);
        }
        scenarioArrByYear.push(scenarioArr);

        const gp = scenarioArr * grossMargin;
        const op = scenarioArr * (salesRate + rdRate + gaRate);
        scenarioSaasEbitda.push(gp - op);
      }

      const sInit = scenarioArrByYear[0] || 0;
      const sFinalArr = scenarioArrByYear[scenarioArrByYear.length - 1] || 0;
      const sCagr = safeProjectionYears > 1 && sInit > 0 ? Math.pow(sFinalArr / sInit, 1 / (safeProjectionYears - 1)) - 1 : 0;
      const sFinalEbitda = scenarioSaasEbitda[scenarioSaasEbitda.length - 1] || 0;
      const sMargin = sFinalArr > 0 ? (sFinalEbitda / sFinalArr) * 100 : 0;
      const sIrr = calculateIRR(scenarioCashFlows);
      const sNpv = calculateNPV(Math.max(0, discountRate / 100), scenarioCashFlows);

      return {
        finalARR: sFinalArr,
        arrCAGR: sCagr,
        netRevenueRetentionPct: netRevenueRetention * 100,
        ebitdaMarginPct: sMargin,
        irrPct: sIrr !== null ? sIrr * 100 : 0,
        npv: sNpv,
        paybackYear: scenarioPaybackYear,
        arrValuationImpact: sFinalArr * arrMultiple,
        ebitdaValuation: sFinalEbitda * valuationMultiple,
        ruleOf40Pct: sCagr * 100 + sMargin,
      };
    }

    const scenarios: { name: string; multiplier: number }[] = [
      { name: 'Low', multiplier: SCENARIO_MULTIPLIER.low },
      { name: 'Base', multiplier: SCENARIO_MULTIPLIER.base },
      { name: 'High', multiplier: SCENARIO_MULTIPLIER.high },
    ];

    return {
      safeProjectionYears,
      cumulativeImpact,
      cumulativeNet,
      paybackYear,
      roiMultiple,
      annualPortfolioImpact,
      portfolioMarginLiftPct,
      npv,
      irr,
      arrByYear,
      saasEbitdaByYear,
      finalYearARR,
      arrCagr,
      arrValuationImpact,
      netRevenueRetentionPct: netRevenueRetention * 100,
      finalYearSaasEbitda,
      saasEbitdaMarginPct,
      ebitdaValuationImpact,
      ruleOf40Pct,
      ltvPerFacility,
      cohortFinalYearContributions,
      scenarios,
      annualNetCashFlows: cashFlows.slice(1),
      scenarioSnapshots: {
        low: buildScenarioSnapshot(SCENARIO_MULTIPLIER.low),
        base: buildScenarioSnapshot(SCENARIO_MULTIPLIER.base),
        high: buildScenarioSnapshot(SCENARIO_MULTIPLIER.high),
      },
      downsideSnapshot: buildScenarioSnapshot(SCENARIO_MULTIPLIER.base, 0.8, 1.25),
    };
  }, [
    annualSubscription,
    arrMultiple,
    captureBand,
    deploymentYears,
    discountRate,
    expansionPct,
    gaPct,
    grossChurnPct,
    grossMarginPct,
    hardwareCost,
    implementationCost,
    perFacilityEbitdaIncrease,
    perFacilityRevenue,
    projectionYears,
    rdPct,
    salesPct,
    scenario,
    totalFacilities,
    valuationMultiple,
  ]);



  async function exportBoardDeck() {
    try {
      const payload = {
        meta: {
          companyName: 'Reality Anchors',
          docTitle: 'Board Brief',
          schemaVersion: '1.0.0',
          confidentialityLine: 'Confidential — Board Use Only',
          baseUrl: typeof window !== 'undefined' ? window.location.origin : '',
          logoPath: '/ra-logo.png',
        },
        customerEconomics: {
          materialSaved: perFacilityEbitdaIncrease * 0.45,
          laborSaved: perFacilityEbitdaIncrease * 0.2,
          throughput: perFacilityEbitdaIncrease * 0.25,
          oversight: perFacilityEbitdaIncrease * 0.1,
          totalEbitda: perFacilityEbitdaIncrease,
          marginDeltaPct: perFacilityRevenue > 0 ? (perFacilityEbitdaIncrease / perFacilityRevenue) * 100 : 0,
          pricingLow: perFacilityEbitdaIncrease * 0.08,
          pricingBase: perFacilityEbitdaIncrease * 0.12,
          pricingHigh: perFacilityEbitdaIncrease * 0.15,
        },
        ramp: {
          totalFacilities,
          deploymentYears,
          projectionYears: model.safeProjectionYears,
          annualNetCashFlows: model.annualNetCashFlows,
          paybackYear: model.paybackYear,
          npv: model.npv,
          irr: model.irr,
        },
        saasEconomics: {
          finalARR: model.finalYearARR,
          arrCAGR: model.arrCagr,
          nrrPct: model.netRevenueRetentionPct,
          grossMarginPct,
          finalEbitda: model.finalYearSaasEbitda,
          ebitdaMarginPct: model.saasEbitdaMarginPct,
          arrValuation: model.arrValuationImpact,
          ebitdaValuation: model.ebitdaValuationImpact,
        },
        scenarios: model.scenarioSnapshots,
        downsideScenario: model.downsideSnapshot,
        evidenceTags: {
          totalEbitda: "Estimated",
          npv: "Modeled",
          irr: "Modeled",
          arrCAGR: "Modeled",
          netRevenueRetention: "Assumed",
          ebitdaMargin: "Modeled",
        },
      };

      const res = await fetch('/api/export-board-deck', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        let msg = 'Unable to export board deck.';
        try {
          const err = await res.json();
          msg = err?.message || msg;
          if (err?.error === 'PDF_ENGINE_UNAVAILABLE' && err?.htmlPreview) {
            const preview = window.open('', '_blank');
            if (preview) {
              preview.document.open();
              preview.document.write(err.htmlPreview);
              preview.document.close();
            }
          }
        } catch {
          msg = await res.text();
        }
        throw new Error(msg || 'Unable to export board deck.');
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'RA-Board-Deck.pdf';
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      window.alert(error instanceof Error ? error.message : 'Unable to export board deck.');
    }
  }


  const InvestorSummaryView = () => (
    <section id="investor-summary-print" className="bg-neutral-900 text-white rounded-xl p-10 space-y-10">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-2xl font-semibold">Investor Summary</h2>
        <button
          onClick={() => window.print()}
          className="bg-white text-black px-5 py-2 rounded-md text-sm font-medium print:hidden"
        >
          Download Investor Summary (PDF)
        </button>
        <button
          onClick={exportBoardDeck}
          className="bg-white text-black px-5 py-2 rounded-md text-sm font-medium print:hidden"
        >
          Export Full Board Deck
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <Metric label={<>Final Year {term.ARR()}</>} value={formatUSD(model.finalYearARR)} />
        <Metric label={<>{term.ARR()} CAGR</>} value={formatPct(model.arrCagr * 100)} />
        <Metric label="Net Revenue Retention" value={formatPct(model.netRevenueRetentionPct)} />

        <Metric label="Gross Margin" value={formatPct(grossMarginPct)} />
        <Metric label={<>Final Year {term.EBITDA()}</>} value={formatUSD(model.finalYearSaasEbitda)} />
        <Metric label={<>{term.EBITDA()} Margin</>} value={formatPct(model.saasEbitdaMarginPct)} />

        <Metric label={term.IRR()} value={model.irr !== null ? formatPct(model.irr * 100) : 'N/A'} />
        <Metric label={<>{model.safeProjectionYears}-Year {term.NPV()}</>} value={formatUSD(model.npv)} />
        <Metric label="Payback Period" value={model.paybackYear ? `${model.paybackYear} yrs` : 'N/A'} />

        <Metric label={<>{term.ARR()} Valuation</>} value={formatUSD(model.arrValuationImpact)} />
        <Metric label={<>{term.EBITDA()} Valuation</>} value={formatUSD(model.ebitdaValuationImpact)} />
        <Metric label="Rule of 40" value={formatPct(model.ruleOf40Pct)} />
      </div>

      <style jsx global>{`
        @media print {
          body * { visibility: hidden; }
          #investor-summary-print, #investor-summary-print * { visibility: visible; }
          #investor-summary-print {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: white !important;
            color: black !important;
            border-radius: 0 !important;
            padding: 24px !important;
          }
        }
      `}</style>
    </section>
  );

  return (
    <section className="bg-white rounded-xl border border-neutral-200 p-8 space-y-8">
      <div className="flex justify-end mb-2">
        <button
          onClick={() => setInvestorMode(!investorMode)}
          className={`px-4 py-2 rounded-md text-sm font-medium border ${
            investorMode ? 'bg-black text-white border-black' : 'bg-white text-neutral-700 border-neutral-300'
          }`}
        >
          {investorMode ? 'Exit Investor Mode' : 'Investor Summary Mode'}
        </button>
      </div>

      {investorMode ? (
        <InvestorSummaryView />
      ) : (
        <>
          <h2 className="text-xl font-semibold">Enterprise Deployment, Sensitivity & Payback Model</h2>

          <div className="space-y-3">
            <div className="text-sm font-semibold text-neutral-700">Sensitivity</div>
            <div className="flex gap-2 flex-wrap">
              {(['low', 'base', 'high'] as Scenario[]).map((s) => (
                <button key={s} type="button" onClick={() => setScenario(s)} className={`px-4 py-2 rounded-md text-sm font-medium border ${scenario === s ? 'bg-black text-white border-black' : 'bg-white text-neutral-700 border-neutral-300'}`}>
                  {s.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3 border-t border-neutral-200 pt-6">
            <div className="text-sm font-semibold text-neutral-700">{term.ARR()} Capture Band</div>
            <div className="flex gap-2 flex-wrap">
              {(['low', 'base', 'high'] as Scenario[]).map((s) => (
                <button key={s} type="button" onClick={() => setCaptureBand(s)} className={`px-4 py-2 rounded-md text-sm font-medium border ${captureBand === s ? 'bg-black text-white border-black' : 'bg-white text-neutral-700 border-neutral-300'}`}>
                  {s.toUpperCase()} Capture
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-neutral-200 pt-6 space-y-6">
            <h3 className="text-sm font-semibold text-neutral-700">Net Revenue Retention Assumptions</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <Input label="Gross Churn (%)" value={grossChurnPct} onChange={setGrossChurnPct} />
              <Input label="Expansion (%)" value={expansionPct} onChange={setExpansionPct} />
              <SummaryCard title="Net Revenue Retention" value={formatPct(model.netRevenueRetentionPct)} />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 border-t border-neutral-200 pt-6">
            <Input label="Total Facilities" value={totalFacilities} onChange={setTotalFacilities} />
            <Input label="Deployment Duration (Years)" value={deploymentYears} onChange={setDeploymentYears} />
            <Input label="Projection Horizon (Years)" value={projectionYears} onChange={setProjectionYears} />
            <Input label="Discount Rate (%)" value={discountRate} onChange={setDiscountRate} />
            <Input label={<>{term.EBITDA()} Valuation Multiple</>} value={valuationMultiple} onChange={setValuationMultiple} />
            <Input label={<>{term.ARR()} Valuation Multiple</>} value={arrMultiple} onChange={setArrMultiple} />
          </div>

          <div className="border-t border-neutral-200 pt-6 space-y-6">
            <h3 className="text-sm font-semibold text-neutral-700">Capital & Operating Assumptions (Per Facility)</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <Input label="Hardware Cost (One-Time)" value={hardwareCost} onChange={setHardwareCost} />
              <Input label="Implementation Cost (One-Time)" value={implementationCost} onChange={setImplementationCost} />
              <Input label="Annual Subscription Cost" value={annualSubscription} onChange={setAnnualSubscription} />
            </div>
          </div>

          <div className="border-t border-neutral-200 pt-6 space-y-6">
            <h3 className="text-sm font-semibold text-neutral-700">{term.SaaS()} Operating Assumptions</h3>
            <div className="grid md:grid-cols-4 gap-6">
              <Input label="Gross Margin (%)" value={grossMarginPct} onChange={setGrossMarginPct} />
              <Input label="Sales & Marketing (%)" value={salesPct} onChange={setSalesPct} />
              <Input label={<>{term.RD()} (%)</>} value={rdPct} onChange={setRdPct} />
              <Input label={<>{term.GA()} (%)</>} value={gaPct} onChange={setGaPct} />
            </div>
          </div>

          <div className="border-t border-neutral-200 pt-6 grid md:grid-cols-3 gap-6">
            <SummaryCard title={<>Annual Portfolio {term.EBITDA()} Lift</>} value={formatUSD(model.annualPortfolioImpact)} />
            <SummaryCard title="Portfolio Margin Improvement" value={formatPct(model.portfolioMarginLiftPct)} />
            <SummaryCard title={<>{model.safeProjectionYears}-Year Gross {term.EBITDA()} Lift</>} value={formatUSD(model.cumulativeImpact)} />
          </div>

          <div className="border-t border-neutral-200 pt-6 grid md:grid-cols-3 gap-6">
            <SummaryCard title="Cumulative Net Benefit" value={formatUSD(model.cumulativeNet)} />
            <SummaryCard title="Payback Period" value={model.paybackYear ? `${model.paybackYear} Year(s)` : 'Beyond Projection'} />
            <SummaryCard title={<>{term.ROI()} Multiple</>} value={`${model.roiMultiple.toFixed(2)}×`} />
          </div>

          <div className="border-t border-neutral-200 pt-6 grid md:grid-cols-3 gap-6">
            <SummaryCard title="Net Present Value" value={formatUSD(model.npv)} />
            <SummaryCard title="Internal Rate of Return" value={model.irr !== null ? formatPct(model.irr * 100) : 'N/A'} />
            <SummaryCard title="Discount Rate" value={formatPct(discountRate)} />
          </div>

          <div className="border-t border-neutral-200 pt-8">
            <h3 className="text-sm font-semibold text-neutral-700 mb-4">{term.ARR()} Ramp ({term.NRR()} + Capture)</h3>
            <div className="space-y-2 text-sm">
              {model.arrByYear.map((value, index) => (
                <div key={index} className="flex justify-between border-b border-neutral-100 pb-2"><span>Year {index + 1}</span><span>{formatUSD(value)}</span></div>
              ))}
            </div>
          </div>

          <div className="border-t border-neutral-200 pt-6 grid md:grid-cols-4 gap-6">
            <SummaryCard title={<>Final Year {term.ARR()}</>} value={formatUSD(model.finalYearARR)} />
            <SummaryCard title={<>{term.ARR()} Multiple</>} value={`${arrMultiple}×`} />
            <SummaryCard title={<>Implied {term.ARR()} Valuation</>} value={formatUSD(model.arrValuationImpact)} />
            <SummaryCard title={<>Per-Facility {term.LTV()} (Approx.)</>} value={model.ltvPerFacility ? formatUSD(model.ltvPerFacility) : 'N/A'} />
          </div>

          <div className="border-t border-neutral-200 pt-8">
            <h3 className="text-sm font-semibold text-neutral-700 mb-4">{term.SaaS()} {term.EBITDA()} Projection</h3>
            <div className="space-y-2 text-sm mb-6">
              {model.saasEbitdaByYear.map((value, index) => (
                <div key={index} className="flex justify-between border-b border-neutral-100 pb-2"><span>Year {index + 1}</span><span>{formatUSD(value)}</span></div>
              ))}
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <SummaryCard title={<>Final Year {term.SaaS()} {term.EBITDA()}</>} value={formatUSD(model.finalYearSaasEbitda)} />
              <SummaryCard title={<>{term.EBITDA()} Margin</>} value={formatPct(model.saasEbitdaMarginPct)} />
              <SummaryCard title={<>{term.EBITDA()} Valuation Impact</>} value={formatUSD(model.ebitdaValuationImpact)} />
            </div>
          </div>

          <div className="border-t border-neutral-200 pt-8">
            <h3 className="text-sm font-semibold text-neutral-700 mb-4">Cohort Expansion View</h3>
            <div className="space-y-2 text-sm">
              {model.cohortFinalYearContributions.map((cohort, idx) => (
                <div key={idx} className="flex justify-between border-b border-neutral-100 pb-2"><span>{cohort.label}</span><span>{formatUSD(cohort.value)}</span></div>
              ))}
            </div>
          </div>

          <div className="border-t border-neutral-200 pt-8">
            <h3 className="text-sm font-semibold text-neutral-700 mb-4">Scenario Comparison</h3>
            <div className="grid md:grid-cols-3 gap-6 text-sm">
              {model.scenarios.map((s) => {
                const scenarioEbitda = perFacilityEbitdaIncrease * s.multiplier;
                const portfolioImpact = scenarioEbitda * totalFacilities;
                return (
                  <div key={s.name} className="border border-neutral-200 rounded-md p-4">
                    <div className="text-neutral-500 mb-2">{s.name} Case</div>
                    <div className="text-lg font-semibold">{formatUSD(portfolioImpact)}</div>
                    <div className="text-neutral-500 mt-1">Annual Portfolio {term.EBITDA()} Lift</div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </section>
  );
}
