import "server-only"

/**
 * Download a file from a URL and return it as a Buffer
 */
export async function downloadThumbnail(url: string): Promise<Buffer> {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to download thumbnail: ${response.status} ${response.statusText}`);
    }
    
    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  }