'use client';

import Image from 'next/image';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState } from 'react';

export type ParallaxLayer = {
  src: string;
  alt: string;
  depth: number;
  opacity?: number;
  scale?: number;
  fallbackSrc?: string;
};

type Props = {
  layers: ParallaxLayer[];
};

export default function MultiLayerParallax({ layers }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [failedLayers, setFailedLayers] = useState<Record<number, boolean>>({});
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden [perspective:1000px]">
      {layers.map((layer, index) => {
        const y = reduceMotion ? 0 : useTransform(scrollYProgress, [0, 1], [-layer.depth, layer.depth]);
        const source = failedLayers[index] && layer.fallbackSrc ? layer.fallbackSrc : layer.src;

        return (
          <motion.div key={`${layer.src}-${index}`} style={{ y }} className="absolute inset-0">
            <div
              className="relative h-[130%] w-full"
              style={{
                opacity: layer.opacity ?? 1,
                transform: `scale(${layer.scale ?? 1}) translateZ(0)`,
              }}
            >
              <Image
                src={source}
                alt={layer.alt}
                fill
                priority={false}
                className="object-cover"
                onError={() => {
                  if (layer.fallbackSrc && !failedLayers[index]) {
                    setFailedLayers((prev) => ({ ...prev, [index]: true }));
                  }
                }}
              />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
