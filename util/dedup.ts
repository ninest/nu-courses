export const dedup = <T>(key: keyof T, items: T[]): T[] => {
  const keys = items.map((item) => item[key]);
  const uniqueItems = items.filter(
    (items, index) => !keys.includes(items[key], index + 1)
  );
  return uniqueItems;
};
