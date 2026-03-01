'use client';

/**
 * WebGL animated node-and-link field rendered via Three.js.
 *
 * Three.js adds ~140 KB gzipped to the bundle but is loaded only on the hero
 * via `next/dynamic` with `ssr: false`, so it does not block first paint.
 * The effect is central to the brand identity (data-network motif) and would
 * be difficult to replicate with CSS or Canvas 2D at equivalent quality.
 *
 * If bundle size ever becomes a concern, options include:
 *   1. Tree-shake Three.js via a custom minimal build (drops ~40 KB).
 *   2. Replace with a static SVG pattern + CSS animation (loses parallax/3D).
 *   3. Lazy-load Three.js only after LCP via `requestIdleCallback`.
 */

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface Props {
  className?: string;
  intensity?: number;
  dprCap?: number;
}

export default function StructuredFieldBackground({
  className,
  intensity = 0.65,
  dprCap = 1.75,
}: Props) {
  const hostRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const reduceMotion =
      window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;
    const motion = reduceMotion ? 0.0 : intensity;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, dprCap));
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 200);
    camera.position.set(0, 0, 24);

    const resize = () => {
      const { width, height } = host.getBoundingClientRect();
      renderer.setSize(Math.max(1, Math.floor(width)), Math.max(1, Math.floor(height)), false);
      camera.aspect = width / Math.max(1, height);
      camera.updateProjectionMatrix();
    };
    resize();

    // Grid planes
    const gridGroup = new THREE.Group();
    scene.add(gridGroup);

    const makeGrid = (size: number, divisions: number, z: number, opacity: number) => {
      const grid = new THREE.GridHelper(size, divisions, 0x1e3a5a, 0x0f2236);
      const mats = Array.isArray(grid.material) ? grid.material : [grid.material];
      mats.forEach((m: THREE.Material) => {
        (m as THREE.LineBasicMaterial).transparent = true;
        (m as THREE.LineBasicMaterial).opacity = opacity;
        (m as THREE.LineBasicMaterial).depthWrite = false;
      });
      grid.position.set(0, 0, z);
      grid.rotation.x = Math.PI / 2;
      return grid;
    };

    gridGroup.add(makeGrid(70, 70, -16, 0.18));
    gridGroup.add(makeGrid(55, 55, -9, 0.22));
    gridGroup.add(makeGrid(40, 40, -3, 0.28));

    // Nodes
    const nodeCount = 520;
    const nodePositions = new Float32Array(nodeCount * 3);
    const nodeSeeds = new Float32Array(nodeCount);
    const nodeVel = new Float32Array(nodeCount * 3);
    const bounds = { x: 18, y: 10, z: 10 };
    const rand = (a: number, b: number) => a + Math.random() * (b - a);

    for (let i = 0; i < nodeCount; i++) {
      nodePositions[i * 3 + 0] = rand(-bounds.x, bounds.x);
      nodePositions[i * 3 + 1] = rand(-bounds.y, bounds.y);
      nodePositions[i * 3 + 2] = rand(-bounds.z, bounds.z) - 4;
      nodeVel[i * 3 + 0] = rand(-0.12, 0.12);
      nodeVel[i * 3 + 1] = rand(-0.10, 0.10);
      nodeVel[i * 3 + 2] = rand(-0.08, 0.08);
      nodeSeeds[i] = Math.random() * 1000;
    }

    const nodeGeo = new THREE.BufferGeometry();
    nodeGeo.setAttribute('position', new THREE.BufferAttribute(nodePositions, 3));
    const nodeMat = new THREE.PointsMaterial({
      color: 0x5090d0,
      size: 0.05,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const nodes = new THREE.Points(nodeGeo, nodeMat);
    scene.add(nodes);

    // Links
    const maxLinks = 700;
    const linkPos = new Float32Array(maxLinks * 2 * 3);
    const linkGeo = new THREE.BufferGeometry();
    linkGeo.setAttribute('position', new THREE.BufferAttribute(linkPos, 3));
    const linkMat = new THREE.LineBasicMaterial({
      color: 0x2255a0,
      transparent: true,
      opacity: 0.16,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const links = new THREE.LineSegments(linkGeo, linkMat);
    scene.add(links);

    const updateLinks = () => {
      const stride = 2;
      const threshold = 2.2;
      let seg = 0;
      for (let i = 0; i < nodeCount && seg < maxLinks; i += stride) {
        const ax = nodePositions[i * 3];
        const ay = nodePositions[i * 3 + 1];
        const az = nodePositions[i * 3 + 2];
        for (let j = i + stride; j < nodeCount && seg < maxLinks; j += 8) {
          const bx = nodePositions[j * 3];
          const by = nodePositions[j * 3 + 1];
          const bz = nodePositions[j * 3 + 2];
          const d2 = (ax - bx) ** 2 + (ay - by) ** 2 + (az - bz) ** 2;
          if (d2 < threshold * threshold) {
            const base = seg * 6;
            linkPos[base] = ax; linkPos[base + 1] = ay; linkPos[base + 2] = az;
            linkPos[base + 3] = bx; linkPos[base + 4] = by; linkPos[base + 5] = bz;
            seg++;
          }
        }
      }
      for (let k = seg; k < maxLinks; k++) {
        const base = k * 6;
        linkPos[base] = linkPos[base + 1] = linkPos[base + 2] = 1e9;
        linkPos[base + 3] = linkPos[base + 4] = linkPos[base + 5] = 1e9;
      }
      (linkGeo.attributes.position as THREE.BufferAttribute).needsUpdate = true;
    };

    // Mouse parallax
    let mouseX = 0, mouseY = 0;
    const onMouseMove = (e: MouseEvent) => {
      const rect = host.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / Math.max(1, rect.width) - 0.5) * 2;
      mouseY = ((e.clientY - rect.top) / Math.max(1, rect.height) - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    let running = true;
    const onVis = () => { running = document.visibilityState === 'visible'; };
    document.addEventListener('visibilitychange', onVis);

    const clock = new THREE.Clock();
    let raf = 0;
    let linkAccum = 0;

    const animate = () => {
      raf = requestAnimationFrame(animate);
      if (!running) return;
      const t = clock.getElapsedTime();
      const dt = Math.min(0.033, clock.getDelta());

      camera.position.x = THREE.MathUtils.lerp(camera.position.x, mouseX * 1.0, 0.04);
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, -mouseY * 0.7, 0.04);
      camera.lookAt(0, 0, 0);

      gridGroup.rotation.z = Math.sin(t * 0.05) * 0.05 * motion;
      gridGroup.position.z = Math.sin(t * 0.12) * 0.15 * motion;

      const wobble = 0.08 * motion;
      for (let i = 0; i < nodeCount; i++) {
        const ix = i * 3;
        const seed = nodeSeeds[i];
        nodePositions[ix] += nodeVel[ix] * dt * 2.2 * motion;
        nodePositions[ix + 1] += nodeVel[ix + 1] * dt * 2.0 * motion;
        nodePositions[ix + 2] += nodeVel[ix + 2] * dt * 1.6 * motion;
        nodePositions[ix] += Math.sin(t * 0.35 + seed) * wobble * dt;
        nodePositions[ix + 1] += Math.cos(t * 0.28 + seed) * wobble * dt;
        if (nodePositions[ix] > bounds.x) nodePositions[ix] = -bounds.x;
        if (nodePositions[ix] < -bounds.x) nodePositions[ix] = bounds.x;
        if (nodePositions[ix + 1] > bounds.y) nodePositions[ix + 1] = -bounds.y;
        if (nodePositions[ix + 1] < -bounds.y) nodePositions[ix + 1] = bounds.y;
        if (nodePositions[ix + 2] > bounds.z) nodePositions[ix + 2] = -bounds.z;
        if (nodePositions[ix + 2] < -bounds.z) nodePositions[ix + 2] = bounds.z;
      }
      (nodeGeo.attributes.position as THREE.BufferAttribute).needsUpdate = true;

      linkAccum += dt;
      if (linkAccum > 0.12) { linkAccum = 0; updateLinks(); }

      renderer.render(scene, camera);
    };

    updateLinks();
    animate();

    const ro = new ResizeObserver(resize);
    ro.observe(host);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      window.removeEventListener('mousemove', onMouseMove);
      nodeGeo.dispose(); nodeMat.dispose();
      linkGeo.dispose(); linkMat.dispose();
      renderer.dispose();
      if (renderer.domElement.parentElement === host) host.removeChild(renderer.domElement);
    };
  }, [intensity, dprCap]);

  return <div ref={hostRef} className={className} />;
}
