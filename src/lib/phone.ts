/** Mauritius mobile/landline: 8 digits, optional +230. */
export function parseMuPhone(raw: string): string | null {
  const digits = raw.replace(/\D/g, "");
  if (digits.startsWith("230") && digits.length === 11) return `+${digits}`;
  if (digits.length === 8) return `+230${digits}`;
  return null;
}

export function parseHouseName(raw: string): string | null {
  const name = raw.trim().replace(/\s+/g, " ");
  if (name.length < 2 || name.length > 40) return null;
  if (parseMuPhone(name)) return null;
  const digits = name.replace(/\D/g, "");
  if (digits.length >= 6) return null;
  return name;
}
