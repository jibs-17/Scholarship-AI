/** Ensure scholarship portal links open in the browser reliably. */
export function normalizeExternalUrl(url: string | undefined | null): string {
  const raw = (url ?? "").trim();
  if (!raw) return "https://scholarships.gov.in";
  if (/^https?:\/\//i.test(raw)) return raw;
  if (/^\/\//.test(raw)) return `https:${raw}`;
  return `https://${raw}`;
}
