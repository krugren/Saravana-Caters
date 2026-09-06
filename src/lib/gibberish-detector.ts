/**
 * Lightweight gibberish detector.
 *
 * Designed for a South Indian catering review form — must allow:
 *   - English text
 *   - Tamil script (Unicode U+0B80–U+0BFF)
 *   - Romanised Tamil ("vandhu vanakkam")
 *   - Devanagari / other Indian scripts
 *
 * Detection layers (short-circuit on first failure):
 *   1. Character-run repetition  ("aaaaaaa", "hahaha")
 *   2. Keyboard-mash patterns    ("qwerty", "asdfgh", "zxcvbn")
 *   3. Repeated-word spam        ("good good good good good")
 *   4. Latin vowel-ratio check   (only when text is >80% ASCII letters)
 *   5. Word-quality check        (too many consonant-only words)
 *   6. Character-diversity check (too few unique chars for the length)
 */

// Tamil Unicode block
const TAMIL_RE = /[\u0B80-\u0BFF]/;
// Devanagari
const DEVA_RE = /[\u0900-\u097F]/;
// Any non-ASCII letter (broad "not Latin" check)
const NON_LATIN_RE = /[^\u0000-\u007F]/;

const KEYBOARD_MASH = [
  "qwerty", "qwert", "asdfgh", "asdf", "zxcvbn", "zxcv",
  "qazwsx", "wsxedc", "rfvbgt", "yhnujm", "plokij",
  "aaaaa", "bbbbb", "ccccc", "ddddd", "eeeee",
  "12345", "123456", "abcdef", "abcde",
];

export interface GibberishResult {
  isGibberish: boolean;
  reason?: string;
}

export function detectGibberish(text: string): GibberishResult {
  const trimmed = text.trim();
  if (trimmed.length === 0) return { isGibberish: false };

  const lower = trimmed.toLowerCase();

  // ── Layer 1: Character-run repetition ──────────────────────────────────────
  // 5+ of the same char in a row  (but not "aaaaa" in Tamil script)
  if (/(.)\1{4,}/.test(lower)) {
    return { isGibberish: true, reason: "Excessive character repetition detected." };
  }

  // ── Layer 2: Keyboard mash ─────────────────────────────────────────────────
  const ascii = lower.replace(/[^a-z0-9]/g, "");
  for (const pat of KEYBOARD_MASH) {
    if (ascii.includes(pat)) {
      return { isGibberish: true, reason: "Keyboard mash pattern detected." };
    }
  }

  // ── Layer 3: Repeated-word spam ────────────────────────────────────────────
  // "good good good good" → word appears more than 40% of all words
  const wordList = trimmed.split(/\s+/).filter(Boolean);
  if (wordList.length >= 5) {
    const freq = new Map<string, number>();
    for (const w of wordList) {
      const k = w.toLowerCase().replace(/[^a-z\u0B80-\u0BFF]/g, "");
      if (k) freq.set(k, (freq.get(k) ?? 0) + 1);
    }
    for (const count of freq.values()) {
      if (count / wordList.length > 0.45) {
        return { isGibberish: true, reason: "Review contains excessive repeated words." };
      }
    }
  }

  // ── Non-Latin early exit ───────────────────────────────────────────────────
  // If text is predominantly Tamil / Devanagari, skip Latin-specific checks.
  const nonLatinCount = (trimmed.match(/[^\u0000-\u007F]/g) ?? []).length;
  const isNonLatinDominant = nonLatinCount / trimmed.length > 0.35;
  if (isNonLatinDominant || TAMIL_RE.test(trimmed) || DEVA_RE.test(trimmed)) {
    return { isGibberish: false };
  }

  // ── Latin-only analysis ────────────────────────────────────────────────────
  // Extract only a-z letters
  const lettersOnly = lower.replace(/[^a-z]/g, "");
  if (lettersOnly.length < 10) return { isGibberish: false }; // too short to analyse

  // ── Layer 4: Vowel ratio ───────────────────────────────────────────────────
  const vowels = lettersOnly.replace(/[^aeiou]/g, "").length;
  const ratio = vowels / lettersOnly.length;
  // Real English: ~32–42% vowels. Allow generous band (8%–88%) for Romanised Tamil.
  if (ratio < 0.08 || ratio > 0.88) {
    return {
      isGibberish: true,
      reason: "Text does not appear to be in a recognisable language.",
    };
  }

  // ── Layer 5: Word quality ──────────────────────────────────────────────────
  // Words longer than 3 chars with no vowels at all → likely garbage
  const asciiWords = lower.split(/\s+/).filter((w) => w.replace(/[^a-z]/g, "").length > 3);
  if (asciiWords.length >= 4) {
    const noVowel = asciiWords.filter((w) => !/[aeiou]/.test(w)).length;
    if (noVowel / asciiWords.length > 0.55) {
      return { isGibberish: true, reason: "Text does not appear to be meaningful." };
    }
  }

  // ── Layer 6: Character diversity ──────────────────────────────────────────
  const unique = new Set(lettersOnly).size;
  if (lettersOnly.length > 25 && unique < 5) {
    return { isGibberish: true, reason: "Text appears to be repetitive nonsense." };
  }

  return { isGibberish: false };
}
