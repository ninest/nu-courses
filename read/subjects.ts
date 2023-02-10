import { DATA_DIR_PATH } from "@/fetcher/constants.ts";
import { Subject } from "@/types.ts";
import { readJSON } from "@/util/file.ts";

const subjects = await readJSON<Subject[]>(`${DATA_DIR_PATH}/subjects.json`);

export const subjectDescriptionFromCode = (description: string): string => {
  return subjects?.find((subject) => subject.description === description)
    ?.code!;
};

export const subjectNames = subjects?.map((subject) => subject.description);
