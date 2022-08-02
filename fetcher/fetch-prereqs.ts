import { getCoursePrereqs } from "@/banner/prereqs.ts";
import { FOLDER_PATH } from "@/fetcher/constants.ts";
import { transformPrereqs } from "@/transformers/prereqs.ts";
import { Course, Subject } from "@/types.ts";
import { readJSON, writeJSON } from "@/util/file.ts";

// const subjects = await readJSON<Subject[]>(`${FOLDER_PATH}/subjects.json`);
const subjects = [{ code: "CS" }];

const noSubjects = subjects?.length;
for await (const [index, subject] of subjects!.entries()) {
  const courses = await readJSON<Course[]>(`${FOLDER_PATH}/courses/${subject.code}.json`);

  console.log(`${index + 1} ${subject.code}`);

  const noCourses = courses?.length;
  for await (const [courseIndex, course] of courses!.entries()) {
    // If the prereqs are already there, no need to fetch again
    if (course.prereqs) {
      console.log(
        `${index + 1}/${noSubjects} (skipped) : ${courseIndex + 1}/${noCourses} courses done`
      );
      continue;
    }

    // Fetch coreq of first section only
    const firstSection = course.sections[0];
    const htmlPrereqs = await getCoursePrereqs(firstSection);
    const prereqs = transformPrereqs(htmlPrereqs);
    course.prereqs = prereqs;

    console.log(`${index + 1}/${noSubjects} : ${courseIndex + 1}/${noCourses} courses done`);
  }

  writeJSON(`${FOLDER_PATH}/courses/${subject.code}.json`, courses);

  console.log(`${index + 1}/${noSubjects} ${subject.code} done`);
}
