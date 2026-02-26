# AI Prompt + Hero Background Implementation

## 10-Second Looping Video Prompt

Use this prompt in your video model (Runway/Pika/Sora-class):

```text
Create a seamless 10-second looping cinematic background video for a typography-first enterprise software website hero section.

Scene: abstract, minimal, slow-moving geometric field suggesting precision engineering and structured intelligence.

Visual style:
- Dark graphite and deep steel-blue palette
- Subtle volumetric light beams
- Fine-line floating grids and parametric wireframe structures
- Gentle parallax depth
- Faint node-intersection glow pulses
- Clean and modern, never flashy
- No text, no logos, no UI elements
- No fast camera movement, no jitter

Mood: intelligent, controlled, trustworthy, premium enterprise software.

Motion: very slow drift with slight depth changes for soft parallax.

Texture: sparse atmospheric particles with low contrast.

Looping requirement: first and last frames must align for a perfect seamless loop (no visible jump cut).

Output specs:
- 1920x1080
- 16:9
- 10 seconds
- 24fps
- High bitrate
- Web background optimized
- Deliver both MP4 (H.264) and WebM (VP9)
```

## HTML

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Hero Video Background</title>
  <link rel="stylesheet" href="styles.css" />
</head>
<body>
  <section class="hero" aria-label="Intro section">
    <video
      class="hero-video"
      autoplay
      muted
      loop
      playsinline
      preload="metadata"
      poster="hero-fallback.jpg"
    >
      <source src="hero-loop.webm" type="video/webm" />
      <source src="hero-loop.mp4" type="video/mp4" />
    </video>

    <div class="hero-overlay" aria-hidden="true"></div>

    <div class="hero-content">
      <p class="eyebrow">REALITY ANCHORS LIMITED</p>
      <h1>Precision Intelligence for Structural Systems</h1>
      <p class="subhead">
        Real-time validation, deterministic optimization, and field-ready AI workflows.
      </p>
      <div class="cta-group">
        <button class="cta-primary" type="button">Request Demo</button>
        <button class="cta-secondary" type="button">View Case Study</button>
      </div>
    </div>
  </section>

  <script src="app.js"></script>
</body>
</html>
```

## CSS

```css
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

:root {
  --bg: #0b0f17;
  --text: #ffffff;
  --overlay-top: rgba(5, 8, 15, 0.85);
  --overlay-bottom: rgba(5, 8, 15, 0.7);
  --primary: #4c8eff;
  --primary-hover: #3a6fd6;
}

body {
  font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  background: var(--bg);
  color: var(--text);
}

.hero {
  position: relative;
  min-height: 100vh;
  width: 100%;
  overflow: hidden;
}

.hero-video {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scale(1.05);
  will-change: transform;
  z-index: 1;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(var(--overlay-top), var(--overlay-bottom));
  z-index: 2;
}

.hero-content {
  position: relative;
  z-index: 3;
  max-width: 900px;
  padding: clamp(24px, 4vw, 48px);
  padding-top: 16vh;
}

.eyebrow {
  letter-spacing: 0.08em;
  font-size: 0.8rem;
  opacity: 0.8;
  margin-bottom: 1rem;
}

h1 {
  font-size: clamp(2.25rem, 5vw, 4rem);
  line-height: 1.08;
  letter-spacing: -0.02em;
  margin-bottom: 1rem;
  max-width: 14ch;
}

.subhead {
  font-size: clamp(1rem, 1.8vw, 1.25rem);
  line-height: 1.5;
  opacity: 0.9;
  max-width: 52ch;
  margin-bottom: 2rem;
}

.cta-group {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

button {
  border-radius: 8px;
  padding: 0.8rem 1.1rem;
  font-size: 0.98rem;
  cursor: pointer;
  transition: transform 0.2s ease, background-color 0.2s ease;
}

.cta-primary {
  background: var(--primary);
  color: #fff;
  border: 0;
}

.cta-primary:hover {
  background: var(--primary-hover);
  transform: translateY(-1px);
}

.cta-secondary {
  background: transparent;
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.45);
}

.cta-secondary:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-1px);
}

@media (prefers-reduced-motion: reduce) {
  .hero-video {
    transform: none;
  }
}
```

## JS

```js
const hero = document.querySelector('.hero');
const video = document.querySelector('.hero-video');

if (hero && video && window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
  hero.addEventListener('pointermove', (event) => {
    const x = (event.clientX / window.innerWidth - 0.5) * 8;
    const y = (event.clientY / window.innerHeight - 0.5) * 8;
    video.style.transform = `scale(1.05) translate(${x}px, ${y}px)`;
  });
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  });
}, { threshold: 0.15 });

if (video) {
  observer.observe(video);
}
```
