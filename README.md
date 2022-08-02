# NU Course

> Functions to get NU course information

This project is meant to get course data for
[ninest/husker](https://github.com/ninest/husker).

## Folders

- `banner/`
  - Contains all Banner-specific code for fetching terms, subjects, and courses
  - Only contains functions that call the API and return data as is (`getAllSubjects`, `searchSections`, `getCourseCoreqs`)
- `fetcher/`
  - Contains functions to call Banner functions and write responses to JSON files
  - Use transformer functions to map API responses to required data types
  - Think of `constants.ts` as the entry point for the fetchers
- `transformers/`
  - Contains functions to map Banner API responses to required types
- `read/`
  - Contains utility functions to read data already fetched (data that's been fetched and is saved in one of the JSON files) 
- `util/`
  - Dump of (complex) utility functions used in one or more locations
- `.data/`
  - All output course data

## Build Setup

First, [install Deno](https://deno.land/manual/getting_started/installation).
Clone or fork the repository, then do the following.

### 1. Terms

Then open `scrape/constants.ts`, and enter the terms you want to fetch
(`TERMS`).

For example, if you want to fetch courses from only Fall 2022, the file should
look like this:

```ts
export const TERMS = [
  {
    code: "202310",
  },
];
```

By default, the output folder is the `.data` folder.

The `description` key in each term is optional, so `[{ code: "202310" }]` should
also work.

You can find a list of available terms through NUBanner's API:
[nubanner.neu.edu/StudentRegistrationSsb/ssb/classSearch/getTerms?searchTerm=&offset=1&max=20](https://nubanner.neu.edu/StudentRegistrationSsb/ssb/classSearch/getTerms?searchTerm=&offset=1&max=20).

Note that the output folder (`.data/nu` in this example) should contain a folder
`courses`.

### 2. Subjects

To fetch all subjects, run

```bash
deno task fetch:subjects
```

This should create a file called `subjects.json` in the output folder path with
a list of subjects containing a `code` and `description`:

```ts
[
  {
    "code": "ACCT",
    "description": "Accounting"
  },
  {
    "code": "AFAM",
    "description": "African American Studies"
  },
  ...
]
```

### 3. Courses

To fetch all courses under each subject, run

```bash
deno task fetch:courses
```

This will take a **long** time, so follow the progress through the logs.

This will create a file for each subject in the `courses` folder in the output
path. For example, there will be `courses/CS.json` containing a list of courses.

Note that in fetching the courses, the data of the courses already fetched will
be merged in with the "new" data from Banner's API. If the descriptions or
requisites have already been fetched and `deno task fetch:courses` is run,
`deno task fetch:descriptions` does not have to be run again.

### 4. Description

To fetch all descriptions for courses, run

```bash
deno task fetch:descriptions
```

This will check if a description exists for each course and fetch a description
if not present.

In `fetcher/constants.ts`, populate the following with courses that may have
different descriptions across sections. For example:

```ts
export const COURSES_WITH_ALT_SECTIONS = [
  { code: "CS", number: "2500" },
  { code: "CS", number: "2510" },
];
```

In this case, the descriptions of the first three sections are fetched, and the
most common on is set as the main description. In the example for Fundies
Accelerated, the accelerated section's description is not very useful, so the
only the descriptions of the regular sections are saved.

See [#1](https://github.com/ninest/nu-courses/issues/1) for more information.

### 5. Requisites

Pre- and co-requisites are lists of the following:

```tsx
type Requisite = Pick<Course, "subject" | "number">;
// A list of prereqs or coreqs is of type Requisite[]
```

#### a. Co-requisites

Run

```bash
deno task fetch:coreqs
```

If a course already has the `coreq` key and a list (which can be empty), it will
skip that course as it means that the co-requisites for that course have already
been fetched.

#### b. Pre-requisites

_Not ready yet_

## Support

If you have any suggestions, please open an issue or pull request with your
changes.

## License

MIT
