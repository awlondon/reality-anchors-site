'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion, useInView } from 'framer-motion';
import { trackEvent } from '@/lib/analytics';
import { fadeUp } from '@/lib/motion';

interface VideoShowcaseProps {
  posterSrc?: string;
  mp4Src?: string;
  webmSrc?: string;
}

function VolumeOffIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
         strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <line x1="23" y1="9" x2="17" y2="15" />
      <line x1="17" y1="9" x2="23" y2="15" />
    </svg>
  );
}

function VolumeOnIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
         strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
    </svg>
  );
}

function PlayIcon({ className = 'w-8 h-8' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

export default function VideoShowcase({
  posterSrc = '/images/cnc-precision.jpg',
  mp4Src = '/videos/showcase-rebar.mp4',
  webmSrc = '/videos/showcase-rebar.webm',
}: VideoShowcaseProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hasFiredView = useRef(false);

  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  const reduceMotion = useReducedMotion();
  const isInView = useInView(containerRef, { amount: 0.5 });

  // Auto-play/pause based on viewport visibility
  useEffect(() => {
    const video = videoRef.current;
    if (!video || reduceMotion) return;

    if (isInView) {
      video.play().catch(() => {});
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  }, [isInView, reduceMotion]);

  // Fire view analytics once
  useEffect(() => {
    if (isInView && !hasFiredView.current) {
      hasFiredView.current = true;
      trackEvent('video_showcase_view');
    }
  }, [isInView]);

  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    const newMuted = !isMuted;
    video.muted = newMuted;
    setIsMuted(newMuted);

    if (!hasInteracted) {
      setHasInteracted(true);
      trackEvent('video_showcase_unmute');
    }

    trackEvent('video_showcase_toggle_mute', { muted: newMuted });
  }, [isMuted, hasInteracted]);

  const handlePlayManual = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      video.play().catch(() => {});
      setIsPlaying(true);
    }
  }, [isPlaying]);

  // Reduced motion: show poster with play button
  if (reduceMotion) {
    return (
      <section className="bg-bg">
        <div className="max-w-7xl mx-auto px-0 sm:px-6 pb-6">
          <p className="text-xs font-bold tracking-[0.18em] uppercase text-accent text-center mb-4 px-6 pt-8">
            See It in Action
          </p>
          <div className="relative w-full aspect-video overflow-hidden sm:rounded-2xl border border-line/50 bg-bg-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={posterSrc}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover opacity-60"
            />
            <button
              onClick={handlePlayManual}
              className="absolute inset-0 z-10 flex items-center justify-center"
              aria-label="Play video"
            >
              <div className="w-16 h-16 rounded-full bg-accent/90 flex items-center justify-center shadow-lg shadow-accent/30">
                <PlayIcon className="w-7 h-7 text-white ml-1" />
              </div>
            </button>
            <video
              ref={videoRef}
              className="absolute inset-0 w-full h-full object-cover"
              muted
              loop
              playsInline
              preload="metadata"
              poster={posterSrc}
              aria-label="AI-guided rebar cutting and bending showcase"
            >
              <source src={webmSrc} type="video/webm" />
              <source src={mp4Src} type="video/mp4" />
            </video>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-bg">
      <div ref={containerRef} className="max-w-7xl mx-auto px-0 sm:px-6 pb-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={fadeUp}
        >
          <p className="text-xs font-bold tracking-[0.18em] uppercase text-accent text-center mb-4 px-6 pt-8">
            See It in Action
          </p>

          {/* Video container — 16:9 cinematic strip */}
          <div className="relative w-full aspect-video overflow-hidden sm:rounded-2xl border border-line/50 bg-bg-2">

            {/* The video element */}
            <video
              ref={videoRef}
              className="absolute inset-0 w-full h-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              poster={posterSrc}
              aria-label="AI-guided rebar cutting and bending showcase"
            >
              <source src={webmSrc} type="video/webm" />
              <source src={mp4Src} type="video/mp4" />
            </video>

            {/* Cinematic vignette overlays */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-bg/60 via-transparent to-bg/40" />
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-bg/20 via-transparent to-bg/20" />

            {/* Mute/unmute button — bottom right */}
            <button
              onClick={toggleMute}
              className="absolute bottom-4 right-4 z-20 flex items-center gap-2 px-3 py-2 rounded-lg bg-bg/80 backdrop-blur-sm border border-line/70 text-txt text-xs font-semibold transition-all hover:bg-bg-2/90 hover:border-accent/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
              aria-label={isMuted ? 'Unmute video' : 'Mute video'}
            >
              {isMuted ? <VolumeOffIcon /> : <VolumeOnIcon />}
              <span className="hidden sm:inline">
                {isMuted ? 'Unmute' : 'Mute'}
              </span>
            </button>

            {/* First-interaction overlay — click to hear voiceover */}
            <AnimatePresence>
              {!hasInteracted && (
                <motion.button
                  onClick={toggleMute}
                  className="absolute inset-0 z-10 flex flex-col items-center justify-center cursor-pointer"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: 1.5, duration: 0.6 }}
                  aria-label="Click to unmute voiceover"
                >
                  <div className="flex items-center gap-3 px-6 py-3 rounded-xl bg-bg/70 backdrop-blur-sm border border-line/50">
                    <VolumeOffIcon className="w-5 h-5 text-accent-2" />
                    <span className="text-sm font-semibold text-txt">
                      Click to hear voiceover
                    </span>
                  </div>
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
