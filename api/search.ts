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
    console.log(searchGroup.type);

    switch (searchGroup.type) {
      case "subject": {
        const courses = await readJSON<Course[]>(`${DATA_DIR_PATH}/courses/${searchGroup.subjectCode}.json`);
        courses.forEach((course) => results.push(course));
        break;
      }
      case "course": {
        const courses = await readJSON<Course[]>(`${DATA_DIR_PATH}/courses/${searchGroup.subjectCode}.json`);
        const course = courses?.find(
          (c) => c.subject === searchGroup.subjectCode && c.number === searchGroup.courseNumber
        );
        if (!course) return c.json({ message: "Invalid course number or course" }, 400);

        results.push(course);
        break;
      }
      case "crn": {
        const crn = searchGroup.crn.toString();
        const courses = await readJSON<Course[]>(`${DATA_DIR_PATH}/all-courses.json`);
        const course = courses?.find((course) => {
          console.log(course);
          const crns = course.sections?.map((section) => section.crn);
          
          return crns.includes(crn);
        });
        results.push(course);
        break;
      }
      default: {
        throw new Error("unhandled");
      }
    }
  }

  return c.json(results);
});
