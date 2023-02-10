/* 
Map terms to subjects and courses offered in that term
https://github.com/ninest/nu-courses/issues/24
*/

import { TERMS } from "../fetcher/constants.ts";
import { Course, TermSubjectCourseMapping } from "../types.ts";
import { readJSON, writeJSON } from "../util/file.ts";

const COURSES_DIR_PATH = "./.data/courses";
const MAPPINGS_DIR_PATH = "./.data/mappings";

for (const term of TERMS) {
  const termCode = term.code
  const mapping: TermSubjectCourseMapping = {};

  for await (const subjectFile of Deno.readDir(COURSES_DIR_PATH)) {
    const subjectCode = subjectFile.name.split(".json")[0];
    mapping[subjectCode] = [];

    const courses = await readJSON<Course[]>(`${COURSES_DIR_PATH}/${subjectFile.name}`, []);

    courses?.forEach((course) => {
      if (course.sections.some((section) => section.term === termCode))
        mapping[subjectCode].push({
          number: course.number,
          crns: course.sections
            .filter((section) => section.term === termCode)
            .map((section) => section.crn),
        });
    });
  }

  writeJSON(`${MAPPINGS_DIR_PATH}/term-courses/${termCode}.json`, mapping);
}
