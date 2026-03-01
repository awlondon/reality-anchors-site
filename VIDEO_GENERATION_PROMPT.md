# Video Generation Prompt: Rebar Execution Showcase

**Duration:** 15 seconds (5 scenes x 3 seconds each)
**Aspect Ratio:** 16:9 (1920x1080 minimum)
**Target Platforms:** Sora, Runway Gen-3/Gen-4, Kling, or Pika

---

## Visual Style

Photorealistic cinematic industrial footage. High contrast. Dark environments with blue-tinted LED lighting and orange sparks. Shallow depth of field. Fast cuts every 2-3 seconds. Camera movement: slow dolly, tracking, crane shots. Product sizzle reel aesthetic.

**Color grading:** Cool blue-steel tones with warm orange/amber highlights from sparks and hot metal. Deep blacks. High contrast. Teal-and-orange color grade.

---

## Scene Breakdown

### Scene 1 (0:00 - 0:03): The Raw Material

- **Shot:** Close-up of bundled steel rebar stacked in a fabrication yard at dawn
- **Camera:** Slow dolly past the stack, shallow depth of field
- **Lighting:** Blue-tinted ambient light, slight lens flare from background
- **Overlay:** Faint holographic measurement lines appear along the rebar (AR/HUD style)
- **Voiceover:** "Every bar of steel carries a specification."

### Scene 2 (0:03 - 0:06): The Cut

- **Shot:** Medium shot of a CNC rebar cutting machine in action
- **Camera:** Tracks the cut from left to right
- **FX:** Sparks fly as the blade contacts the bar -- orange sparks against dark blue shop floor
- **Overlay:** Digital readout animates showing cut length "3,250mm" and a green checkmark
- **Voiceover:** "AI vision confirms the cut before the blade moves."

### Scene 3 (0:06 - 0:09): The Bend

- **Shot:** Dramatic low-angle shot of a rebar bending machine forming a 90-degree bend
- **Camera:** Slowly cranes upward
- **FX:** The bar glows faintly at the bend point from friction heat
- **Overlay:** Angular measurement data -- "90.0 degrees -- PASS" with a blue arc graphic
- **Voiceover:** "Computation guides every angle to specification."

### Scene 4 (0:09 - 0:12): The System

- **Shot:** Wide shot of a fabrication workshop with multiple stations active
- **Camera:** Pull focus from a foreground tablet/screen showing a dashboard to the busy shop floor behind
- **Lighting:** Blue LED overhead lighting, organized industrial environment
- **Overlay:** Screen shows a grid of green status indicators and a progress bar
- **Voiceover:** "From single cuts to entire production lines."

### Scene 5 (0:12 - 0:15): The Anchor

- **Shot:** Finished fabricated rebar shapes arrayed neatly on a transport rack
- **Camera:** Slowly pulls back to reveal the full scale of production
- **FX:** Subtle glow/pulse effect on the steel, suggesting precision and quality
- **Transition:** Fade to dark with a subtle blue accent edge glow
- **Voiceover:** "Reality Anchors. Execution, verified."

---

## Visual Overlay Instructions (Post-Production)

Composite on top of generated footage in After Effects or similar:

- **HUD elements:** Thin blue (#2e7deb) measurement lines, data readouts, checkmarks
- **Typography:** IBM Plex Mono for data readouts, Inter for labels
- **Colors:** Accent blue (#2e7deb), light blue (#6fb0ff), white text on dark backgrounds
- **Final frame:** Fade to background (#070b12) with "Reality Anchors" wordmark centered for 0.5 seconds

---

## Voiceover Script

**Voice direction:** Male or female, authoritative, calm, professional. Documentary narrator tone. Measured but not slow. Each line lands with the visual beat. Confident, technical but accessible. Understated authority.

| Time | Line |
|------|------|
| 0:00 | "Every bar of steel carries a specification." |
| 0:03 | "AI vision confirms the cut before the blade moves." |
| 0:06 | "Computation guides every angle to specification." |
| 0:09 | "From single cuts to entire production lines." |
| 0:12 | "Reality Anchors. Execution, verified." |

---

## Export Requirements

| Format | Codec | Quality | Audio | Target Size | Filename |
|--------|-------|---------|-------|-------------|----------|
| MP4 | H.264 | CRF 23 | AAC 128kbps | < 5 MB | `showcase-rebar.mp4` |
| WebM | VP9 | CRF 31 | Opus 96kbps | < 4 MB | `showcase-rebar.webm` |

**Poster frame:** Extract frame at 0:02 as `showcase-poster.jpg` (JPEG quality 80, 1920x1080)

Place final files in:
- `public/videos/showcase-rebar.mp4`
- `public/videos/showcase-rebar.webm`
- `public/images/showcase-poster.jpg` (optional -- `cnc-precision.jpg` is used as fallback)
