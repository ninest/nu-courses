import { getAllSubjects } from "@/banner/subject.ts";
import { DATA_DIR_PATH, TERMS } from "@/fetcher/constants.ts";
import { writeJSON } from "@/util/file.ts";

const subjects = await getAllSubjects(TERMS);
writeJSON(`${DATA_DIR_PATH}/subjects.json`, subjects);
console.log("Fetched subjects");
