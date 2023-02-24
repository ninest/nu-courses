import { getFacultyMeetTimes } from "@/banner/faculty-meet-times.ts";
import { getCourseSeats } from "@/banner/seats.ts";
import { transformFacultyMeetTime } from "@/transformers/faculty-meet-times.ts";
import { transformSeats } from "@/transformers/seats.ts";
import { Hono } from "hono";
import { SectionInfo } from "../types.ts";
import { SectionsResponse } from "./types.ts";

export const sectionsRouter = new Hono();

sectionsRouter.get("/:term/:crn", async (c) => {
  const section: SectionInfo = {
    term: c.req.param("term"),
    crn: c.req.param("crn"),
  };

  let retries = 0;
  while (true) {
    try {
      const sectionData = await getSectionData(section);
      return c.json(sectionData);
    } catch (error) {
      retries += 1;
      if (retries >= 3) return c.json({ message: "Unable to find section information" }, 400);
    }
  }
});

const getSectionData = async (section: SectionInfo): Promise<SectionsResponse> => {
  const [facultyMeetTimesJson, seatsHtml] = await Promise.all([
    getFacultyMeetTimes(section),
    getCourseSeats(section),
  ]);
  const facultyMeetTime = facultyMeetTimesJson.map(transformFacultyMeetTime)[0];
  const seats = transformSeats(seatsHtml);
  return { ...section, ...facultyMeetTime, seats };
};
