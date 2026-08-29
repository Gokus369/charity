/**
 * A photograph from the manifest in `data/photos.js`.
 *
 * Always renders width/height so the browser reserves the space before the
 * image arrives (no layout shift), and always requires alt text — a photo
 * with no alt is a bug, not a style choice.
 */
export default function Photo({ photo, className = '', sizes = '100vw', priority = false }) {
  if (!photo) return null;

  const largest = photo.srcset[photo.srcset.length - 1];

  return (
    <img
      className={`photo ${className}`.trim()}
      src={largest.src}
      srcSet={photo.srcset.map((s) => `${s.src} ${s.w}w`).join(', ')}
      sizes={sizes}
      width={largest.w}
      height={Math.round(largest.w / photo.ratio)}
      alt={photo.alt}
      loading={priority ? 'eager' : 'lazy'}
      decoding={priority ? 'sync' : 'async'}
      fetchPriority={priority ? 'high' : 'auto'}
    />
  );
}
