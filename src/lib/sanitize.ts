/**
 * Input sanitisation — strips every attack surface from user-submitted strings.
 * Safe for Tamil script, Devanagari, and other Unicode scripts.
 */

/** HTML entity map for decode pass */
const HTML_ENTITIES: Record<string, string> = {
  "&lt;": "<", "&gt;": ">", "&amp;": "&",
  "&quot;": '"', "&#x27;": "'", "&#39;": "'",
  "&apos;": "'", "&#x2F;": "/", "&#47;": "/",
};

function decodeHtmlEntities(str: string): string {
  return str.replace(/&(?:lt|gt|amp|quot|#x27|#39|apos|#x2F|#47);/gi,
    (m) => HTML_ENTITIES[m] ?? m);
}

/**
 * Sanitise a single text field.
 * - Strips HTML tags
 * - Decodes HTML entities (then re-sanitises the decoded chars)
 * - Removes null bytes, ASCII control chars, zero-width chars, soft-hyphens
 * - Normalises to NFC
 * - Collapses excessive whitespace
 * - Enforces maxLength
 */
export function sanitizeText(input: unknown, maxLength: number): string {
  if (typeof input !== "string") return "";

  let s = input;

  // 1. NFC normalise (handles combining characters consistently)
  s = s.normalize("NFC");

  // 2. Strip HTML/script tags (basic and nested)
  s = s.replace(/<[^>]*>/g, "");

  // 3. Decode HTML entities, then strip any tags that were encoded
  s = decodeHtmlEntities(s);
  s = s.replace(/<[^>]*>/g, "");

  // 4. Remove null bytes
  s = s.replace(/\0/g, "");

  // 5. Remove ASCII control characters (except \n \r \t)
  // eslint-disable-next-line no-control-regex
  s = s.replace(/[\x01-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "");

  // 6. Remove zero-width / invisible / dangerous Unicode
  // Zero-width space, ZWSP, ZWNJ, ZWJ, BOM, soft-hyphen, RL/LR override, etc.
  s = s.replace(/[\u00AD\u200B-\u200F\u202A-\u202E\u2060-\u2064\uFEFF]/g, "");

  // 7. Collapse multiple consecutive spaces (keep newlines)
  s = s.replace(/[^\S\n\r]{2,}/g, " ");

  // 8. Collapse multiple consecutive newlines
  s = s.replace(/(\r?\n){3,}/g, "\n\n");

  // 9. Trim
  s = s.trim();

  // 10. Enforce length AFTER all transforms (server-side, independent of client)
  return s.slice(0, maxLength);
}

/**
 * Sanitise a name field specifically:
 * only allow letters (any script), spaces, hyphens, dots, apostrophes.
 */
export function sanitizeName(input: unknown, maxLength = 80): string {
  const s = sanitizeText(input, maxLength);
  // Allow Unicode letters (\p{L}), spaces, hyphens, apostrophes, dots
  // Use a regex that removes anything not in that set
  return s.replace(/[^\p{L}\p{M}\s\-'.]/gu, "").replace(/\s{2,}/g, " ").trim();
}

/**
 * Validate a rating value (1–5 integer).
 */
export function sanitizeRating(input: unknown): number | null {
  const n = Number(input);
  if (!Number.isInteger(n) || n < 1 || n > 5) return null;
  return n;
}
