"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

type StructuredFieldBackgroundProps = {
  className?: string;
  intensity?: number;
  dprCap?: number;
};

export default function StructuredFieldBackground({
  className,
  intensity = 0.65,
  dprCap = 1.75,
}: StructuredFieldBackgroundProps) {
  const hostRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const reduceMotion =
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
    const motion = reduceMotion ? 0 : intensity;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
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

    const gridGroup = new THREE.Group();
    scene.add(gridGroup);

    const makeGrid = (size: number, divisions: number, z: number, opacity: number) => {
      const grid = new THREE.GridHelper(size, divisions, 0x31507a, 0x1a2a44);
      const materials = Array.isArray(grid.material) ? grid.material : [grid.material];
      materials.forEach((material) => {
        const mat = material as THREE.Material & { opacity?: number; transparent?: boolean; depthWrite?: boolean };
        mat.transparent = true;
        mat.opacity = opacity;
        mat.depthWrite = false;
      });

      grid.position.set(0, 0, z);
      grid.rotation.x = Math.PI / 2;
      return grid;
    };

    gridGroup.add(makeGrid(70, 70, -16, 0.18));
    gridGroup.add(makeGrid(55, 55, -9, 0.22));
    gridGroup.add(makeGrid(40, 40, -3, 0.28));

    const nodeCount = 520;
    const nodePositions = new Float32Array(nodeCount * 3);
    const nodeSeeds = new Float32Array(nodeCount);
    const nodeVelocity = new Float32Array(nodeCount * 3);

    const bounds = { x: 18, y: 10, z: 10 };
    const rand = (a: number, b: number) => a + Math.random() * (b - a);

    for (let index = 0; index < nodeCount; index += 1) {
      const offset = index * 3;
      nodePositions[offset] = rand(-bounds.x, bounds.x);
      nodePositions[offset + 1] = rand(-bounds.y, bounds.y);
      nodePositions[offset + 2] = rand(-bounds.z, bounds.z) - 4;

      nodeVelocity[offset] = rand(-0.12, 0.12);
      nodeVelocity[offset + 1] = rand(-0.1, 0.1);
      nodeVelocity[offset + 2] = rand(-0.08, 0.08);

      nodeSeeds[index] = Math.random() * 1000;
    }

    const nodeGeometry = new THREE.BufferGeometry();
    nodeGeometry.setAttribute("position", new THREE.BufferAttribute(nodePositions, 3));

    const nodeMaterial = new THREE.PointsMaterial({
      color: 0x86b7ff,
      size: 0.05,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const nodes = new THREE.Points(nodeGeometry, nodeMaterial);
    scene.add(nodes);

    const maxLinks = 700;
    const linkPositions = new Float32Array(maxLinks * 2 * 3);
    const linkGeometry = new THREE.BufferGeometry();
    linkGeometry.setAttribute("position", new THREE.BufferAttribute(linkPositions, 3));

    const linkMaterial = new THREE.LineBasicMaterial({
      color: 0x2e75ff,
      transparent: true,
      opacity: 0.18,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const links = new THREE.LineSegments(linkGeometry, linkMaterial);
    scene.add(links);

    const updateLinks = () => {
      const stride = 2;
      const threshold = 2.2;
      let segment = 0;

      for (let i = 0; i < nodeCount && segment < maxLinks; i += stride) {
        const aOffset = i * 3;
        const ax = nodePositions[aOffset];
        const ay = nodePositions[aOffset + 1];
        const az = nodePositions[aOffset + 2];

        for (let j = i + stride; j < nodeCount && segment < maxLinks; j += 8) {
          const bOffset = j * 3;
          const bx = nodePositions[bOffset];
          const by = nodePositions[bOffset + 1];
          const bz = nodePositions[bOffset + 2];

          const dx = ax - bx;
          const dy = ay - by;
          const dz = az - bz;
          const distSq = dx * dx + dy * dy + dz * dz;

          if (distSq < threshold * threshold) {
            const base = segment * 2 * 3;
            linkPositions[base] = ax;
            linkPositions[base + 1] = ay;
            linkPositions[base + 2] = az;
            linkPositions[base + 3] = bx;
            linkPositions[base + 4] = by;
            linkPositions[base + 5] = bz;
            segment += 1;
          }
        }
      }

      for (let i = segment; i < maxLinks; i += 1) {
        const base = i * 2 * 3;
        linkPositions[base] = 1e9;
        linkPositions[base + 1] = 1e9;
        linkPositions[base + 2] = 1e9;
        linkPositions[base + 3] = 1e9;
        linkPositions[base + 4] = 1e9;
        linkPositions[base + 5] = 1e9;
      }

      (linkGeometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
    };

    let mouseX = 0;
    let mouseY = 0;
    const onMouseMove = (event: MouseEvent) => {
      const rect = host.getBoundingClientRect();
      const nx = (event.clientX - rect.left) / Math.max(1, rect.width);
      const ny = (event.clientY - rect.top) / Math.max(1, rect.height);
      mouseX = (nx - 0.5) * 2;
      mouseY = (ny - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMouseMove, { passive: true });

    let running = true;
    const onVisibilityChange = () => {
      running = document.visibilityState === "visible";
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    const clock = new THREE.Clock();
    let frame = 0;
    let linkAccumulator = 0;

    const animate = () => {
      frame = requestAnimationFrame(animate);
      if (!running) return;

      const elapsed = clock.getElapsedTime();
      const delta = Math.min(0.033, clock.getDelta());

      camera.position.x = THREE.MathUtils.lerp(camera.position.x, mouseX * 1.0, 0.04);
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, -mouseY * 0.7, 0.04);
      camera.lookAt(0, 0, 0);

      gridGroup.rotation.z = Math.sin(elapsed * 0.05) * 0.05 * motion;
      gridGroup.position.z = Math.sin(elapsed * 0.12) * 0.15 * motion;

      const wobble = 0.08 * motion;
      for (let i = 0; i < nodeCount; i += 1) {
        const offset = i * 3;
        const seed = nodeSeeds[i];

        nodePositions[offset] += nodeVelocity[offset] * delta * 2.2 * motion;
        nodePositions[offset + 1] += nodeVelocity[offset + 1] * delta * 2.0 * motion;
        nodePositions[offset + 2] += nodeVelocity[offset + 2] * delta * 1.6 * motion;

        nodePositions[offset] += Math.sin(elapsed * 0.35 + seed) * wobble * delta;
        nodePositions[offset + 1] += Math.cos(elapsed * 0.28 + seed) * wobble * delta;

        if (nodePositions[offset] > bounds.x) nodePositions[offset] = -bounds.x;
        if (nodePositions[offset] < -bounds.x) nodePositions[offset] = bounds.x;
        if (nodePositions[offset + 1] > bounds.y) nodePositions[offset + 1] = -bounds.y;
        if (nodePositions[offset + 1] < -bounds.y) nodePositions[offset + 1] = bounds.y;
        if (nodePositions[offset + 2] > bounds.z) nodePositions[offset + 2] = -bounds.z;
        if (nodePositions[offset + 2] < -bounds.z) nodePositions[offset + 2] = bounds.z;
      }

      (nodeGeometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;

      linkAccumulator += delta;
      if (linkAccumulator > 0.12) {
        linkAccumulator = 0;
        updateLinks();
      }

      renderer.render(scene, camera);
    };

    updateLinks();
    animate();

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("mousemove", onMouseMove);

      nodeGeometry.dispose();
      nodeMaterial.dispose();
      linkGeometry.dispose();
      linkMaterial.dispose();
      renderer.dispose();

      if (renderer.domElement.parentElement === host) {
        host.removeChild(renderer.domElement);
      }
    };
  }, [dprCap, intensity]);

  return <div ref={hostRef} className={className} />;
}
