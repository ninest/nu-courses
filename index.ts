import { getCoursesForTerm } from "./course.ts";
import { writeJSON } from "./file.ts";
import { getAllSubjects } from "./subject.ts";
import { getTerms } from "./term.ts";
import { transformCourse } from "./transformers/course.ts";
import { Course } from "./types.ts";

const { terms, cookie } = await getTerms({ noTerms: 9 });
await writeJSON("./data/terms.json", terms);
console.log("Found terms");

const subjects = await getAllSubjects(terms);
await writeJSON("./data/subjects.json", subjects);
console.log("Found subjects");

// For now, only look for CS Fall 22 courses
for await (const subject of [{ code: "CS" }]) {
  console.log(`Finding ${subject.code} courses ...`);

  const courses: Course[] = [];
  for await (const term of [{ code: "202310" }]) {
    console.log(`${subject.code} ${term.code}`);

    // We don't care about the terms; we only care about "courses", not section
    const coursesForTerm = await getCoursesForTerm(
      cookie,
      term.code,
      subject.code
    );
    if (coursesForTerm) {
      courses.push(...coursesForTerm);
    }
  }

  const transformedCourses = courses.map(transformCourse);

  // remove duplicates
  const courseNumbers = transformedCourses.map((course) => course.number);
  const uniqueCourses = transformedCourses.filter(
    (course, index) => !courseNumbers.includes(course.number, index + 1)
  );

  await writeJSON(`./data/courses/${subject.code}.json`, uniqueCourses);
  console.log(`Found ${subject.code} courses`);
}
