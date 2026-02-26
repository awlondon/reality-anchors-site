import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const payload = await req.json();
  const html = renderBoardDeckHTML(payload);

  let puppeteer: any;
  try {
    const dynamicImport = new Function('m', 'return import(m)') as (m: string) => Promise<any>;
    puppeteer = (await dynamicImport('puppeteer')).default;
  } catch {
    return Response.json(
      {
        error: 'PDF_ENGINE_UNAVAILABLE',
        message: 'PDF export engine unavailable in this environment (missing puppeteer dependency).',
        htmlPreview: html,
      },
      { status: 503 },
    );
  }

  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720 });
  await page.setContent(html, { waitUntil: 'networkidle0' });

  const pdf = await page.pdf({
    format: 'A4',
    printBackground: true,
    margin: { top: '20px', bottom: '20px', left: '18px', right: '18px' },
  });

  await browser.close();

  return new Response(pdf, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="RA-Board-Deck.pdf"',
    },
  });
}

function renderBoardDeckHTML(p: any) {
  const today = new Date().toLocaleDateString('en-US');
  const meta = p?.meta ?? {};
  const title = meta.docTitle ?? 'Board Brief';
  const companyName = meta.companyName ?? 'Reality Anchors';
  const confidentialityLine = meta.confidentialityLine ?? 'Confidential — Board Use Only';
  const schemaVersion = meta.schemaVersion ?? '1.0.0';
  const baseUrl = meta.baseUrl ?? 'https://ra.primarydesignco.com';
  const logoUrl = meta.logoPath ? `${baseUrl}${meta.logoPath}` : `${baseUrl}/ra-logo.png`;

  const low = p?.scenarios?.low ?? {};
  const base = p?.scenarios?.base ?? {};
  const high = p?.scenarios?.high ?? {};
  const downside = p?.downsideScenario ?? {};
  const tags = p?.evidenceTags ?? {};
  const strategicQa: { q: string; a: string }[] = Array.isArray(p?.strategicQa) && p.strategicQa.length ? p.strategicQa : defaultStrategicQa();
  const boardQa: { q: string; a: string }[] = Array.isArray(p?.boardQa) && p.boardQa.length ? p.boardQa : defaultBoardQa();
  const pilotFramework = p?.pilotFramework ?? defaultPilotFramework();

  return `
  <html><head><meta charset="utf-8"/><style>
    body{margin:0;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif;color:#111}
    .watermark{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%) rotate(-28deg);font-size:64px;color:rgba(0,0,0,.04);z-index:0}
    .page{position:relative;padding:34px 34px 26px;min-height:1122px;page-break-after:always;z-index:1}
    .page:last-child{page-break-after:auto}
    .hdr{display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #e6e6e6;padding-bottom:14px;margin-bottom:18px}
    .hdr h1{margin:0;font-size:18px}.sub{margin-top:4px;font-size:11px;color:#666}.logo{height:26px}
    .ftr{position:absolute;bottom:18px;left:34px;right:34px;display:flex;justify-content:space-between;border-top:1px solid #e6e6e6;padding-top:10px;font-size:10px;color:#777}
    .grid3{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}.card{border:1px solid #e6e6e6;border-radius:10px;padding:12px}
    .metric-label{font-size:9px;text-transform:uppercase;color:#666;letter-spacing:.45px}.metric-value{margin-top:4px;font-size:14px;font-weight:650}
    .lead{font-size:12px;color:#666;line-height:1.45}
    .qa{border:1px solid #e6e6e6;border-radius:10px;padding:10px;margin-bottom:10px}
    .qa-q{font-size:11px;font-weight:650;margin-bottom:6px}
    .qa-a{font-size:11px;color:#444;line-height:1.4}
    .mini{font-size:11px;color:#444;line-height:1.35}
    .pill{display:inline-block;border:1px solid #ddd;border-radius:999px;padding:2px 8px;font-size:10px;color:#666;margin:0 6px 6px 0}
  </style></head><body>
  <div class="watermark">${escapeHtml(confidentialityLine)}</div>
  <div class="page">${header(companyName,title,today,logoUrl)}
    <h2>Executive Summary</h2><div class="lead">Board-level summary of operational, financial, and valuation outcomes.</div>
    <div class="card" style="margin-top:12px"><ul><li>Execution validation translates shop-floor variance into measurable EBITDA lift.</li><li>Model includes NPV/IRR/payback, ARR compounding, and scenario stress testing.</li><li>Decision ask: approve staged deployment plan with quarterly board reporting.</li></ul></div>
    <div class="card" style="margin-top:10px"><div class="lead"><b>Validated vs Modeled status:</b> EBITDA (${escapeHtml(tags.totalEbitda||'Estimated')}), NPV (${escapeHtml(tags.npv||'Modeled')}), IRR (${escapeHtml(tags.irr||'Modeled')}), NRR (${escapeHtml(tags.netRevenueRetention||'Assumed')}).</div></div>
    ${footer(confidentialityLine,1,schemaVersion)}
  </div>
  <div class="page">${header(companyName,'Scenario Comparison',today,logoUrl)}
    <div class="lead" style="margin-bottom:10px">Low/Base/High reflect structured multipliers to operational deltas; not independent probability-weighted forecasts. Data source: modeled inputs.</div>
    <div class="grid3">${scenario('Low',low)}${scenario('Base',base)}${scenario('High',high)}</div>
    ${footer(confidentialityLine,2,schemaVersion)}
  </div>
  <div class="page">${header(companyName,'Investor Signals',today,logoUrl)}
    <div class="grid3">${metric('Base Final ARR',currency(base.finalARR))}${metric('Base IRR',pct(base.irrPct))}${metric('Base NPV',currency(base.npv))}${metric('Base Payback',base.paybackYear?`${Math.round(base.paybackYear)} yrs`:'N/A')}${metric('Base ARR Valuation',currency(base.arrValuationImpact))}${metric('Base EBITDA Valuation',currency(base.ebitdaValuation))}</div>
    <div class="card" style="margin-top:12px">${metricRow('Downside IRR (20% benefit haircut, 25% slower rollout)',pct(downside.irrPct))}${metricRow('Downside NPV',currency(downside.npv))}${metricRow('Downside Payback',downside.paybackYear?`${Math.round(downside.paybackYear)} yrs`:'N/A')}</div>
    <div class="lead" style="margin-top:12px">Model version ${escapeHtml(schemaVersion)} — Assumptions configurable in UI. No proprietary algorithms disclosed. Data source: modeled inputs.</div>
    ${footer(confidentialityLine,3,schemaVersion)}
  </div>
  <div class="page">${header(companyName,'Defensibility, TAM, and Diligence Readiness',today,logoUrl)}
    <div class="grid3">${metric('TAM Segment Focus','Mid-size + multi-site fabricators')}${metric('Primary Moat','Workflow + telemetry + calibration data')}${metric('Diligence Status','Modeled with pilot-validation gating')}</div>
    <div class="card" style="margin-top:12px"><ul><li><b>Defensibility:</b> execution-layer workflow embedding, machine-specific calibration data, audit-grade traceability.</li><li><b>ERP counter-move resilience:</b> office-planning systems are architecturally distinct from bench-level validation loops.</li><li><b>Evidence plan:</b> promote assumptions from Modeled to Validated only after controlled pilot baselines and 60+ day post-deploy measurement.</li></ul></div>
    ${footer(confidentialityLine,4,schemaVersion)}
  </div>
  <div class="page">${header(companyName,'Hostile Strategic Acquirer Q&A',today,logoUrl)}
    ${strategicQa.slice(0,6).map((item) => `<div class="qa"><div class="qa-q">Q: ${escapeHtml(item.q)}</div><div class="qa-a">A: ${escapeHtml(item.a)}</div></div>`).join('')}
    ${footer(confidentialityLine,5,schemaVersion)}
  </div>
  <div class="page">${header(companyName,'Hostile Internal Board Q&A',today,logoUrl)}
    ${boardQa.slice(0,6).map((item) => `<div class="qa"><div class="qa-q">Q: ${escapeHtml(item.q)}</div><div class="qa-a">A: ${escapeHtml(item.a)}</div></div>`).join('')}
    ${footer(confidentialityLine,6,schemaVersion)}
  </div>

  <div class="page">${header(companyName,'6-Month Pilot Validation Framework',today,logoUrl)}
    <div class="lead" style="margin-bottom:10px">Objective: establish statistically defensible, repeatable EBITDA impact with baseline control and transparent confidence reporting.</div>
    <div class="grid3">
      <div class="card"><div class="metric-label">Phase 1</div><div class="metric-value">${escapeHtml(pilotFramework.phase1?.title || 'Baseline (30–45 days)')}</div><div class="mini">${escapeHtml(pilotFramework.phase1?.desc || '')}</div></div>
      <div class="card"><div class="metric-label">Phase 2</div><div class="metric-value">${escapeHtml(pilotFramework.phase2?.title || 'Controlled Deployment (90 days)')}</div><div class="mini">${escapeHtml(pilotFramework.phase2?.desc || '')}</div></div>
      <div class="card"><div class="metric-label">Phase 3</div><div class="metric-value">${escapeHtml(pilotFramework.phase3?.title || 'Stability & Retention (60–90 days)')}</div><div class="mini">${escapeHtml(pilotFramework.phase3?.desc || '')}</div></div>
    </div>
    <div class="card" style="margin-top:10px"><div class="metric-label" style="margin-bottom:8px">Primary Metrics</div>${(pilotFramework.primaryMetrics || []).map((m: string)=>`<span class="pill">${escapeHtml(m)}</span>`).join('')}</div>
    <div class="card" style="margin-top:10px"><div class="metric-label" style="margin-bottom:8px">Statistical Method</div><div class="mini">${escapeHtml(pilotFramework.statMethod || 'Difference-in-differences with p<0.05 and power target ≥0.8')}</div></div>
    <div class="card" style="margin-top:10px"><div class="metric-label" style="margin-bottom:8px">Pre-committed Success Gates</div><ul>${(pilotFramework.successGates || []).map((g: string)=>`<li class="mini">${escapeHtml(g)}</li>`).join('')}</ul></div>
    <div class="card" style="margin-top:10px"><div class="metric-label" style="margin-bottom:8px">Confounder Controls</div><ul>${(pilotFramework.controls || []).map((g: string)=>`<li class="mini">${escapeHtml(g)}</li>`).join('')}</ul></div>
    ${footer(confidentialityLine,7,schemaVersion)}
  </div>
  </body></html>`;
}

function header(company: string, title: string, today: string, logoUrl: string) {
  return `<div class="hdr"><div><h1>${escapeHtml(company)} — ${escapeHtml(title)}</h1><div class="sub">Generated ${escapeHtml(today)}</div></div><img class="logo" src="${escapeAttr(logoUrl)}"/></div>`;
}
function footer(line: string, page: number, schemaVersion: string) { return `<div class="ftr"><div>${escapeHtml(line)} · Model v${escapeHtml(schemaVersion)}</div><div>Page ${page}</div></div>`; }
function metric(label: string, value: string) { return `<div class="card"><div class="metric-label">${escapeHtml(label)}</div><div class="metric-value">${escapeHtml(value)}</div></div>`; }
function scenario(name: string, d: any) {
  return `<div class="card"><div class="metric-label" style="margin-bottom:8px">${escapeHtml(name)} Case</div>${metricRow('Final ARR',currency(d.finalARR))}${metricRow('ARR CAGR',pct(d.arrCAGR))}${metricRow('NRR',pct(d.netRevenueRetentionPct))}${metricRow('EBITDA Margin',pct(d.ebitdaMarginPct))}${metricRow('IRR',pct(d.irrPct))}${metricRow('NPV',currency(d.npv))}${metricRow('Payback',d.paybackYear?`${Math.round(d.paybackYear)} yrs`:'N/A')}${metricRow('ARR Valuation',currency(d.arrValuationImpact))}${metricRow('EBITDA Valuation',currency(d.ebitdaValuation))}${metricRow('Rule of 40',pct(d.ruleOf40Pct))}</div>`;
}
function metricRow(label: string, value: string) { return `<div style="margin-bottom:10px"><div class="metric-label">${escapeHtml(label)}</div><div class="metric-value">${escapeHtml(value)}</div></div>`; }
function currency(v: any) { const n=Number(v); return new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(Number.isFinite(n)?n:0); }
function pct(v: any) { const n=Number(v); const val=Number.isFinite(n)?n:0; const out=Math.abs(val)<=1?val*100:val; return `${out.toFixed(1)}%`; }
function escapeHtml(s: any) { return String(s??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#039;'); }
function escapeAttr(s: any) { return escapeHtml(s).replaceAll('`','&#096;'); }


function defaultStrategicQa() {
  return [
    { q: 'Why should we not just build this in our ERP stack?', a: 'UI replication is easier than bench-level workflow embedding, calibration data accumulation, and operator adoption mechanics.' },
    { q: 'Does this cannibalize ERP value?', a: 'No. ERP governs planning intent; this validates execution and reduces exception load upstream.' },
    { q: 'What if API access is restricted?', a: 'Automation degrades, but validation remains operational via structured/manual inputs.' },
    { q: 'Is this a feature or a category?', a: 'Execution-layer validation infrastructure: distinct architecture and latency profile from office-planning systems.' },
    { q: 'What is switching cost?', a: 'Operator retraining, calibration history, and measured finance-visible deltas increase removal cost over time.' },
    { q: 'What are current weaknesses?', a: 'Empirical breadth and deployment scale are still maturing; pilots are the gating mechanism.' },
  ];
}

function defaultBoardQa() {
  return [
    { q: 'Are we over-engineering before proof?', a: 'Modeling is used as discipline tooling; expansion remains gated by measured pilot deltas.' },
    { q: 'What is the existential risk?', a: 'If measured scrap/rework deltas fail to clear thresholds, value proposition weakens materially.' },
    { q: 'Are we building for investors over customers?', a: 'No. Investor artifacts are secondary; field evidence and operator adoption remain primary.' },
    { q: 'What if benefits are half of base case?', a: 'Pricing and rollout pace are re-based; downside economics are explicitly modeled and monitored.' },
    { q: 'What are stop-scaling triggers?', a: 'Payback >24 months, weak adoption, elevated early churn, or sub-threshold margin deltas.' },
    { q: 'What turns this into infrastructure?', a: 'Measured margin improvement + embedded workflow + telemetry defensibility at multi-site scale.' },
  ];
}


function defaultPilotFramework() {
  return {
    phase1: { title: 'Baseline (30–45 days)', desc: 'No intervention; establish variance by operator/machine/shift and capture baseline distributions.' },
    phase2: { title: 'Controlled Deployment (90 days)', desc: 'Deploy to treated cohort while preserving control cohort (workstation/shift/project split).' },
    phase3: { title: 'Stability & Retention (60–90 days)', desc: 'Measure durability, novelty fade, adoption stability, and calibration drift.' },
    primaryMetrics: [
      'Scrap reduction %',
      'Rework labor reduction %',
      'Throughput change %',
      'Error event frequency',
      'Operator step compliance %',
    ],
    statMethod: 'Difference-in-differences with p<0.05, power target ≥0.8, and confidence interval reporting.',
    successGates: [
      'Scrap reduction ≥ 1.0% absolute',
      'Rework labor reduction ≥ 10%',
      'No throughput degradation',
      'Operator step compliance ≥ 85%',
      'Payback remains ≤ 24 months',
    ],
    controls: [
      'Log and isolate equipment upgrades, staffing shifts, and ERP process changes during pilot.',
      'Keep baseline/control instrumentation identical to treated group.',
      'Report validated vs modeled metrics separately in monthly board brief.',
    ],
  };
}
