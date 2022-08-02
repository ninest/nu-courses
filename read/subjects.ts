import { readJSON } from "@/util/file.ts";
import { Subject } from "@/banner/types.ts";
import {FOLDER_PATH} from '@/fetcher/constants.ts'

const subjects = await readJSON<Subject[]>(`${FOLDER_PATH}/subjects.json`);

export const subjectDescriptionFromCode = (description: string): string => {
  return subjects?.find((subject) => subject.description === description)
    ?.code!;
};

export const subjectNames = subjects?.map((subject) => subject.description);
