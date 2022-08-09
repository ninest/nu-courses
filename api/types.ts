import { FacultyMeetingTime, Seats, SectionInfo } from "../types.ts";

export interface SectionsResponse extends SectionInfo, FacultyMeetingTime {
  seats: Seats;
}
