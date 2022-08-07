import { Seats } from "@/types.ts";
import { DOMParser, Element } from "https://deno.land/x/deno_dom@v0.1.33-alpha/deno-dom-wasm.ts";
import { minifyHTML } from "https://deno.land/x/minifier/mod.ts";

export const transformSeats = (html: string): Seats => {
  const $document = new DOMParser().parseFromString(minifyHTML(html), "text/html");
  const spans = $document?.querySelectorAll("span") as unknown as Element[];

  return {
    total: Number(spans[3].innerText),
    available: Number(spans[5].innerText),
    waitlist: {
      capacity: Number(spans[7].innerText),
      available: Number(spans[11].innerText),
    },
  };
};
