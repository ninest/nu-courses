import { getFacultyMeetTimes } from "@/banner/faculty-meet-times.ts";
import { getCourseSeats } from "@/banner/seats.ts";
import { transformFacultyMeetTime } from "@/transformers/faculty-meet-times.ts";
import { transformSeats } from "@/transformers/seats.ts";
import { Hono } from "hono";
import { DATA_DIR_PATH } from "../constants/paths.ts";
import { Section, SectionInfo, TermSubjectCourseMapping } from "../types.ts";
import { readJSON } from "../util/file.ts";

export const sectionsRouter = new Hono();

// Sections of a single CRN
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

// Sections of all CRNs in a course
sectionsRouter.get("/:term/:subjectCode/:courseNumber", async (c) => {
  const term = c.req.param("term");
  const subjectCode = c.req.param("subjectCode");
  const courseNumber = c.req.param("courseNumber");

  // Find all CRNs for course in term
  const termCourseMapping = await readJSON<TermSubjectCourseMapping>(
    `${DATA_DIR_PATH}/mappings/term-courses/${term}.json`
  );
  if (!termCourseMapping)
    return c.json({ message: "Invalid term or data for this term is unavailable" }, 400);

  const course = termCourseMapping[subjectCode].find((m) => m.number === courseNumber);
  if (!course) return c.json({ message: "Course doesn't exist in term" });

  const crns = course.crns;
  const sections: (Section | null)[] = [];

  const promises = crns.map(async (crn) => {
    const section: SectionInfo = { term, crn };
    try {
      const sectionResponse = await getSectionDataWithRetries(section, 3);
      return sectionResponse;
    } catch (error) {
      return null;
    }
  });

  const results = await Promise.all(promises);
  results.forEach((result) => sections.push(result));

  return c.json(sections);
});

// Get multiple sections
sectionsRouter.get("/:term", async (c) => {
  const term = c.req.param("term");
  const crns = c.req.queries("crn");

  if (!crns) return c.json({ message: "No CRNs provided" }, 400);

  const sections: (Section | null)[] = [];

  const promises = crns.map(async (crn) => {
    const section: SectionInfo = { term, crn };
    try {
      const sectionResponse = await getSectionDataWithRetries(section, 3);
      return sectionResponse;
    } catch (error) {
      return null;
    }
  });

  const results = await Promise.all(promises);
  results.forEach((result) => sections.push(result));

  return c.json(sections);
});

const getSectionData = async (section: SectionInfo): Promise<Section> => {
  const [facultyMeetTimesJson, seatsHtml] = await Promise.all([
    getFacultyMeetTimes(section),
    getCourseSeats(section),
  ]);
  const facultyMeetTime = facultyMeetTimesJson.map(transformFacultyMeetTime)[0];
  const seats = transformSeats(seatsHtml);
  return { ...section, ...facultyMeetTime, seats };
};

const getSectionDataWithRetries = async (
  section: SectionInfo,
  retries: number
): Promise<Section> => {
  let timesFetched = 0;
  while (true) {
    try {
      const sectionData = await getSectionData(section);
      return sectionData;
    } catch (error) {
      timesFetched += 1;
      if (timesFetched >= retries) throw Error("Unable to find section information");
    }
  }
};
