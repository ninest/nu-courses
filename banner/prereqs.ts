import { SectionInfo } from "./types.ts";

export const getCoursePrereqs = async (sectionInfo: SectionInfo) => {
  const formData = new FormData();
  formData.append("term", sectionInfo.term);
  formData.append("courseReferenceNumber", sectionInfo.crn);

  const prereqResponse = await fetch(
    "https://nubanner.neu.edu/StudentRegistrationSsb/ssb/searchResults/getSectionPrerequisites",
    { body: formData, method: "POST" },
  );
  const html = await prereqResponse.text();
  return html.trim();
};
