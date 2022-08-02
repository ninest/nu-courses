import { Course } from "@/types.ts";

export const searchPost = async (cookie: string, termCode: string) => {
  const form = new FormData();
  form.append("term", termCode);
  form.append("studyPath", "");
  form.append("studyPathText", "");
  form.append("startDatepicker", "");
  form.append("endDatepicker", "");

  // Search continue (required): send the cookies to this API first, then we can search for courses
  await fetch(
    "https://nubanner.neu.edu/StudentRegistrationSsb/ssb/term/search?" +
      new URLSearchParams({ mode: "search" }),
    {
      method: "POST",
      body: form,
      credentials: "include",
      headers: { cookie },
    },
  );
};

interface SearchSectionsParams {
  termCode: string;
  subjectCode: string;
  courseNumber: string;
  cookie: string;
}

// searchPost must be run before running this
export const searchSections = async ({
  termCode,
  subjectCode,
  courseNumber,
  cookie,
}: SearchSectionsParams): Promise<any[]> => {
  // Search for courses
  const searchResponse = await fetch(
    "https://nubanner.neu.edu/StudentRegistrationSsb/ssb/searchResults/searchResults?" +
      new URLSearchParams({
        txt_subject: subjectCode.toUpperCase(),
        txt_courseNumber: courseNumber ?? "",
        txt_term: termCode,
        startDatepicker: "",
        endDatepicker: "",
        pageOffset: "0",
        pageMaxSize: "1000",
        sortColumn: "subjectDescription",
        sortDirection: "asc",
      }),
    {
      credentials: "include",
      headers: { cookie },
    },
  );

  const { data } = await searchResponse.json();
  console.log(data);

  return data;
};

export const getCoursesForTerm = async (
  cookie: string,
  termCode: string,
  subjectCode: string,
): Promise<Course[]> => {
  // Search for courses
  const url =
    "https://nubanner.neu.edu/StudentRegistrationSsb/ssb/searchResults/searchResults?" +
    new URLSearchParams({
      txt_subject: subjectCode.toUpperCase(),
      txt_courseNumber: "", //courseNumber ?? "",
      txt_term: termCode,
      startDatepicker: "",
      endDatepicker: "",
      pageOffset: "0",
      pageMaxSize: "1000",
      sortColumn: "subjectDescription",
      sortDirection: "asc",
    });
  const searchResponse = await fetch(url, {
    credentials: "include",
    headers: { cookie },
  });

  const { data } = await searchResponse.json();

  return data;
};
