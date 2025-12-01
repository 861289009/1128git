export const IMAGES: Record<string, string> = import.meta.glob('./image/*', {
  query: '?url',
  import: 'default',
  eager: true,
});

// Build a basename -> url map to tolerate case differences
const BY_BASENAME: Record<string, string> = Object.entries(IMAGES).reduce((acc, [path, url]) => {
  const base = path.split('/').pop()!.toLowerCase();
  acc[base] = url as string;
  return acc;
}, {} as Record<string, string>);

export function resolveImage(filename: string): string {
  const normalized = filename.split('/').pop()!.toLowerCase();
  return BY_BASENAME[normalized] ?? (IMAGES[`./image/${filename}`] as string) ?? `/image/${filename}`;
}
