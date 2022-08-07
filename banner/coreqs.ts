import { SectionInfo } from "@/types.ts";

export const getCourseCoreqs = async (
  sectionInfo: SectionInfo,
): Promise<string> => {
  const formData = new FormData();
  formData.append("term", sectionInfo.term);
  formData.append("courseReferenceNumber", sectionInfo.crn);

  const coreqResponse = await fetch(
    "https://nubanner.neu.edu/StudentRegistrationSsb/ssb/searchResults/getCorequisites",
    { body: formData, method: "POST" },
  );
  const html = await coreqResponse.text();
  return html.trim();
};
