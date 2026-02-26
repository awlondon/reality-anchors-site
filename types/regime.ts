export type AnimationPreset = 'fadeUp' | 'slideIn' | 'scaleIn' | 'minimal';

export type RegimeStat = {
  label: string;
  value: string;
};

export type RegimeContent = {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  imageAlt: string;
  visualTier: 'visualCore' | 'visualPro' | 'visualSpecialty';
  align?: 'left' | 'right';
  stats: RegimeStat[];
  ctaHref: string;
  order: number;
  published: boolean;
  animationPreset?: AnimationPreset;
};
