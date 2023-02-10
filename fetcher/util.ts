import { COURSES_WITH_ALT_SECTIONS } from "@/constants/courses.ts";

export const mayContainDifferentDescriptions = (course: { code: string; number: string }) => {
  return COURSES_WITH_ALT_SECTIONS.some((c) => c.code == course.code && c.number == course.number);
};
