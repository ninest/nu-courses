import { getCourseDescription } from "../banner/description.ts";
import { Course, Subject } from "../banner/types.ts";
import { readJSON, writeJSON } from "../util/file.ts";
import { FOLDER_PATH, TERMS } from "./constants.ts";

// We are assuming that the same course

const subjects = await readJSON<Subject[]>(`${FOLDER_PATH}/subjects.json`);

const noSubjects = subjects?.length;
for await (const [index, subject] of subjects!.entries()) {
  const courses = await readJSON<Course[]>(
    `${FOLDER_PATH}/courses/${subject.code}.json`
  );

  const coursesWithDescriptions: Course[] = [];

  const noCourses = courses?.length;
  for await (const [courseIndex, course] of courses!.entries()) {
    const description = await getCourseDescription(
      course._termCode,
      course.referenceNumber
    );
    coursesWithDescriptions.push({ ...course, description });

    console.log(
      `${index + 1}/${noSubjects} : ${
        courseIndex + 1
      }/${noCourses} courses done`
    );
  }

  writeJSON(
    `${FOLDER_PATH}/courses/${subject.code}.json`,
    coursesWithDescriptions
  );

  console.log(`${index + 1}/${noSubjects} ${subject.code} done`);
}
