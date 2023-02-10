import { deepmerge } from "https://deno.land/x/deepmergets@v4.2.1/dist/deno/deepmerge.ts";
import _ from "lodash";
import { getCoursesForTerm, searchPost } from "../banner/course.ts";
import { getTerms } from "../banner/term.ts";
import { DATA_DIR_PATH } from "../constants/paths.ts";
import { TERMS } from "../constants/terms.ts";
import { transformCourse } from "../transformers/course.ts";
import { Course, Subject } from "../types.ts";
import { readJSON, writeJSON } from "../util/file.ts";

let subjects = await readJSON<Subject[]>(`${DATA_DIR_PATH}/subjects.json`);
if (Deno.args.includes("--debug")) subjects = [{ code: "CS" }];

const { cookie } = await getTerms({ noTerms: 1 /* Can it always be one? */ });
const numSubjects = subjects?.length;

for await (const [subjectIndex, subject] of subjects!.entries()) {
  const coursesFilePath = `${DATA_DIR_PATH}/courses/${subject.code}.json`;
  const courses: Course[] = [];

  // Get previous courses to merge data
  const previousCourses = await readJSON<Course[]>(coursesFilePath, []);
  if (previousCourses?.length === 0) {
    console.log(`Fetching ${subject.code} courses for the first time`);
  }

  const numTerms = TERMS.length;
  for await (const [termIndex, term] of TERMS.entries()) {
    await searchPost(cookie, term.code);

    const termCourses = await getCoursesForTerm(cookie, term.code, subject.code);
    const transformedCourses = termCourses.map(transformCourse);

    transformedCourses.forEach((c) => courses.push(c));
  }

  // `courses` currently contains duplicates due to the different terms/crns
  // the only difference between these courses are the sections, which must be merged

  const uniqueCourses: Course[] = [];

  // unique course numbers
  const courseNumbers = _.uniq(courses.map((course) => course.number));
  courseNumbers.forEach((number) => {
    const coursesToMerge = courses.filter((course) => course.number === number);
    const mergedCourse: Course = deepmerge(...coursesToMerge) as Course;
    uniqueCourses.push(mergedCourse);
  });

  // Combine with previous data
  const combinedCourses: Course[] = [];
  uniqueCourses.forEach((newCourse) => {
    const previousCourse = previousCourses?.find((course) => course.number === newCourse.number);
    if (previousCourse) {
      const combined: Course = deepmerge(newCourse, previousCourse);
      // Remove the sections we're not looking for
      combined.sections = newCourse.sections;
      combinedCourses.push(combined);
    } else {
      // If this course is new, just add it as is
      combinedCourses.push(newCourse);
    }
  });

  // It is possible that some older courses are not being offered this term. Keep those courses
  // even though they may not have any sections
  previousCourses?.forEach((previousCourse) => {
    // Please rename this variable
    const courseExistedPreviouslyButNotThisTerm = !combinedCourses.find(
      (course) => course.number === previousCourse.number
    );
    if (courseExistedPreviouslyButNotThisTerm) {
      // Clear the sections because they are for older terms
      previousCourse.sections = [];
      combinedCourses.push(previousCourse);
    }
  });

  // Final clean up: dedup nupath
  combinedCourses.forEach((course) => {
    course.nuPath = _.uniq(course.nuPath);
  });
  // Sort by course number
  const sortedCourses = combinedCourses.sort((a, b) => parseInt(a.number) - parseInt(b.number));

  writeJSON(coursesFilePath, sortedCourses);

  console.log(`${subjectIndex + 1}/${numSubjects}: ${subject.code} done`);
}
