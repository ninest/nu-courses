import { getCoursesForTerm, searchPost } from "@/banner/course.ts";
import { getTerms } from "@/banner/term.ts";
import { Course, Subject } from "@/banner/types.ts";
import { transformCourse } from "@/transformers/course.ts";
import { dedupAndMerge } from "@/util/dedup-merge.ts";
import { readJSON, writeJSON } from "@/util/file.ts";
import { FOLDER_PATH, TERMS } from "@/fetcher/constants.ts";

const subjects = await readJSON<Subject[]>(`${FOLDER_PATH}/subjects.json`);

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

  // Some sections have the required NUpath while others don't
  const combinedNuPath = dedupAndMerge({
    primaryKey: "number",
    mergeKey: "nuPath",
    items: courses,
    type: "list",
  });

  // Merge terms and references
  const uniqueCourses = dedupAndMerge({
    primaryKey: "number",
    mergeKey: "_termReferenceMap",
    items: combinedNuPath,
    type: "object",
  });

  writeJSON(`${FOLDER_PATH}/courses/${subject.code}.json`, uniqueCourses);

  console.log(`${subjectIndex + 1}/${noSubjects} ${subject.code} done`);
}
