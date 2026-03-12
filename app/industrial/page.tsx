'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RedirectPage() {
  const router = useRouter();
  useEffect(() => { router.replace('/enterprise/'); }, [router]);
  return (
    <main className="min-h-screen flex items-center justify-center">
      <p className="text-muted text-sm">Redirecting…</p>
    </main>
  );
}
