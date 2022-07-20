import { Subject, Term } from "./types.ts";

// Requires terms to be passed in
export const getAllSubjects = async (terms: Term[]): Promise<Subject[]> => {
  const subjects: Subject[] = [];
  for await (const term of terms) {
    const subjectsToAdd = await getSubjects(term.code);
    subjectsToAdd.forEach((subject) => {
      if (!subjects.some((s) => s.code === subject.code)) {
        subjects.push(subject);
      }
    });
  }

  return subjects;
};

// Get all subjects for the provided term
export const getSubjects = async (term: string): Promise<Subject[]> => {
  // TODO: use URLSearchParams
  const response = await fetch(
    `https://nubanner.neu.edu/StudentRegistrationSsb/ssb/classSearch/get_subject?searchTerm=&term=${term}&offset=1&max=400` // 400 to get all
  );
  const terms = await response.json();
  return terms;
};
