import { getCoursesForTerm, searchPost } from "/banner/course.ts";
import { getAllSubjects } from "/banner/subject.ts";
import { getTerms } from "/banner/term.ts";
import { Course } from "@/types.ts";
import { transformCourse } from "/transformers/course.ts";
import { writeJSON } from "/util/file.ts";

const { cookie } = await getTerms({ noTerms: 1 });
// await writeJSON("./data/terms.json", terms);
// console.log("Found terms");

// Only use Fall 2022
const fallTerm = {
  code: "202310",
  description: "Fall 2022 Semester",
};

const subjects = await getAllSubjects([fallTerm]);
await writeJSON("./data/subjects.json", subjects);
console.log("Found subjects");

// Create the object
const fetchedCourses: Record<string, Course[]> = {};
subjects.forEach((subject) => (fetchedCourses[subject.code] = []));

for await (const subject of subjects) {
  console.log(`Starting ${subject.code}`);

  await searchPost(cookie, fallTerm.code);
  const coursesForTerm = await getCoursesForTerm(
    cookie,
    fallTerm.code,
    subject.code,
  );

  // fetchedCourses[subject.code].push(...coursesForTerm);
  writeJSON(
    `./data/courses/${subject.code}.json`,
    coursesForTerm.map(transformCourse),
  );
  console.log(`Finished ${subject.code}`);
}
