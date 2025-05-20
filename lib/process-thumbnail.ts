import "server-only";
import sharp from "sharp";

interface ProcessedImages {
  originalJpg: Buffer;
  jpgLarge: Buffer;
  jpgMedium: Buffer;
  jpgSmall: Buffer;
  webpOriginal: Buffer;
  webpLarge: Buffer;
  webpMedium: Buffer;
  webpSmall: Buffer;
}

export function processThumbnail(buffer: Buffer): Promise<ProcessedImages> {
  // Original image
  const originalJpg = buffer;

  // Process images in parallel for better performance
  return Promise.all([
    // Create large version (800w) in JPG
    sharp(buffer).resize(800).jpeg({ quality: 90 }).toBuffer(),

    // Create medium version (640w) in JPG
    sharp(buffer).resize(640).jpeg({ quality: 90 }).toBuffer(),

    // Create small version (400w) in JPG
    sharp(buffer).resize(400).jpeg({ quality: 90 }).toBuffer(),

    // Convert original to WebP at full size (1280w)
    sharp(buffer).webp({ quality: 80 }).toBuffer(),

    // Create large version (800w) in WebP
    sharp(buffer).resize(800).webp({ quality: 80 }).toBuffer(),

    // Create medium version (640w) in WebP
    sharp(buffer).resize(640).webp({ quality: 80 }).toBuffer(),

    // Create small version (400w) in WebP
    sharp(buffer).resize(400).webp({ quality: 80 }).toBuffer(),
  ]).then(
    ([
      jpgLarge,
      jpgMedium,
      jpgSmall,
      webpOriginal,
      webpLarge,
      webpMedium,
      webpSmall,
    ]) => {
      return {
        originalJpg,
        jpgLarge,
        jpgMedium,
        jpgSmall,
        webpOriginal,
        webpLarge,
        webpMedium,
        webpSmall,
      };
    },
  );
}
