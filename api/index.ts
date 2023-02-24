import { Hono } from "hono";
import { serve } from "http-server";

import { sectionsRouter } from "./sections.ts";
import { subjectsRouter } from "./subjects.ts";

const app = new Hono();
app.route("/subjects", subjectsRouter);
app.route("/sections", sectionsRouter);

serve(app.fetch, { port: 3000 });
