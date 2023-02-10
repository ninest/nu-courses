import { DATA_DIR_PATH } from "@/fetcher/constants.ts";
import { Course, MinimizedCourse, Subject } from "@/types.ts";
import { readJSON, writeJSON } from "@/util/file.ts";

/* Combine all courses into a single file */

const subjects = await readJSON<Subject[]>(`${DATA_DIR_PATH}/subjects.json`);

const allCourses: MinimizedCourse[] = [];

for await (const subject of subjects!) {
  try {
    const courses = await readJSON<Course[]>(
      `${DATA_DIR_PATH}/courses/${subject.code}.json`,
    )!;
    const minimizedCourses: MinimizedCourse[] = courses?.map((course) => ({
      subject: course.subject,
      number: course.number,
      title: course.title,
    })) ?? [];
    allCourses.push(...minimizedCourses);
  } catch {
    // TODO
  }
}

await writeJSON(`${DATA_DIR_PATH}/all-courses.json`, allCourses);
