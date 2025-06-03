import "server-only";

import { s3Client } from "@/lib/aws";
import { PutObjectCommand } from "@aws-sdk/client-s3";

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

interface UploadedBlogPaths {
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

export function uploadBlogImagesToS3(
  images: ProcessedBlogImages,
  fileName: string,
): Promise<UploadedBlogPaths> {
  const bucketName = "podcast-summaries-dev";
  const basePath = `blog-images/${fileName}`;

  // JPG paths
  const originalJpgPath = `${basePath}.jpg`;
  const jpgLargePath = `${basePath}-lg.jpg`;
  const jpgMediumPath = `${basePath}-md.jpg`;
  const jpgSmallPath = `${basePath}-sm.jpg`;

  // WebP paths
  const webpOriginalPath = `${basePath}.webp`;
  const webpLargePath = `${basePath}-lg.webp`;
  const webpMediumPath = `${basePath}-md.webp`;
  const webpSmallPath = `${basePath}-sm.webp`;

  // Upload all images in parallel
  return Promise.all([
    // Original JPG image
    s3Client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: originalJpgPath,
        Body: images.originalJpg,
        ContentType: "image/jpeg",
      }),
    ),

    // Large JPG
    s3Client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: jpgLargePath,
        Body: images.jpgLarge,
        ContentType: "image/jpeg",
      }),
    ),

    // Medium JPG
    s3Client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: jpgMediumPath,
        Body: images.jpgMedium,
        ContentType: "image/jpeg",
      }),
    ),

    // Small JPG
    s3Client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: jpgSmallPath,
        Body: images.jpgSmall,
        ContentType: "image/jpeg",
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
    console.log(`Uploaded all blog image variations to S3`);

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
