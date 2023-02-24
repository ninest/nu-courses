import { Router } from "oak";
import { DATA_DIR_PATH } from "../constants/paths.ts";
import { Course, Subject } from "../types.ts";
import { readJSON } from "../util/file.ts";

export const subjectsRouter = new Router();

subjectsRouter.get("/", async (context) => {
  const subjects = await readJSON<Subject[]>(`${DATA_DIR_PATH}/subjects.json`);

  context.response.status = 200;
  context.response.body = { data: subjects };
});

subjectsRouter.get("/:subjectCode", async (context) => {
  const subjectCode: string = context.params.subjectCode;
  const subjects = await readJSON<Subject[]>(`${DATA_DIR_PATH}/subjects.json`);

  const subject = subjects?.find((s) => s.code === subjectCode);
  if (!subject) {
    context.response.status = 400;
    context.response.body = {
      message: "Invalid subject code",
    };
    return;
  }

  context.response.status = 200;
  context.response.body = { data: subject };
});
