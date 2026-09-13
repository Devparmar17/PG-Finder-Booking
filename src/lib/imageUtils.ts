/**
 * Centralized image helper for responsive sizing, srcset generation, and fallback handling.
 */
export const FALLBACK_PG_IMAGE =
  'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&auto=format&fit=crop&q=80';

export function getOptimizedImageUrl(
  url: string | undefined,
  width: number = 600,
  quality: number = 80
): string {
  if (!url) return FALLBACK_PG_IMAGE;
  if (!url.includes('images.unsplash.com')) return url;

  try {
    const parsed = new URL(url);
    parsed.searchParams.set('w', width.toString());
    parsed.searchParams.set('q', quality.toString());
    parsed.searchParams.set('auto', 'format');
    parsed.searchParams.set('fit', 'crop');
    return parsed.toString();
  } catch {
    // If URL parsing fails, replace or append w
    return url.replace(/w=\d+/, `w=${width}`);
  }
}

export function getImageSrcSet(
  url: string | undefined,
  widths: number[] = [320, 640, 960]
): string {
  if (!url || !url.includes('images.unsplash.com')) return '';
  return widths
    .map((w) => `${getOptimizedImageUrl(url, w)} ${w}w`)
    .join(', ');
}
