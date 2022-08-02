import { PrereqAndGroup, PrereqOrGroups, Requisite } from "@/types.ts";
import { subjectDescriptionFromCode, subjectNames } from "@/read/subjects.ts";
import { DOMParser } from "deno-dom";

// Transform HTML to list of prereqs groups
export const transformPrereqs = (html: string): PrereqOrGroups => {
  const $table = new DOMParser().parseFromString(html, "text/html");
  const $tableBody = $table?.querySelector("tbody");

  // No table means there are prereqs
  if (!$tableBody) return [];

  const prereqOrGroups: PrereqOrGroups = [];
  let previousConnector = null;

  const $rows = $tableBody.querySelectorAll("tr");
  for (let i = 0; i < $rows.length; i++) {
    const $row = $rows[i];

    const colsList = Array.from($row.childNodes);

    const attributes = colsList.map(($el: any) => $el.innerText);

    // "And" / "Or"
    const currentConnector = attributes[1];

    if (subjectNames?.includes(attributes[9])) {
      const subject = subjectDescriptionFromCode(attributes[9]);
      const number = attributes[11];
      const course: Requisite = { subject, number };
      console.log(course);

      if (i === 0) {
        // The first item in the list can be added to the first group directly
        const prereqAndGroup: PrereqAndGroup = [{ subject, number }];
        prereqOrGroups.push(prereqAndGroup);
        console.log("Initial");
      } else {
        // Check connector
        if (currentConnector === "And") {
          // Add to the `and group` of the last element
          prereqOrGroups.at(-1)?.push(course);
        } else if (currentConnector === "Or") {
          // Add a new `or group`
          prereqOrGroups.push([course]);
        }
      }
    }

    previousConnector = currentConnector;
  }

  return prereqOrGroups;
};
