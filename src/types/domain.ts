export type UserRole = "mentor" | "mentee" | "admin";

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  avatarUrl?: string;
  bio?: string;
  organization?: string;
}

export type AttendanceStatus = "expected" | "checked-in" | "absent" | "late";

export interface AttendanceRecord {
  id: string;
  sessionId: string;
  menteeId: string;
  status: AttendanceStatus;
  updatedAt: string; // ISO string
  note?: string;
}

export type QuestionStatus = "pending" | "in-progress" | "answered";

export interface Answer {
  id: string;
  questionId: string;
  authorId: string;
  content: string;
  createdAt: string;
}

export interface Question {
  id: string;
  sessionId: string;
  authorId: string;
  content: string;
  createdAt: string;
  status: QuestionStatus;
  votes: number;
  answer?: Answer;
}

export interface ResourceLink {
  label: string;
  url: string;
}

export interface SessionAgendaItem {
  time: string;
  topic: string;
  goal?: string;
}

export interface Session {
  id: string;
  title: string;
  mentorId: string;
  startAt: string;
  endAt: string;
  location: string;
  description: string;
  focusTags: string[];
  attendeeIds: string[];
  agenda: SessionAgendaItem[];
  resources: ResourceLink[];
  questions: Question[];
  attendance: AttendanceRecord[];
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  authorId: string;
  audience: "mentors" | "mentees" | "all";
  actionUrl?: string;
}
