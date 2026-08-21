/**
 * Normalizes UID strings by stripping 'UID:' prefix, converting to uppercase,
 * and stripping colons, hyphens, and spaces.
 * Mirrors ESP32 firmware normalizeUID() logic.
 */
export function normalizeUid(uid) {
  if (!uid) return '';
  return uid
    .trim()
    .toUpperCase()
    .replace(/UID:/gi, '')
    .replace(/[\s:-]/g, '');
}
