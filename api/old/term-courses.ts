import { DATA_DIR_PATH } from "@/constants/paths.ts";
import { Router } from "oak";
import { TermSubjectCourseMapping } from "../types.ts";
import { readJSON } from "../util/file.ts";

export const termCoursesRouter = new Router();

termCoursesRouter.get("/:term", async (context) => {
  const term: string = context.params.term;

  const termCourseMapping = await readJSON<TermSubjectCourseMapping>(
    `${DATA_DIR_PATH}/mappings/term-courses/${term}.json`
  );

  if (termCourseMapping == null) {
    context.response.status = 400;
    context.response.body = {
      message: "Invalid term code or term-courses mapping does not exist",
    };
    return;
  }

  context.response.status = 200;
  context.response.body = { data: termCourseMapping };
  return;
});
