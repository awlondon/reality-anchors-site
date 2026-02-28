import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// NOTE: This middleware only runs in `next dev` and `next start`.
// With `output: 'export'` (static hosting), middleware is NOT executed.
// The A/B experiment cookie is set client-side by ExperimentProvider as a fallback.

const EXP_COOKIE = 'exp_home_narrative_v1';

export function middleware(req: NextRequest) {
  if (req.nextUrl.pathname !== '/') return NextResponse.next();

  const res = NextResponse.next();
  const existing = req.cookies.get(EXP_COOKIE)?.value;
  if (!existing) {
    res.cookies.set(EXP_COOKIE, 'A', { path: '/', sameSite: 'lax' });
  }
  return res;
}

export const config = {
  matcher: ['/'],
};
