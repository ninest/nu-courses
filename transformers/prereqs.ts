import { MinimizedCourse, PrereqAndGroup, PrereqOrGroups, Requisite, Subject } from "@/banner/types.ts";
import { FOLDER_PATH } from "@/fetcher/constants.ts";
import { readJSON } from "@/util/file.ts";
import { DOMParser, Element } from "deno-dom";

// Transform HTML to list of prereqs groups
export const transformPrereqs = (html: string): PrereqOrGroups => {
  const $table = new DOMParser().parseFromString(html, 'text/html')
  const $tableBody = $table?.querySelector("tbody")

  // No table means there are prereqs
  if (!$tableBody) return []

  const prereqOrGroups: PrereqOrGroups = []

  const $rows = $tableBody.querySelectorAll("tr")
  for (let i = 0; i < $rows.length; i++) {
    const $row = $rows[i]

    const colsList = Array.from($row.childNodes);

    const attributes = colsList.map(($el: any) => $el.innerText)

    // "And" / "Or"
    const currentConnector = attributes[1]
    // const previousConnector = i >= 1 ? Array.from($rows[i - 1].childNodes).innerText : null
    Array.from($rows[i-1].childNodes)
    const previousConnector = "Or"
    console.log({ previousConnector });


    if (subjectNames?.includes(attributes[9])) {
      const subject = subjectDescriptionFromCode(attributes[9])
      const number = attributes[11]
      const course: Requisite = { subject, number }
      console.log(course);

      if (i === 0) {
        // The first item in the list can be added to the first group directly
        const prereqAndGroup: PrereqAndGroup = [{ subject, number }]
        prereqOrGroups.push(prereqAndGroup)
      } else {
        // Check the previous connector
        if (previousConnector === "And") {
          // Add to the `and group` of the last element
          prereqOrGroups.at(-1)?.push(course)
        } else if (previousConnector === "Or") {
          // Add a new `or group`
          prereqOrGroups.push([course])
        }
      }
    }
  }

  return prereqOrGroups
}

const subjects = await readJSON<Subject[]>(`${FOLDER_PATH}/subjects.json`);
const subjectNames = subjects?.map(subject => subject.description)
const subjectDescriptionFromCode = (description: string): string => {
  return subjects?.find((subject) => subject.description === description)
    ?.code!;
};
