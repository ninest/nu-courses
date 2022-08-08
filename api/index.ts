import { Application, Router } from "oak";
import { sectionsRouter } from "@/api/sections.ts";

const app = new Application();
const sections = new Router().use("/sections", sectionsRouter.routes());
app.use(sections.routes(), sections.allowedMethods());

console.log("Listening on http://localhost:3000");
await app.listen({ port: 3000 });
