import { DATA_DIR_PATH } from "@/constants/paths.ts";
import { Subject } from "@/types.ts";
import { readJSON } from "@/util/file.ts";
import { Hono } from "hono";

export const subjectsRouter = new Hono();

subjectsRouter.get("/", async (c) => {
  const subjects = await readJSON<Subject[]>(`${DATA_DIR_PATH}/subjects.json`);

  return c.json(subjects);
});

subjectsRouter.get("/:subjectCode", async (c) => {
  const subjectCode = c.req.param("subjectCode");
  const subjects = await readJSON<Subject[]>(`${DATA_DIR_PATH}/subjects.json`);

  const subject = subjects?.find((s) => s.code === subjectCode);
  if (!subject) return c.json({ message: "Invalid subject code" }, 400);
  return c.json(subject);
});
