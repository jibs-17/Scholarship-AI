/**
 * Canonical public URL for Open Graph, Twitter cards, and share links.
 * On Vercel, set NEXT_PUBLIC_SITE_URL to your production URL once, or rely on VERCEL_URL.
 */
export function getPublicSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) {
    return explicit.replace(/\/$/, "");
  }
  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) {
    const host = vercel.replace(/^https?:\/\//i, "");
    return `https://${host}`;
  }
  return "http://localhost:3000";
}
