'use client';

import Image from 'next/image';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export type ParallaxLayer = {
  src: string;
  alt: string;
  depth: number;
  opacity?: number;
  scale?: number;
};

type Props = {
  layers: ParallaxLayer[];
};

export default function MultiLayerParallax({ layers }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden [perspective:1000px]">
      {layers.map((layer, index) => {
        const y = reduceMotion ? 0 : useTransform(scrollYProgress, [0, 1], [-layer.depth, layer.depth]);

        return (
          <motion.div key={`${layer.src}-${index}`} style={{ y }} className="absolute inset-0">
            <div
              className="relative h-[130%] w-full"
              style={{
                opacity: layer.opacity ?? 1,
                transform: `scale(${layer.scale ?? 1}) translateZ(0)`,
              }}
            >
              <Image src={layer.src} alt={layer.alt} fill priority={false} className="object-cover" />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
