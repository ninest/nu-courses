import { Router } from "oak";
import { getFacultyMeetTimes } from "@/banner/faculty-meet-times.ts";
import { getCourseSeats } from "@/banner/seats.ts";
import { transformFacultyMeetTime } from "@/transformers/faculty-meet-times.ts";
import { transformSeats } from "@/transformers/seats.ts";
import { FacultyMeetingTime, Seats, SectionInfo } from "@/types.ts";

export const sectionsRouter = new Router();

sectionsRouter.get("/:term/:crn", async (context) => {
  const section = context.params as SectionInfo;
  let retries = 0;
  while (true) {
    try {
      const sectionData = await getSectionData(section);
      context.response.body = sectionData;
      break;
    } catch (error) {
      retries += 1;
      if (retries >= 3) {
        context.response.status = 400;
        context.response.body = { message: "Unable to find section information" };
        return;
      }
    }
  }
});

const getSectionData = async (
  section: SectionInfo
): Promise<{ facultyMeetTime: FacultyMeetingTime; seats: Seats }> => {
  const [facultyMeetTimesJson, seatsHtml] = await Promise.all([
    getFacultyMeetTimes(section),
    getCourseSeats(section),
  ]);
  const facultyMeetTime = facultyMeetTimesJson.map(transformFacultyMeetTime)[0];
  const seats = transformSeats(seatsHtml);
  return { facultyMeetTime, seats };
};
