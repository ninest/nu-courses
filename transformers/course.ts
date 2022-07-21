import { Course, NUPath, nuPathMap } from "../banner/types.ts";

// Transform API response course
export const transformCourse = (course: any): Course => {
  const nuPath: NUPath[] = [];

  course.sectionAttributes.forEach((attribute: any) => {
    const description: string = attribute.description;
    if (description.includes("NUpath")) {
      const nuPathDescription = description.split("NUpath ")[1];

      const nuPathKey = Object.keys(nuPathMap).find(
        (key) => nuPathMap[key as NUPath] === nuPathDescription
      ) as NUPath;

      if (nuPathKey) nuPath.push(nuPathKey);
    }
  });

  return {
    referenceNumber: course.courseReferenceNumber,
    subject: course.subject,
    number: course.courseNumber,
    title: course.courseTitle,
    scheduleType: course.scheduleTypeDescription,
    credits: course.creditHourLow,
    nuPath,

    _termCode: course.term,
  };
};
