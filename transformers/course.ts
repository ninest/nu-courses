import { Course, NUPath, nuPathMap } from "@/types.ts";

// Transform API response course
export const transformCourse = (course: any): Course => {
  const nuPath: NUPath[] = [];

  course.sectionAttributes.forEach((attribute: any) => {
    // Handle nupath
    const description: string = attribute.description;
    if (description.includes("NUpath")) {
      const nuPathDescription = description.split("NUpath ")[1];

      const nuPathKey = Object.keys(nuPathMap).find(
        (key) => nuPathMap[key as NUPath] === nuPathDescription,
      ) as NUPath;

      if (nuPathKey) nuPath.push(nuPathKey);
    }
  });

  return {
    subject: course.subject,
    number: course.courseNumber,
    title: course.courseTitle,
    scheduleType: course.scheduleTypeDescription,
    credits: course.creditHourLow,
    nuPath,

    sections: [
      {
        term: course.term,
        crn: course.courseReferenceNumber,
      },
    ],
  };
};
