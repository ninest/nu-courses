import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.33-alpha/deno-dom-wasm.ts";

export const decodeHTML = (string: string): string => {
  const document = new DOMParser().parseFromString(
    `<textarea></textarea>`,
    "text/html",
  );
  const textarea = document?.getElementsByTagName("textarea")[0];
  textarea!.innerHTML = string;
  const decoded = textarea?.innerText;
  return decoded!.replaceAll("&#8217;", "'").replaceAll("#8217;", "'");
};
