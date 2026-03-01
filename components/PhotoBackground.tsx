/**
 * Decorative background photograph with dark gradient overlay.
 * Used across sections to add visual depth while maintaining readability.
 *
 * The photo is purely decorative (aria-hidden, empty alt) and blended
 * with mix-blend-luminosity to match the site's dark navy palette.
 *
 * Supports optional WebP source for bandwidth savings (~25-35% smaller).
 * Generate WebP variants with: `npx @aspect-build/rules_js sharp -i public/images/*.jpg -o public/images/ -f webp`
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
  const webpSrc = src.replace(/\.jpe?g$/i, '.webp');
  const hasWebp = webpSrc !== src;

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <picture>
        {hasWebp && <source srcSet={webpSrc} type="image/webp" />}
        <img
          src={src}
          alt=""
          aria-hidden="true"
          loading="lazy"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover mix-blend-luminosity pointer-events-none"
          style={{ opacity, objectPosition: position }}
        />
      </picture>
      <div
        className={`absolute inset-0 bg-gradient-to-b ${gradient} pointer-events-none`}
      />
    </>
  );
}
