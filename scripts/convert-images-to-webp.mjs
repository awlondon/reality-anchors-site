#!/usr/bin/env node

/**
 * Convert all JPG images in public/images/ to WebP format.
 *
 * Usage:
 *   npx sharp-cli -i public/images/*.jpg -o public/images/ -f webp -q 80
 *
 * Or install sharp and run this script:
 *   npm install --save-dev sharp
 *   node scripts/convert-images-to-webp.mjs
 *
 * The PhotoBackground component automatically uses WebP when the file exists,
 * falling back to the original JPG for browsers that don't support WebP.
 */

import { readdir } from 'node:fs/promises';
import { join, extname, basename } from 'node:path';

const IMAGES_DIR = 'public/images';

async function main() {
  let sharp;
  try {
    sharp = (await import('sharp')).default;
  } catch {
    console.error(
      'sharp is not installed. Install it first:\n  npm install --save-dev sharp\n\n' +
      'Or use the npx one-liner:\n  npx sharp-cli -i public/images/*.jpg -o public/images/ -f webp -q 80'
    );
    process.exit(1);
  }

  const files = await readdir(IMAGES_DIR);
  const jpgs = files.filter((f) => /\.jpe?g$/i.test(extname(f)));

  if (jpgs.length === 0) {
    console.log('No JPG files found in', IMAGES_DIR);
    return;
  }

  console.log(`Converting ${jpgs.length} images to WebP...`);

  for (const file of jpgs) {
    const input = join(IMAGES_DIR, file);
    const output = join(IMAGES_DIR, basename(file, extname(file)) + '.webp');
    await sharp(input).webp({ quality: 80 }).toFile(output);
    console.log(`  ${file} → ${basename(output)}`);
  }

  console.log('Done.');
}

main();
