export const campuses = ["nu", "cps", "law"] as const;
export type Campus = (typeof campuses)[number];

export interface Term {
  code: string;
  description: string;
}

export interface Subject {
  code: string;
  description?: string;
}
export interface SubjectWithCourseCount extends Subject {
  numCourses: number;
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
  prereqs?: PrerequisiteItem[];

  // This can change during the semester if a section is added
  sections: {
    term: string;
    crn: string; //description: string
  }[];
}
export type Requisite = Pick<Course, "subject" | "number">;
export type PrerequisiteItem = "Or" | "And" | "(" | ")" | Requisite | string;

// To be used in combine courses, only containing required data
export type MinimizedCourse = Pick<Course, "subject" | "number">;

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
export type NUPath = (typeof nuPath)[number];
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

// Contains professor and meeting times for a particular section
export interface FacultyMeetingTime extends MeetingTime {
  faculty: Professor[];
}

export interface Professor {
  name: string;
}

export const daysOfWeek = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
] as const;
export type DayOfWeek = (typeof daysOfWeek)[number];

export interface MeetingTime {
  startTime: string;
  endTime: string;
  campus: {
    code: string;
    description: string;
  };
  building: {
    code: string;
    description: string;
    room: string;
  };
  online: boolean;
  days: DayOfWeek[];
}

export interface Seats {
  total: number;
  available: number;
  waitlist: {
    capacity: number;
    available: number;
  };
}

export interface Section extends SectionInfo {
  meetingTimes: FacultyMeetingTime[];
  seats: Seats;
}

// Mapping types
export interface TermSubjectCourseMapping {
  [subjectCode: string]: { number: string; crns: string[] }[];
}

// Search
type SubjectGroup = { type: "subject"; subjectCode: string };
type SubjectQueryGroup = { type: "subject-query"; subjectCode: string; query: string };
type CourseGroup = { type: "course"; subjectCode: string; courseNumber: string };
type NumberGroup = { type: "number"; courseNumber: string };
type CRNGroup = { type: "crn"; crn: string };
type QueryGroup = { type: "query"; query: string };
export type SearchGroup =
  | SubjectGroup
  | SubjectQueryGroup
  | CourseGroup
  | NumberGroup
  | CRNGroup
  | QueryGroup;
