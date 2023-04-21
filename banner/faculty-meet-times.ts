import { SectionInfo } from "@/types.ts";

export const getFacultyMeetTimes = async (section: SectionInfo) => {
  const response = await fetch(
    "https://nubanner.neu.edu/StudentRegistrationSsb/ssb/searchResults/getFacultyMeetingTimes?" +
      new URLSearchParams({
        term: section.term,
        courseReferenceNumber: section.crn,
      })
  );
  const json = await response.json();
  return json.fmt;
};
