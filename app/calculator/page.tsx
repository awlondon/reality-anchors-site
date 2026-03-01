'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CalculatorPage() {
  const router = useRouter();
  useEffect(() => { router.replace('/margin-impact/'); }, [router]);
  return null;
}
