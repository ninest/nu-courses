import { DATA_DIR_PATH } from "@/constants/paths.ts";
import { Subject, Course, TermSubjectCourseMapping, SubjectWithCourseCount } from "@/types.ts";
import { readJSON } from "@/util/file.ts";
import { Hono } from "hono";

export const coursesRouter = new Hono();

coursesRouter.get("/:term", async (c) => {
  const term = c.req.param("term");
  const termCourseMapping = await readJSON<TermSubjectCourseMapping>(
    `${DATA_DIR_PATH}/mappings/term-courses/${term}.json`
  );
  if (!termCourseMapping)
    return c.json({ message: "Invalid term or data for this term is unavailable" }, 400);

  const subjects = await readJSON<Subject[]>(`${DATA_DIR_PATH}/subjects.json`);

  const subjectsWithCourseCounts: SubjectWithCourseCount[] = subjects!.map((subject) => {
    const numCourses = termCourseMapping[subject.code].length;
    return { ...subject, numCourses };
  });
  return c.json(subjectsWithCourseCounts);
});

coursesRouter.get("/all/:subjectCode", async (c) => {
  const subjectCode = c.req.param("subjectCode");
  const subjects = await readJSON<Subject[]>(`${DATA_DIR_PATH}/subjects.json`);

  const subject = subjects?.find((s) => s.code === subjectCode);
  if (!subject) return c.json({ message: "Invalid subject code" }, 400);

  const courses = await readJSON<Course[]>(`${DATA_DIR_PATH}/courses/${subjectCode}.json`);
  return c.json(courses);
});

coursesRouter.get("/all/:subjectCode/:courseNumber", async (c) => {
  const subjectCode = c.req.param("subjectCode");
  const courseNumber = c.req.param("courseNumber");
  const subjects = await readJSON<Subject[]>(`${DATA_DIR_PATH}/subjects.json`);

  const subject = subjects?.find((s) => s.code === subjectCode);
  if (!subject) return c.json({ message: "Invalid subject code" }, 400);

  const courses = await readJSON<Course[]>(`${DATA_DIR_PATH}/courses/${subjectCode}.json`);
  const course = courses?.find((c) => c.subject === subjectCode && c.number === courseNumber);
  if (!course) return c.json({ message: "Invalid course number or course" }, 400);

  return c.json(course);
});

coursesRouter.get("/:term/:subjectCode", async (c) => {
  const term = c.req.param("term");
  const subjectCode = c.req.param("subjectCode");
  const termCourseMapping = await readJSON<TermSubjectCourseMapping>(
    `${DATA_DIR_PATH}/mappings/term-courses/${term}.json`
  );
  if (!termCourseMapping)
    return c.json({ message: "Invalid term or data for this term is unavailable" }, 400);
  const subjects = await readJSON<Subject[]>(`${DATA_DIR_PATH}/subjects.json`);

  const subject = subjects?.find((s) => s.code === subjectCode);
  if (!subject) return c.json({ message: "Invalid subject code" }, 400);

  const allCourses = await readJSON<Course[]>(`${DATA_DIR_PATH}/courses/${subjectCode}.json`);
  if (!allCourses) return c.json({ message: "Invalid subject code" }, 400);

  // Filter courses based on what's in termCourseMapping
  const courseNumbersInTerm = termCourseMapping[subjectCode].map((tcm) => tcm.number);
  const coursesInTerm = allCourses?.filter((course) =>
    courseNumbersInTerm.includes(course.number)
  );

  // Remove unneeded CRNs
  const courses = coursesInTerm.map((course) => ({
    ...course,
    sections: course.sections.filter((section) => section.term === term),
  }));

  return c.json(courses);
});
