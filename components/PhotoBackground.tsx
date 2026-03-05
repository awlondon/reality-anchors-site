/**
 * Decorative background photograph with dark gradient overlay.
 * Used across sections to add visual depth while maintaining readability.
 *
 * The photo is purely decorative (aria-hidden, empty alt) and blended
 * with mix-blend-luminosity to match the site's dark navy palette.
 */
export default function PhotoBackground({
  src,
  opacity = 0.15,
  gradient = 'from-bg/80 via-bg/60 to-bg/90',
  position = 'center',
}: {
  src: string;
  /** 0–1 opacity for the photo layer (default 0.15) */
  opacity?: number;
  /** Tailwind gradient classes applied over the photo (default darkens edges) */
  gradient?: string;
  /** CSS object-position value (default "center") */
  position?: string;
}) {
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        aria-hidden="true"
        loading="lazy"
        decoding="async"
        className="absolute inset-0 w-full h-full object-cover mix-blend-luminosity pointer-events-none"
        style={{ opacity, objectPosition: position }}
      />
      <div
        className={`absolute inset-0 bg-gradient-to-b ${gradient} pointer-events-none`}
      />
    </>
  );
}
