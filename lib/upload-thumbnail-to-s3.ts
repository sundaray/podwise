import "server-only"

import { s3Client } from "@/lib/aws";
import { PutObjectCommand } from "@aws-sdk/client-s3";

/**
 * Upload a buffer to S3 and return the S3 key
 */
export async function uploadThumbnailToS3(
  buffer: Buffer, 
  fileName: string,  
  extension: string,
  podcastHost: string
): Promise<string> {
  const bucketName = "podcast-summaries-dev";
  const s3Key = `podcast-thumbnails/${podcastHost}/${fileName}${extension}`;
  
  const contentType = 
    extension === ".jpg" ? "image/jpeg" : 
    extension === ".png" ? "image/png" : 
    extension === ".webp" ? "image/webp" : 
    "application/octet-stream";
    
  await s3Client.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: s3Key,
      Body: buffer,
      ContentType: contentType
    })
  );
  
  console.log(`Uploaded thumbnail to: ${s3Key}`);
  return s3Key;
}