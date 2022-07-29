import { SectionInfo } from "./types.ts";

export const getCourseDescription = async (
  sectionInfo: SectionInfo
): Promise<string> => {
  const formData = new FormData();
  formData.append("term", sectionInfo.term);
  formData.append("courseReferenceNumber", sectionInfo.crn);

  const descriptionResponse = await fetch(
    "https://nubanner.neu.edu/StudentRegistrationSsb/ssb/searchResults/getCourseDescription",
    { body: formData, method: "POST" }
  );
  const text = await descriptionResponse.text();
  return text.trim();
};
