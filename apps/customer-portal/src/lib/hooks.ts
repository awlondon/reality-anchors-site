import { useEffect, useState } from 'react';
import {
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  onSnapshot,
  doc,
  getDoc,
  addDoc,
  serverTimestamp,
  where,
  type DocumentData,
  type QueryConstraint,
} from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from './auth';
import type {
  UsageDaily,
  Subscription,
  Bench,
  Contract,
  KpiSnapshot,
  OrgHealth,
  Note,
} from '../types';

/* ─── Generic Firestore hooks ─── */

function useCollection<T>(
  path: string | null,
  constraints: QueryConstraint[] = [],
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!path) {
      setData([]);
      setLoading(false);
      return;
    }
    const q = query(collection(db, path), ...constraints);
    const unsub = onSnapshot(
      q,
      (snap) => {
        setData(
          snap.docs.map((d) => ({ id: d.id, ...d.data() } as T)),
        );
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      },
    );
    return unsub;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path]);

  return { data, loading, error };
}

function useDoc<T>(path: string | null) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!path) {
      setData(null);
      setLoading(false);
      return;
    }
    const unsub = onSnapshot(doc(db, path), (snap) => {
      setData(snap.exists() ? ({ id: snap.id, ...snap.data() } as T) : null);
      setLoading(false);
    });
    return unsub;
  }, [path]);

  return { data, loading };
}

/* ─── Domain hooks ─── */

/** Fetch recent daily usage (last N days) */
export function useUsageDaily(days = 30) {
  const { orgId } = useAuth();
  const path = orgId ? `orgs/${orgId}/usage_daily` : null;
  return useCollection<UsageDaily>(path, [
    orderBy('date', 'desc'),
    limit(days),
  ]);
}

/** Compute KPIs from usage data (mirrors KpiSnapshot.fromSummaries) */
export function useKpis(): { kpis: KpiSnapshot | null; loading: boolean } {
  const { data: usage, loading } = useUsageDaily(30);

  if (loading || usage.length === 0) return { kpis: null, loading };

  const totalBends = usage.reduce((sum, d) => sum + (d.totalBends ?? 0), 0);
  const accurateBends = usage.reduce((sum, d) => sum + (d.accurateBends ?? 0), 0);
  const totalPieces = usage.reduce((sum, d) => sum + (d.totalPieces ?? 0), 0);
  const scrapPieces = usage.reduce((sum, d) => sum + (d.scrapPieces ?? 0), 0);
  const totalMinutes = usage.reduce((sum, d) => sum + (d.operatorHoursMinutes ?? 0), 0);
  const operatorHours = totalMinutes / 60;
  const activeBenches = Math.max(...usage.map((d) => d.activeBenches ?? 0));

  return {
    kpis: {
      totalBends,
      bendAccuracy: totalBends > 0 ? (accurateBends / totalBends) * 100 : 0,
      piecesPerHour: operatorHours > 0 ? totalPieces / operatorHours : 0,
      scrapRate: totalPieces > 0 ? (scrapPieces / totalPieces) * 100 : 0,
      activeBenches,
      operatorHours: Math.round(operatorHours * 10) / 10,
    },
    loading,
  };
}

/** Active subscriptions */
export function useSubscriptions() {
  const { orgId } = useAuth();
  const path = orgId ? `orgs/${orgId}/subscriptions` : null;
  return useCollection<Subscription>(path);
}

/** Benches */
export function useBenches() {
  const { orgId } = useAuth();
  const path = orgId ? `orgs/${orgId}/benches` : null;
  return useCollection<Bench>(path);
}

/** Contracts */
export function useContracts() {
  const { orgId } = useAuth();
  const path = orgId ? `orgs/${orgId}/contracts` : null;
  return useCollection<Contract>(path, [orderBy('createdAt', 'desc')]);
}

/** Single contract */
export function useContract(contractId: string | undefined) {
  const { orgId } = useAuth();
  const path = orgId && contractId ? `orgs/${orgId}/contracts/${contractId}` : null;
  return useDoc<Contract>(path);
}

/** Admin: org health docs */
export function useOrgHealthList() {
  const [data, setData] = useState<OrgHealth[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      try {
        const snap = await getDocs(
          query(collection(db, 'admin_analytics'), where('__name__', '>=', 'org_health_'), where('__name__', '<=', 'org_health_\uf8ff')),
        );
        setData(snap.docs.map((d) => ({ ...d.data() } as OrgHealth)));
      } catch {
        // Collection may not exist yet
        setData([]);
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, []);

  return { data, loading };
}

/** Admin: single org details */
export function useOrgDetails(orgId: string | undefined) {
  const [org, setOrg] = useState<DocumentData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orgId) { setLoading(false); return; }
    getDoc(doc(db, 'orgs', orgId)).then((snap) => {
      setOrg(snap.exists() ? snap.data() : null);
      setLoading(false);
    });
  }, [orgId]);

  return { org, loading };
}

/** Admin: usage for a specific org */
export function useOrgUsageDaily(orgId: string | undefined, days = 30) {
  const path = orgId ? `orgs/${orgId}/usage_daily` : null;
  return useCollection<UsageDaily>(path, [
    orderBy('date', 'desc'),
    limit(days),
  ]);
}

/** Admin: benches for a specific org */
export function useOrgBenches(orgId: string | undefined) {
  const path = orgId ? `orgs/${orgId}/benches` : null;
  return useCollection<Bench>(path);
}

/** Admin: subscriptions for a specific org */
export function useOrgSubscriptions(orgId: string | undefined) {
  const path = orgId ? `orgs/${orgId}/subscriptions` : null;
  return useCollection<Subscription>(path);
}

/** Admin: contracts for a specific org */
export function useOrgContracts(orgId: string | undefined) {
  const path = orgId ? `orgs/${orgId}/contracts` : null;
  return useCollection<Contract>(path, [orderBy('createdAt', 'desc')]);
}

/* ─── Notes ─── */

/** Notes for current org, optionally filtered by context (page) */
export function useNotes(context?: string) {
  const { orgId } = useAuth();
  const path = orgId ? `orgs/${orgId}/notes` : null;
  const constraints: QueryConstraint[] = [orderBy('createdAt', 'desc'), limit(50)];
  if (context) {
    constraints.unshift(where('context', '==', context));
  }
  return useCollection<Note>(path, constraints);
}

/** Add a note to the current org */
export function useAddNote() {
  const { user, orgId } = useAuth();

  return async (text: string, context: string) => {
    if (!orgId || !user) throw new Error('Not authenticated');
    await addDoc(collection(db, `orgs/${orgId}/notes`), {
      text,
      authorUid: user.uid,
      authorEmail: user.email ?? '',
      authorName: user.displayName ?? user.email ?? '',
      context,
      createdAt: serverTimestamp(),
      pinned: false,
    });
  };
}

/** Notes for a specific org (admin view) */
export function useOrgNotes(orgId: string | undefined) {
  const path = orgId ? `orgs/${orgId}/notes` : null;
  return useCollection<Note>(path, [orderBy('createdAt', 'desc'), limit(50)]);
}
