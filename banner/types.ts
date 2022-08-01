export const campuses = ["nu", "cps", "law"] as const;
export type Campus = typeof campuses[number];

export interface Term {
  code: string;
  description: string;
}

export interface Subject {
  code: string;
  description: string;
}

export interface Course {
  // No term for courses. Terms are only required for sections
  subject: string;
  number: string;
  scheduleType: string;
  title: string;
  credits: number;
  nuPath: NUPath[];

  description?: string;
  coreqs?: Requisite[];

  // This can change during the semester if a section is added
  sections: {
    term: string;
    crn: string; //description: string
  }[];
}
export type Requisite = Pick<Course, "subject" | "number">;

// List of prereqs that are required (AND)
export type PrereqAndGroup = Requisite[]

// A list of a list of requisites
// The inner list means both are required (AND)
// the outer list means either of the inner lists are required (OR)
export type PrereqOrGroups = PrereqAndGroup[]
// Example: [ [CS 1, CS 11], [DS 1, DS, 11] ]
// Either CS 1 and CS 11 are required, or DS 1 and DS 11 are required

// To be used in combine courses, only containing required data
export type MinimizedCourse = Pick<Course, "subject" | "number" | "title">;

export const nuPath = [
  "ND",
  "EI",
  "IC",
  "FQ",
  "SI",
  "AD",
  "DD",
  "ER",
  "WF",
  "WD",
  "WI",
  "EX",
  "CE",
] as const;
export type NUPath = typeof nuPath[number];
export const nuPathMap: Record<NUPath, string> = {
  ND: "Natural/Designed World",
  EI: "Creative Express/Innov",
  IC: "Interpreting Culture",
  FQ: "Formal/Quant Reasoning",
  SI: "Societies/Institutions",
  AD: "Analyzing/Using Data",
  DD: "Difference/Diversity",
  ER: "Ethical Reasoning",
  WF: "1st Yr Writing",
  WD: "Adv Writ Dscpl ",
  WI: "Writing Intensive",
  EX: "Integration Experience",
  CE: "Capstone Experience",
};

export interface SectionInfo {
  term: string;
  crn: string;
}
