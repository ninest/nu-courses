import { Requisite, Subject } from "@/banner/types.ts";
import { FOLDER_PATH } from "@/fetcher/constants.ts";
import { readJSON } from "@/util/file.ts";
import { DOMParser } from "deno-dom";

// Transform HTML to list of coreqs
export const transformCoreqs = (html: string): Requisite[] => {
  const coreqs: Requisite[] = [];

  const $table = new DOMParser().parseFromString(html, "text/html");
  const $tableBody = $table?.querySelector("tbody");

  // No table means there are no coreqs
  if (!$tableBody) return [];

  const $rows = $tableBody?.querySelectorAll("tr");
  for (const $row of $rows!) {
    const colsList = Array.from($row.childNodes);
    // TODO: colsList seems to the information, but mixed with empty data, probably because of the spacing?
    const attributes = colsList //
      // TODO: fix type
      .map(($el: any) => $el.innerText)
      .filter(Boolean);

    let subjectDescription, courseNumber, _; // `_` is the variable for the unused value
    if (attributes.length === 3) {
      [subjectDescription, courseNumber, _] = attributes;
    } else {
      // The structure of the table returned is not always consistent
      // https://jennydaman.gitlab.io/nubanned/dark.html#searchresults-corequisites
      [_, subjectDescription, courseNumber] = attributes;
    }
    coreqs.push({
      subject: subjectDescriptionFromCode(subjectDescription),
      number: courseNumber,
    });
  }

  return coreqs;
};

const subjects = await readJSON<Subject[]>(`${FOLDER_PATH}/subjects.json`);
const subjectDescriptionFromCode = (description: string): string => {
  return subjects?.find((subject) => subject.description === description)
    ?.code!;
};
