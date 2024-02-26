import { subjectDescriptionFromCode } from "@/read/subjects.ts";
import { PrerequisiteItem } from "@/types.ts";
import { DOMParser } from "deno-dom";
import { minifyHTML } from "https://deno.land/x/minifier@v1.1.1/mod.ts";

// Transform HTML to list of prereqs groups
export const transformPrereqs = (html: string): PrerequisiteItem[] => {
  const $table = new DOMParser().parseFromString(minifyHTML(html), "text/html");
  const $tableBody = $table?.querySelector("tbody");

  // No table means there are prereqs
  if (!$tableBody) return [];

  const prereqs: PrerequisiteItem[] = [];

  let $rows = Array.from($tableBody.querySelectorAll("tr"));
  for (let i = 0; i < $rows.length; i++) {
    const $row = $rows[i];
    const colsList = Array.from($row.childNodes);
    const attributes = colsList.map(($el: any) => $el.innerText);

    const currentConnector = (attributes[0] ?? "").trim();
    const openBracket = (attributes[1] ?? "").trim();
    const test = (attributes[2] ?? "").trim();
    const subjectDescription = (attributes[4] ?? "").trim();
    const subject = subjectDescriptionFromCode(subjectDescription);
    const number = (attributes[5] ?? "").trim();
    const closeBracket = (attributes[8] ?? "").trim();

    if (currentConnector) prereqs.push(currentConnector);
    if (openBracket) prereqs.push(openBracket);
    if (test) prereqs.push(test);
    if (subject) prereqs.push({ subject, number });
    if (closeBracket) prereqs.push(closeBracket);
  }

  return prereqs;
};

// export const transformPrereqs = (html: string): PrereqOrGroups => {
//   const $table = new DOMParser().parseFromString(html, "text/html");
//   const $tableBody = $table?.querySelector("tbody");

//   // No table means there are prereqs
//   if (!$tableBody) return [];

//   const prereqOrGroups: PrereqOrGroups = [];
//   let previousConnector = null;

//   let $rows = Array.from($tableBody.querySelectorAll("tr"));

//   if (!$rows[0].childNodes[9].innerText) $rows = $rows.slice(1, $rows.length);

//   for (let i = 0; i < $rows.length; i++) {
//     const $row = $rows[i];
//     const colsList = Array.from($row.childNodes);
//     const attributes = colsList.map(($el: any) => $el.innerText);

//     // "And" / "Or"
//     const currentConnector = attributes[1];

//     if (subjectNames?.includes(attributes[9])) {
//       const subject = subjectDescriptionFromCode(attributes[9]);
//       const number = attributes[11];
//       const course: Requisite = { subject, number };
//       console.log(course);

//       if (i === 0) {
//         // The first item in the list can be added to the first group directly
//         const prereqAndGroup: PrereqAndGroup = [{ subject, number }];
//         prereqOrGroups.push(prereqAndGroup);
//         console.log("Initial");
//       } else {
//         // Check connector
//         if (currentConnector === "And") {
//           // Add to the `and group` of the last element
//           prereqOrGroups.at(-1)?.push(course);
//         } else if (currentConnector === "Or") {
//           // Add a new `or group`
//           prereqOrGroups.push([course]);
//         }
//       }
//     }

//     previousConnector = currentConnector;
//     console.log("\n\n");
//   }

//   return prereqOrGroups;
// };
