import { Hono } from "hono";
import { cors } from "hono/middleware";
import { serve } from "http-server";
import { coursesRouter } from "./courses.ts";
import { searchRouter } from "./search.ts";
import { sectionsRouter } from "./sections.ts";
import { subjectsRouter } from "./subjects.ts";
import { termsRouter } from "./terms.ts";

const app = new Hono();
app.use("/*", cors());
app.route("/terms", termsRouter)
app.route("/subjects", subjectsRouter);
app.route("/courses", coursesRouter);
app.route("/search", searchRouter);
app.route("/sections", sectionsRouter);

serve(app.fetch, { port: 8000 });
