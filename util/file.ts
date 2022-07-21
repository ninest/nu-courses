export const writeJSON = async (path: string, json: any) => {
  await Deno.writeTextFile(path, JSON.stringify(json));
};

export const readJSON = async <T>(path: string): Promise<T | null> => {
  try {
    return JSON.parse(await Deno.readTextFile(path)) as T;
  } catch {
    return null;
  }
};
