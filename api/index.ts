import { Application, Router } from "oak";
import { oakCors } from "cors";
import { sectionsRouter } from "@/api/sections.ts";
import { termCoursesRouter } from "./term-courses.ts";

const app = new Application();
const router = new Router()
  .use("/sections", sectionsRouter.routes())
  .use("/mapping/term-courses", termCoursesRouter.routes());

app.use(oakCors());
app.use(router.routes(), router.allowedMethods());

console.log("Listening on http://localhost:3000");
await app.listen({ port: 3000 });
