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
  referenceNumber: string; // Required to get coreqs and prereqs
  subject: string;
  number: string;
  scheduleType: string;
  title: string;
  credits: number;
  nuPath: NUPath[];
  description?: string;

  _termCode: string; // Used for fetching description
}

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
