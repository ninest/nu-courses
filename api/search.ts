import { DATA_DIR_PATH } from "@/constants/paths.ts";
import { readJSON } from "@/util/file.ts";
import { Hono } from "hono";
import { SearchGroup, Subject, Course } from "@/types.ts";

export const searchRouter = new Hono();

searchRouter.get("/", async (c) => {
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
      default: {
        throw new Error("unhandled");
      }
    }
  }

  return c.json(results);
});
