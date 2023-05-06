import { DATA_DIR_PATH } from "@/constants/paths.ts";
import { Course, SearchGroup } from "@/types.ts";
import { readJSON } from "@/util/file.ts";
import { Hono } from "hono";

export const searchRouter = new Hono();

searchRouter.get("/", (c) => {
  return c.json({ ping: "pong" });
});

searchRouter.post("/", async (c) => {
  const searchGroups: SearchGroup[] = await c.req.json();

  const results: Course[] = [];

  for await (const searchGroup of searchGroups) {
    switch (searchGroup.type) {
      case "subject": {
        const courses = (await readJSON<Course[]>(
          `${DATA_DIR_PATH}/courses/${searchGroup.subjectCode}.json`
        )) as Course[];
        courses.forEach((course) => results.push(course));
        break;
      }
      case "subject-query": {
        const courses = (await readJSON<Course[]>(
          `${DATA_DIR_PATH}/courses/${searchGroup.subjectCode}.json`
        )) as Course[];
        courses.forEach((course) => {
          // TODO: fuzzy search
          if (
            course.title.toLowerCase().includes(searchGroup.query.trim()) ||
            course.description?.toLowerCase().includes(searchGroup.query.trim()) ||
            course.number?.toLowerCase().includes(searchGroup.query.trim())
          ) {
            results.push(course);
          }
        });
        break;
      }
      case "course": {
        const courses = await readJSON<Course[]>(
          `${DATA_DIR_PATH}/courses/${searchGroup.subjectCode}.json`
        );
        const filteredCourses = courses?.filter(
          (c) =>
            c.subject === searchGroup.subjectCode && c.number.startsWith(searchGroup.courseNumber)
        ) as Course[];
        if (!filteredCourses) return c.json({ message: "Invalid course number or course" }, 400);

        filteredCourses.forEach((course) => results.push(course));
        break;
      }
      case "number": {
        const courses = await readJSON<Course[]>(`${DATA_DIR_PATH}/all-courses.json`);
        const filteredCourses = courses?.filter((c) =>
          c.number.startsWith(searchGroup.courseNumber)
        ) as Course[];
        filteredCourses.forEach((course) => results.push(course));
        break;
      }
      case "crn": {
        const crn = searchGroup.crn.toString();
        const courses = await readJSON<Course[]>(`${DATA_DIR_PATH}/all-courses.json`);
        const filteredCourses = courses?.filter((course) => {
          const crns = course.sections?.map((section) => section.crn);
          return crns.includes(crn);
        }) as Course[];
        filteredCourses.forEach((course) => results.push(course));
        break;
      }
      case "query": {
        const courses = (await readJSON<Course[]>(
          `${DATA_DIR_PATH}/all-courses.json`
        )) as Course[];
        courses.forEach((course) => {
          // TODO: fuzzy search
          if (
            course.subject.toLowerCase().includes(searchGroup.query.trim()) ||
            course.title.toLowerCase().includes(searchGroup.query.trim()) ||
            course.description?.toLowerCase().includes(searchGroup.query.trim()) ||
            course.number?.toLowerCase().includes(searchGroup.query.trim())
          ) {
            results.push(course);
          }
        });
        break;
      }
      default: {
        throw new Error("unhandled");
      }
    }
  }

  return c.json(results);
});
