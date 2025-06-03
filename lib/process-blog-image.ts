import "server-only";
import sharp from "sharp";

interface ProcessedBlogImages {
  originalJpg: Buffer;
  jpgLarge: Buffer;
  jpgMedium: Buffer;
  jpgSmall: Buffer;
  webpOriginal: Buffer;
  webpLarge: Buffer;
  webpMedium: Buffer;
  webpSmall: Buffer;
}

export function processBlogImage(buffer: Buffer): Promise<ProcessedBlogImages> {
  // Original image (keep as JPG regardless of input format)
  const originalJpg = buffer;

  // Process images in parallel for better performance
  return Promise.all([
    // Create large version (800w) in JPG
    sharp(buffer)
      .resize(800, null, { withoutEnlargement: true })
      .jpeg({ quality: 90 })
      .toBuffer(),

    // Create medium version (640w) in JPG
    sharp(buffer)
      .resize(640, null, { withoutEnlargement: true })
      .jpeg({ quality: 90 })
      .toBuffer(),

    // Create small version (400w) in JPG
    sharp(buffer)
      .resize(400, null, { withoutEnlargement: true })
      .jpeg({ quality: 90 })
      .toBuffer(),

    // Convert original to WebP at full size (1280w max)
    sharp(buffer)
      .resize(1280, null, { withoutEnlargement: true })
      .webp({ quality: 85 })
      .toBuffer(),

    // Create large version (800w) in WebP
    sharp(buffer)
      .resize(800, null, { withoutEnlargement: true })
      .webp({ quality: 85 })
      .toBuffer(),

    // Create medium version (640w) in WebP
    sharp(buffer)
      .resize(640, null, { withoutEnlargement: true })
      .webp({ quality: 85 })
      .toBuffer(),

    // Create small version (400w) in WebP
    sharp(buffer)
      .resize(400, null, { withoutEnlargement: true })
      .webp({ quality: 85 })
      .toBuffer(),
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
