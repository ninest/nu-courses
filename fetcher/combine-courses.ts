import { Course, Subject } from "@/banner/types.ts";
import { FOLDER_PATH } from "@/fetcher/constants.ts";
import { readJSON, writeJSON } from "@/util/file.ts";

/* Combine all courses into a single file */

const subjects = await readJSON<Subject[]>(`${FOLDER_PATH}/subjects.json`);

const allCourses: Course[] = [];

for await (const subject of subjects!) {
  try {
    const courses = await readJSON<Course[]>(
      `${FOLDER_PATH}/courses/${subject.code}.json`
    )!;
    allCourses.push(...courses!);
  } catch {
    // TODO
  }
}

await writeJSON(`${FOLDER_PATH}/all-courses.json`, allCourses);
