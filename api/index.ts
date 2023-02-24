import { Hono } from "hono";
import { serve } from "http-server";

import { sectionsRouter } from "./sections.ts";

const app = new Hono();
app.route("/sections", sectionsRouter);

serve(app.fetch, { port: 3000 });
