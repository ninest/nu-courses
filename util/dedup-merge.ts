interface DedupAndMergeParams<T> {
  primaryKey: keyof T;
  mergeKey: keyof T;
  items: T[];
  type: "object" | "list";
}
// Remove duplicates and merge by key
export const dedupAndMerge = <T>({
  primaryKey,
  mergeKey,
  items,
  type = "object",
}: DedupAndMergeParams<T>): T[] => {
  const unique: T[] = [];
  for (const [index, item] of items.entries()) {
    // Check if item of primaryKey exists in unique
    const existingItemIndex = unique.findIndex(
      (a) => a[primaryKey] == item[primaryKey],
    );
    if (existingItemIndex != -1) {
      // If so, just merge at the mergeKey
      if (type == "object") {
        unique[existingItemIndex][mergeKey] = {
          ...unique[existingItemIndex][mergeKey],
          ...item[mergeKey],
        };
      } else {
        // TODO: fix TS, this causes duplicate items in the list
        unique[existingItemIndex][mergeKey] = [
          // @ts-ignore
          ...unique[existingItemIndex][mergeKey],
          // @ts-ignore
          ...item[mergeKey],
        ] as unknown as T[keyof T];
      }
    } else {
      // Otherwise, add to unique
      unique.push(item);
    }
  }
  return unique;
};

/* EXAMPLE
dedupAndMerge({
  primaryKey: "id",
  mergeKey: "merger",
  items: [
    { id: 1, merger: { a: "B" } },
    { id: 1, merger: { b: "B" } },
    { id: 3, merger: { bed: "ed" } },
    { id: 2, merger: { z: "B" } },
    { id: 2, merger: { c: "B" } },
  ],
  type:'object'
});

[
  { id: 1, merger: { a: "B", b: "B" } },
  { id: 3, merger: { bed: "ed" } },
  { id: 2, merger: { z: "B", c: "B" } }
]
*/
