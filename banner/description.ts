export const getCourseDescription = async (
  termCode: string,
  courseReferenceNumber: string
): Promise<string> => {
  const formData = new FormData();
  formData.append("term", termCode);
  formData.append("courseReferenceNumber", courseReferenceNumber);

  const descriptionResponse = await fetch(
    "https://nubanner.neu.edu/StudentRegistrationSsb/ssb/searchResults/getCourseDescription",
    { body: formData, method: "POST" }
  );
  const text = await descriptionResponse.text();
  return text.trim();
};
