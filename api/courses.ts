import { Router } from "oak";
import { DATA_DIR_PATH } from "../constants/paths.ts";
import { Course, Subject } from "../types.ts";
import { readJSON } from "../util/file.ts";

export const coursesRouter = new Router();

coursesRouter.get("/:subjectCode", async (context) => {
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

  const courses = await readJSON<Course[]>(`${DATA_DIR_PATH}/courses/${subjectCode}.json`);

  context.response.status = 200;
  context.response.body = { data: courses };
});
