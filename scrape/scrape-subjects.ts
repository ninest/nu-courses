/* Scrape the "NU" courses only (non-CPS, non-LAW) */

import { getAllSubjects } from "../banner/subject.ts";
import { writeJSON } from "../util/file.ts";
import { FOLDER_PATH, TERMS } from "./constants.ts";

const subjects = await getAllSubjects(TERMS);
writeJSON(`${FOLDER_PATH}/subjects.json`, subjects);
console.log("Fetched subjects");
