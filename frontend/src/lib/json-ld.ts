/**
 * Serializes a JSON-LD payload for safe injection via `dangerouslySetInnerHTML`.
 *
 * `JSON.stringify` does not escape "<", so a string field containing
 * "</script>" would prematurely close the surrounding <script> tag and let
 * injected markup execute as a sibling element (CWE-79 script-tag breakout).
 * Escaping "<" to its unicode escape neutralizes this: every JSON parser
 * (and every JSON-LD/schema.org consumer, including search engines) decodes
 * "<" back to the identical "<" character, so the escaped output is
 * byte-for-byte equivalent once parsed — only the raw HTML source changes.
 */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c')
}
