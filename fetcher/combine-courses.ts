import { DATA_DIR_PATH } from "@/constants/paths.ts";
import { Course, Subject } from "@/types.ts";
import { readJSON, writeJSON } from "@/util/file.ts";

/* Combine all courses into a single file */

const subjects = await readJSON<Subject[]>(`${DATA_DIR_PATH}/subjects.json`);

const allCourses: Course[] = [];

for await (const subject of subjects!) {
  try {
    const courses = await readJSON<Course[]>(`${DATA_DIR_PATH}/courses/${subject.code}.json`)!;
    courses?.forEach((course) => allCourses.push(course));
  } catch {
    // TODO
  }
}

await writeJSON(`${DATA_DIR_PATH}/all-courses.json`, allCourses);
