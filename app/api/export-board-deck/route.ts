import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const payload = await req.json();
  const html = renderBoardDeckHTML(payload);

  let puppeteer: any;
  try {
    const dynamicImport = new Function('m', 'return import(m)') as (m: string) => Promise<any>;
    puppeteer = (await dynamicImport('puppeteer')).default;
  } catch {
    return new Response('PDF export engine unavailable in this environment (missing puppeteer dependency).', {
      status: 503,
      headers: { 'Content-Type': 'text/plain' },
    });
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
  const baseUrl = meta.baseUrl ?? 'https://ra.primarydesignco.com';
  const logoUrl = meta.logoPath ? `${baseUrl}${meta.logoPath}` : `${baseUrl}/ra-logo.png`;

  const low = p?.scenarios?.low ?? {};
  const base = p?.scenarios?.base ?? {};
  const high = p?.scenarios?.high ?? {};

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
  </style></head><body>
  <div class="watermark">${escapeHtml(confidentialityLine)}</div>
  <div class="page">${header(companyName,title,today,logoUrl)}
    <h2>Executive Summary</h2><div class="lead">Board-level summary of operational, financial, and valuation outcomes.</div>
    <div class="card" style="margin-top:12px"><ul><li>Execution validation translates shop-floor variance into measurable EBITDA lift.</li><li>Model includes NPV/IRR/payback, ARR compounding, and scenario stress testing.</li><li>Decision ask: approve staged deployment plan with quarterly board reporting.</li></ul></div>
    ${footer(confidentialityLine,1)}
  </div>
  <div class="page">${header(companyName,'Scenario Comparison',today,logoUrl)}
    <div class="grid3">${scenario('Low',low)}${scenario('Base',base)}${scenario('High',high)}</div>
    ${footer(confidentialityLine,2)}
  </div>
  <div class="page">${header(companyName,'Investor Signals',today,logoUrl)}
    <div class="grid3">${metric('Base Final ARR',currency(base.finalARR))}${metric('Base IRR',pct(base.irrPct))}${metric('Base NPV',currency(base.npv))}${metric('Base Payback',base.paybackYear?`${Math.round(base.paybackYear)} yrs`:'N/A')}${metric('Base ARR Valuation',currency(base.arrValuationImpact))}${metric('Base EBITDA Valuation',currency(base.ebitdaValuation))}</div>
    ${footer(confidentialityLine,3)}
  </div>
  </body></html>`;
}

function header(company: string, title: string, today: string, logoUrl: string) {
  return `<div class="hdr"><div><h1>${escapeHtml(company)} — ${escapeHtml(title)}</h1><div class="sub">Generated ${escapeHtml(today)}</div></div><img class="logo" src="${escapeAttr(logoUrl)}"/></div>`;
}
function footer(line: string, page: number) { return `<div class="ftr"><div>${escapeHtml(line)}</div><div>Page ${page}</div></div>`; }
function metric(label: string, value: string) { return `<div class="card"><div class="metric-label">${escapeHtml(label)}</div><div class="metric-value">${escapeHtml(value)}</div></div>`; }
function scenario(name: string, d: any) {
  return `<div class="card"><div class="metric-label" style="margin-bottom:8px">${escapeHtml(name)} Case</div>${metricRow('Final ARR',currency(d.finalARR))}${metricRow('ARR CAGR',pct(d.arrCAGR))}${metricRow('NRR',pct(d.netRevenueRetentionPct))}${metricRow('EBITDA Margin',pct(d.ebitdaMarginPct))}${metricRow('IRR',pct(d.irrPct))}${metricRow('NPV',currency(d.npv))}${metricRow('Payback',d.paybackYear?`${Math.round(d.paybackYear)} yrs`:'N/A')}${metricRow('ARR Valuation',currency(d.arrValuationImpact))}${metricRow('EBITDA Valuation',currency(d.ebitdaValuation))}${metricRow('Rule of 40',pct(d.ruleOf40Pct))}</div>`;
}
function metricRow(label: string, value: string) { return `<div style="margin-bottom:10px"><div class="metric-label">${escapeHtml(label)}</div><div class="metric-value">${escapeHtml(value)}</div></div>`; }
function currency(v: any) { const n=Number(v); return new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(Number.isFinite(n)?n:0); }
function pct(v: any) { const n=Number(v); const val=Number.isFinite(n)?n:0; const out=Math.abs(val)<=1?val*100:val; return `${out.toFixed(1)}%`; }
function escapeHtml(s: any) { return String(s??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#039;'); }
function escapeAttr(s: any) { return escapeHtml(s).replaceAll('`','&#096;'); }
