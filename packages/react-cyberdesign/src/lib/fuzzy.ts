/**
 * Ranked fuzzy matcher shared by `Command` and any app list that should rank
 * the same way (a sound browser, a file list).
 *
 * Tiers, best first — a higher tier always outranks a lower one:
 *
 * | Tier        | Score       | Rule                                              |
 * | ----------- | ----------- | ------------------------------------------------- |
 * | exact       | 1000        | text equals the query                             |
 * | prefix      | 201 – 499   | text starts with the query; shorter text wins     |
 * | substring   | 101 – 200   | text contains the query; earlier, then shorter    |
 * | secondary   | 51 – 100    | secondary field contains the query; earlier wins  |
 * | subsequence | 50          | query letters appear in order in the text         |
 * | none        | 0           | no match                                          |
 */

/**
 * Score `text` (and `secondary` as a weaker field) against `query`.
 * Case-insensitive; the query is trimmed. Returns 0 for no match or an empty query.
 */
export function fuzzyScore(query: string, text: string, secondary = ''): number {
  const q = query.trim().toLowerCase();
  if (!q) return 0;
  const t = text.toLowerCase();
  if (t === q) return 1000;
  // The length / position nudges are capped so they never cross into the tier below.
  if (t.startsWith(q)) return 500 - Math.min(t.length, 299);
  const tIdx = t.indexOf(q);
  if (tIdx >= 0) return 200 - Math.min(tIdx + t.length * 0.01, 99);
  const sIdx = secondary.toLowerCase().indexOf(q);
  if (sIdx >= 0) return 100 - Math.min(sIdx, 49);
  // Subsequence match (e.g. "sf" matches "Save File").
  let i = 0;
  for (let j = 0; j < t.length; j++) {
    if (t[j] === q[i]) i++;
    if (i === q.length) return 50;
  }
  return 0;
}

/**
 * Filter `items` to those matching `query` and order them best match first
 * (ties keep their original order). An empty query returns every item in its
 * original order.
 *
 * @param text      the item's primary searchable text
 * @param secondary optional weaker field (keywords, subtitle, path)
 */
export function fuzzyRank<T>(
  items: readonly T[],
  query: string,
  text: (item: T) => string,
  secondary?: (item: T) => string,
): T[] {
  if (!query.trim()) return [...items];
  return items
    .map((item) => ({ item, score: fuzzyScore(query, text(item), secondary?.(item)) }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((r) => r.item);
}
