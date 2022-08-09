import { daysOfWeek, FacultyMeetingTime, MeetingTime, Professor } from "../types.ts";

export const transformFacultyMeetTime = (json: any): FacultyMeetingTime => {
  const faculty: Professor[] = [];
  for (const professor of json.faculty) {
    faculty.push({ name: professor.displayName });
  }

  const online =
    !json.meetingTime.building &&
    !json.meetingTime.buildingDescription &&
    !json.meetingTime.campus &&
    !json.meetingTime.campusDescription;

  const meetingTime: MeetingTime = {
    building: {
      code: json.meetingTime.building,
      description: json.meetingTime.buildingDescription,
      room: json.meetingTime.room,
    },
    campus: {
      code: json.meetingTime.campus,
      description: json.meetingTime.campusDescription,
    },
    startTime: json.meetingTime.beginTime,
    endTime: json.meetingTime.endTime,
    online,
    days: [],
  };
  for (const dayOfWeek of daysOfWeek) {
    if (json.meetingTime[dayOfWeek]) {
      meetingTime.days.push(dayOfWeek);
    }
  }

  return {
    faculty,
    meetingTime,
  };
};
