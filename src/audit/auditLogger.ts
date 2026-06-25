/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export function computeSha256Fingerprint(text: string): string {
  // Simple deterministic hash for verification
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash.toString(16);
}
