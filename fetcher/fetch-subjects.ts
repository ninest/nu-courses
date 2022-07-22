import { getAllSubjects } from "/banner/subject.ts";
import { FOLDER_PATH, TERMS } from "/fetcher/constants.ts";
import { writeJSON } from "/util/file.ts";

const subjects = await getAllSubjects(TERMS);
writeJSON(`${FOLDER_PATH}/subjects.json`, subjects);
console.log("Fetched subjects");
