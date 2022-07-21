# NU Course API

> Functions to get NU course information

This project is meant to get course data for [ninest/husker](https://github.com/ninest/husker).

## Build Setup

First, [install Deno](https://deno.land/manual/getting_started/installation). Clone or fork the repository, then do the following.

### 1. Terms

Then open `scrape/constants.ts`, and enter the output folder (`FOLDER_PATH`) terms you want to fetch (`TERMS`).

For example, if you want to fetch courses from only Fall 2022, into the folder `./data/nu`, The file should look like this:

```ts
export const FOLDER_PATH = "./.data/nu";

export const TERMS = [
  {
    code: "202310",
  },
];
```

The `description` key in each term is optional, so `[{ code: "202310" }]` should also work. 

You can find a list of available terms through NUBanner's API: [nubanner.neu.edu/StudentRegistrationSsb/ssb/classSearch/getTerms?searchTerm=&offset=1&max=20](https://nubanner.neu.edu/StudentRegistrationSsb/ssb/classSearch/getTerms?searchTerm=&offset=1&max=20).

Note that the output folder (`.data/nu` in this example) should contain a folder `courses`.

### 2. Subjects

To fetch all subjects, run 

```bash
deno -A run ./scrape/scrape-subjects.ts
```

This should create a file called `subjects.json` in the output folder path with a list of subjects containing a `code` and `description`:

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
deno -A run ./scrape/scrape-courses.ts
```

This will take a **long** time, so follow the progress through the logs. 

This will create a file for each subject in the `courses` folder in the output path. For example, there will be `courses/CS.json` containing a list of courses.

### 4. Description

To fetch all descriptions for courses, run

```bash
deno -A run ./scrape/scrape-descriptions.ts
```