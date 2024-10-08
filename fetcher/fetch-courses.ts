import { getCoursesForTerm, searchPost } from "@/banner/course.ts";
import { getTerms } from "@/banner/term.ts";
import { TERMS } from "@/constants/terms.ts";
import { DATA_DIR_PATH } from "@/constants/paths.ts";
import { transformCourse } from "@/transformers/course.ts";
import { Course, Subject } from "@/types.ts";
import { readJSON, writeJSON } from "@/util/file.ts";
import { deepmerge } from "deepmergets";
import _ from "lodash";

const subjects = await readJSON<Subject[]>(`${DATA_DIR_PATH}/subjects.json`);
// const subjects = [{ code: "CS" }];

// Get the cookie
const { cookie } = await getTerms({ noTerms: 1 /* Can it always be one? */ });

const noSubjects = subjects?.length;
for await (const [subjectIndex, subject] of subjects!.entries()) {
  const courses: Course[] = [];

  // Get previous courses to merge in with, so no need to refetch descriptions/others after fetching courses
  const previouslyFetchedCourses = await readJSON<Course[]>(
    `${DATA_DIR_PATH}/courses/${subject.code}.json`,
    []
  );

  if (previouslyFetchedCourses?.length == 0) {
    console.log(`Fetching ${subject.code} courses for the first time`);
  }

  const noTerms = TERMS?.length;
  for await (const [termIndex, term] of TERMS!.entries()) {
    await searchPost(cookie, term.code);
    const coursesForTerm = await getCoursesForTerm(cookie, term.code, subject.code);

    const transformedCourses = coursesForTerm.map(transformCourse);

    // Merge and push transformedCourses to courses
    transformedCourses.forEach((course) => {
      const previousCourse = previouslyFetchedCourses?.find((c) => c.number == course.number);
      if (previousCourse) {
        // Don't want to lose all the data, so merge with previous data
        const mergedCourse = deepmerge(previousCourse, course);
        courses.push(mergedCourse);
      } else {
        if (previouslyFetchedCourses?.length !== 0) {
          console.log(`${course.subject} ${course.number} is new!`);
        }
        // If it doesn't exist, push as normal
        courses.push(course);
      }
    });

    // TODO: it's possible for a course to be offered a semester (CS 3000 in Summer I), but
    // not offered the next semester (CS 3000 in Summer 2). Those courses are in previously
    // fetched courses, so they should also remain

    console.log(`${subjectIndex + 1}/${noSubjects} : ${termIndex + 1}/${noTerms} terms done`);
  }

  /*
  - Some sections have required NUpath while others don't
  - Descriptions between sections can be different (Fundies vs Fundies Acc), so we need to get all CRNs for each term
  */

  const courseNumberToCourses = _.groupBy(courses, "number");

  const uniqueCourses: Course[] = Object.keys(courseNumberToCourses)
    .map((courseNumber) => deepmerge(...courseNumberToCourses[courseNumber]) as Course)
    // Extra step: remove duplicates in NUpath list
    .map((course: Course) => ({
      ...course,
      // TODO: are CRNs repeated?
      sections: _.uniqBy(course.sections, "crn"),
      nuPath: _.uniq(course.nuPath),
    }));

  writeJSON(`${DATA_DIR_PATH}/courses/${subject.code}.json`, uniqueCourses);

  console.log(`${subjectIndex + 1}/${noSubjects} ${subject.code} done`);
}
