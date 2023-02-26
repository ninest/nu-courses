import { Hono } from "hono";
import { TERMS } from "../constants/terms.ts";

export const termsRouter = new Hono();

termsRouter.get("/", (c) => {
  return c.json(TERMS);
});

termsRouter.get("/:termCode", (c) => {
  const termCode = c.req.param("termCode");
  const term = TERMS.find((t) => t.code === termCode);
  if (!term) return c.json({ message: "Invalid term ID" }, 400);
  return c.json(term);
});
