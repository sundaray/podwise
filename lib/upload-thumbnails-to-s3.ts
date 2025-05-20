import "server-only";

import { s3Client } from "@/lib/aws";
import { PutObjectCommand } from "@aws-sdk/client-s3";

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

interface UploadedPaths {
  originalJpg: string;
  jpgLarge: string;
  jpgMedium: string;
  jpgSmall: string;
  webpOriginal: string;
  webpLarge: string;
  webpMedium: string;
  webpSmall: string;
  jpgSrcset: string;
  webpSrcset: string;
}

export function uploadThumbnailsToS3(
  images: ProcessedImages,
  fileName: string,
  extension: string,
  podcastHost: string,
): Promise<UploadedPaths> {
  const bucketName = "podcast-summaries-dev";
  const basePath = `podcast-thumbnails/${podcastHost}/${fileName}`;

  // JPG paths
  const originalJpgPath = `${basePath}${extension}`;
  const jpgLargePath = `${basePath}-lg${extension}`;
  const jpgMediumPath = `${basePath}-md${extension}`;
  const jpgSmallPath = `${basePath}-sm${extension}`;

  // WebP paths
  const webpOriginalPath = `${basePath}.webp`;
  const webpLargePath = `${basePath}-lg.webp`;
  const webpMediumPath = `${basePath}-md.webp`;
  const webpSmallPath = `${basePath}-sm.webp`;

  const jpgContentType =
    extension === ".jpg"
      ? "image/jpeg"
      : extension === ".png"
        ? "image/png"
        : "application/octet-stream";

  // Upload all images in parallel
  return Promise.all([
    // Original JPG image
    s3Client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: originalJpgPath,
        Body: images.originalJpg,
        ContentType: jpgContentType,
      }),
    ),

    // Large JPG
    s3Client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: jpgLargePath,
        Body: images.jpgLarge,
        ContentType: jpgContentType,
      }),
    ),

    // Medium JPG
    s3Client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: jpgMediumPath,
        Body: images.jpgMedium,
        ContentType: jpgContentType,
      }),
    ),

    // Small JPG
    s3Client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: jpgSmallPath,
        Body: images.jpgSmall,
        ContentType: jpgContentType,
      }),
    ),

    // Original size WebP
    s3Client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: webpOriginalPath,
        Body: images.webpOriginal,
        ContentType: "image/webp",
      }),
    ),

    // Large WebP
    s3Client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: webpLargePath,
        Body: images.webpLarge,
        ContentType: "image/webp",
      }),
    ),

    // Medium WebP
    s3Client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: webpMediumPath,
        Body: images.webpMedium,
        ContentType: "image/webp",
      }),
    ),

    // Small WebP
    s3Client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: webpSmallPath,
        Body: images.webpSmall,
        ContentType: "image/webp",
      }),
    ),
  ]).then(() => {
    console.log(`Uploaded all thumbnail variations to S3`);

    // Generate srcset strings for frontend use
    const bucketUrl = `https://podcast-summaries-dev.s3.amazonaws.com`;

    const jpgSrcset = `
      ${bucketUrl}/${jpgSmallPath} 400w,
      ${bucketUrl}/${jpgMediumPath} 640w,
      ${bucketUrl}/${jpgLargePath} 800w,
      ${bucketUrl}/${originalJpgPath} 1280w
    `.trim();

    const webpSrcset = `
      ${bucketUrl}/${webpSmallPath} 400w,
      ${bucketUrl}/${webpMediumPath} 640w,
      ${bucketUrl}/${webpLargePath} 800w,
      ${bucketUrl}/${webpOriginalPath} 1280w
    `.trim();

    return {
      originalJpg: originalJpgPath,
      jpgLarge: jpgLargePath,
      jpgMedium: jpgMediumPath,
      jpgSmall: jpgSmallPath,
      webpOriginal: webpOriginalPath,
      webpLarge: webpLargePath,
      webpMedium: webpMediumPath,
      webpSmall: webpSmallPath,
      jpgSrcset,
      webpSrcset,
    };
  });
}
