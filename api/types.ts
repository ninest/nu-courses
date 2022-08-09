import { FacultyMeetingTime, Seats, SectionInfo } from "../types.ts";

export interface SectionsResponse extends SectionInfo {
  facultyMeetTime: FacultyMeetingTime;
  seats: Seats;
}
