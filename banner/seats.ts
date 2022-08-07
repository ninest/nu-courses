import { SectionInfo } from "@/types.ts";

export const getCourseSeats = async (sectionInfo: SectionInfo): Promise<string> => {
  const formData = new FormData();
  formData.append("term", sectionInfo.term);
  formData.append("courseReferenceNumber", sectionInfo.crn);

  const seatsResponse = await fetch(
    "https://nubanner.neu.edu/StudentRegistrationSsb/ssb/searchResults/getEnrollmentInfo",
    { body: formData, method: "POST" }
  );
  const html = await seatsResponse.text();
  return html.trim();
};
