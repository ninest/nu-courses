import { getCoursesForTerm, searchPost } from "@/banner/course.ts";
import { getTerms } from "@/banner/term.ts";
import { Course, Subject } from "@/banner/types.ts";
import { FOLDER_PATH, TERMS } from "@/fetcher/constants.ts";
import { transformCourse } from "@/transformers/course.ts";
import { readJSON, writeJSON } from "@/util/file.ts";
import { deepmerge } from "deepmergets";
import _ from "lodash";

const subjects = await readJSON<Subject[]>(`${FOLDER_PATH}/subjects.json`);
// const subjects = [{ code: "CS" }];

// Get the cookie
const { cookie } = await getTerms({ noTerms: 1 /* Can it always be one? */ });

const noSubjects = subjects?.length;
for await (const [subjectIndex, subject] of subjects!.entries()) {
  const courses: Course[] = [];

  const noTerms = TERMS?.length;
  for await (const [termIndex, term] of TERMS!.entries()) {
    await searchPost(cookie, term.code);
    const coursesForTerm = await getCoursesForTerm(
      cookie,
      term.code,
      subject.code
    );

    courses.push(...coursesForTerm.map(transformCourse));

    console.log(
      `${subjectIndex + 1}/${noSubjects} : ${
        termIndex + 1
      }/${noTerms} terms done`
    );
  }

  /* 
  - Some sections have required NUpath while others don't
  - Descriptions between sections can be different (Fundies vs Fundies Acc), so we need to get all CRNs for each term
  */

  const courseNumberToCourses = _.groupBy(courses, "number");

  const uniqueCourses: Course[] = Object.keys(courseNumberToCourses)
    .map(
      (courseNumber) =>
        deepmerge(...courseNumberToCourses[courseNumber]) as Course
    )
    // Extra step: remove duplicates in NUpath list
    .map((course: Course) => ({ ...course, nuPath: _.uniq(course.nuPath) }));

  writeJSON(`${FOLDER_PATH}/courses/${subject.code}.json`, uniqueCourses);

  console.log(`${subjectIndex + 1}/${noSubjects} ${subject.code} done`);
}
