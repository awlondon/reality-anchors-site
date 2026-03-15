import { httpsCallable } from 'firebase/functions';
import { functions } from '../firebase';
import type { DeviceSelection } from '../types';

/** Typed wrapper around httpsCallable */
function callable<TData, TResult>(name: string) {
  const fn = httpsCallable<TData, TResult>(functions, name);
  return async (data: TData): Promise<TResult> => {
    const result = await fn(data);
    return result.data;
  };
}

// Stripe / billing
export const createCustomerPortalSession = callable<
  Record<string, never>,
  { url: string }
>('createCustomerPortalSession');

export const createStripeCheckoutSession = callable<
  { planId: string; licensedBenches: number; devices?: DeviceSelection[] },
  { url: string }
>('createStripeCheckoutSession');

// Bench management
export const assignBench = callable<
  { benchId: string; email: string },
  { success: boolean }
>('assignBench');

export const releaseBench = callable<
  { benchId: string },
  { success: boolean }
>('releaseBench');

export const updateBenchCount = callable<
  { newCount: number },
  { url?: string; success: boolean }
>('updateBenchCount');

// Onboarding
export const getAvailablePlans = callable<
  Record<string, never>,
  {
    plans: Array<{ id: string; name: string; description: string; pricePerBench: number; interval: string; includedActions: number; overagePerAction: number; features: string[]; recommended?: boolean }>;
    deviceAddOns?: Array<{ deviceId: string; name: string; monthlyUsd: number }>;
  }
>('getAvailablePlans');

// Contracts
export const signContract = callable<
  { contractId: string },
  { success: boolean }
>('signContract');
