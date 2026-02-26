'use client';

import { useMemo } from 'react';

export type TrafficAttribution = {
  trafficSource: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  referrerHost: string;
};

export function getTrafficAttribution(): TrafficAttribution {
  if (typeof window === 'undefined') {
    return {
      trafficSource: 'unknown',
      utmSource: '',
      utmMedium: '',
      utmCampaign: '',
      referrerHost: '',
    };
  }

  const url = new URL(window.location.href);
  const utmSource = url.searchParams.get('utm_source') ?? '';
  const utmMedium = url.searchParams.get('utm_medium') ?? '';
  const utmCampaign = url.searchParams.get('utm_campaign') ?? '';

  let referrerHost = '';
  try {
    referrerHost = document.referrer ? new URL(document.referrer).host : '';
  } catch {
    referrerHost = '';
  }

  let trafficSource = 'direct';
  if (utmSource) {
    trafficSource = utmMedium ? `${utmSource}:${utmMedium}` : utmSource;
  } else if (referrerHost) {
    trafficSource = `referral:${referrerHost}`;
  }

  return { trafficSource, utmSource, utmMedium, utmCampaign, referrerHost };
}

export function useTrafficAttribution() {
  return useMemo(() => getTrafficAttribution(), []);
}
