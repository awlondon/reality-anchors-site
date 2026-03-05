#!/usr/bin/env node
/**
 * Image optimization build script.
 *
 * Converts images in public/images/ to WebP format with responsive sizes.
 * Run manually or as part of the build pipeline:
 *   node scripts/optimize-images.mjs
 *
 * Requires: npm install --save-dev sharp
 */

import { readdir, mkdir } from 'fs/promises';
import { join, parse } from 'path';
import { existsSync } from 'fs';

const INPUT_DIR = 'public/images';
const OUTPUT_DIR = 'public/images/optimized';
const WIDTHS = [640, 1024, 1600];
const QUALITY = 80;

async function optimize() {
  let sharp;
  try {
    sharp = (await import('sharp')).default;
  } catch {
    console.error('sharp not installed. Run: npm install --save-dev sharp');
    process.exit(1);
  }

  if (!existsSync(INPUT_DIR)) {
    console.log(`No ${INPUT_DIR} directory found — skipping optimization.`);
    return;
  }

  await mkdir(OUTPUT_DIR, { recursive: true });

  const files = await readdir(INPUT_DIR);
  const images = files.filter((f) => /\.(jpe?g|png)$/i.test(f));

  console.log(`Optimizing ${images.length} images...`);

  for (const file of images) {
    const { name } = parse(file);
    const inputPath = join(INPUT_DIR, file);

    for (const width of WIDTHS) {
      const outputPath = join(OUTPUT_DIR, `${name}-${width}w.webp`);
      await sharp(inputPath)
        .resize(width, undefined, { withoutEnlargement: true })
        .webp({ quality: QUALITY })
        .toFile(outputPath);
      console.log(`  ✓ ${outputPath}`);
    }

    // Full-size WebP
    const fullPath = join(OUTPUT_DIR, `${name}.webp`);
    await sharp(inputPath).webp({ quality: QUALITY }).toFile(fullPath);
    console.log(`  ✓ ${fullPath}`);
  }

  console.log('Done!');
}

optimize().catch(console.error);
