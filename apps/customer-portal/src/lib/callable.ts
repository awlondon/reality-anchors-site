import { httpsCallable } from 'firebase/functions';
import { functions } from '../firebase';

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
  { planId: string; licensedBenches: number },
  { url: string }
>('createStripeCheckoutSession');

// Seat management
export const assignSeat = callable<
  { seatId: string; email: string },
  { success: boolean }
>('assignSeat');

export const releaseSeat = callable<
  { seatId: string },
  { success: boolean }
>('releaseSeat');

export const updateSeatCount = callable<
  { newCount: number },
  { url?: string; success: boolean }
>('updateSeatCount');

// Onboarding
export const getAvailablePlans = callable<
  Record<string, never>,
  { plans: Array<{ id: string; name: string; description: string; pricePerSeat: number; interval: string; includedActions: number; overagePerAction: number; features: string[]; recommended?: boolean }> }
>('getAvailablePlans');

// Contracts
export const signContract = callable<
  { contractId: string },
  { success: boolean }
>('signContract');
