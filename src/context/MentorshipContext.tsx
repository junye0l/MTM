"use client";

import { createContext, useContext, useMemo, useReducer, type Dispatch } from "react";
import type {
  Announcement,
  AttendanceRecord,
  Question,
  Session,
  UserProfile,
} from "@/types/domain";
import {
  announcements as initialAnnouncements,
  mentor as initialMentor,
  mentees as initialMentees,
  sessions as initialSessions,
} from "@/data/mockData";

export interface MentorshipState {
  mentor: UserProfile;
  mentees: UserProfile[];
  sessions: Session[];
  announcements: Announcement[];
}

type AttendancePayload = {
  sessionId: string;
  menteeId: string;
  status: AttendanceRecord["status"];
};

type QuestionStatusPayload = {
  sessionId: string;
  questionId: string;
  status: Question["status"];
};

type AnswerPayload = {
  sessionId: string;
  questionId: string;
  content: string;
};

type AddQuestionPayload = {
  sessionId: string;
  authorId: string;
  content: string;
};

type AddSessionPayload = Omit<
  Session,
  "id" | "questions" | "attendance" | "mentorId" | "attendeeIds" | "focusTags" | "agenda" | "resources"
> &
  Partial<Pick<Session, "focusTags" | "agenda" | "resources">>;


type AddAnnouncementPayload = Omit<Announcement, "id" | "createdAt" | "authorId"> & {
  authorId?: string;
};

type Action =
  | { type: "ADD_SESSION"; payload: AddSessionPayload }
  | { type: "UPDATE_ATTENDANCE_STATUS"; payload: AttendancePayload }
  | { type: "SET_QUESTION_STATUS"; payload: QuestionStatusPayload }
  | { type: "ADD_ANSWER"; payload: AnswerPayload }
  | { type: "ADD_QUESTION"; payload: AddQuestionPayload }
  | { type: "ADD_ANNOUNCEMENT"; payload: AddAnnouncementPayload };

const MentorshipContext = createContext<{
  state: MentorshipState;
  dispatch: Dispatch<Action>;
} | null>(null);

const initialState: MentorshipState = {
  mentor: initialMentor,
  mentees: initialMentees,
  sessions: initialSessions,
  announcements: initialAnnouncements,
};

const generateId = () => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2, 10);
};

const mentorshipReducer = (state: MentorshipState, action: Action): MentorshipState => {
  switch (action.type) {
    case "ADD_SESSION": {
      const sessionId = generateId();
      const agenda = action.payload.agenda ?? [];
      const resources = action.payload.resources ?? [];
      const focusTags = action.payload.focusTags ?? [];

      const attendance = state.mentees.map<AttendanceRecord>((mentee) => ({
        id: `${sessionId}-${mentee.id}`,
        sessionId,
        menteeId: mentee.id,
        status: "expected",
        updatedAt: new Date().toISOString(),
      }));

      const newSession: Session = {
        id: sessionId,
        mentorId: state.mentor.id,
        attendeeIds: state.mentees.map((mentee) => mentee.id),
        questions: [],
        attendance,
        agenda,
        resources,
        focusTags,
        ...action.payload,
      };

      return {
        ...state,
        sessions: [newSession, ...state.sessions],
      };
    }
    case "UPDATE_ATTENDANCE_STATUS": {
      const { sessionId, menteeId, status } = action.payload;
      return {
        ...state,
        sessions: state.sessions.map((session) => {
          if (session.id !== sessionId) return session;
          return {
            ...session,
            attendance: session.attendance.map((record) =>
              record.menteeId === menteeId
                ? { ...record, status, updatedAt: new Date().toISOString() }
                : record,
            ),
          };
        }),
      };
    }
    case "SET_QUESTION_STATUS": {
      const { sessionId, questionId, status } = action.payload;
      return {
        ...state,
        sessions: state.sessions.map((session) => {
          if (session.id !== sessionId) return session;
          return {
            ...session,
            questions: session.questions.map((question) =>
              question.id === questionId ? { ...question, status } : question,
            ),
          };
        }),
      };
    }
    case "ADD_ANSWER": {
      const { sessionId, questionId, content } = action.payload;
      const newAnswerId = generateId();
      const createdAt = new Date().toISOString();

      return {
        ...state,
        sessions: state.sessions.map((session) => {
          if (session.id !== sessionId) return session;
          return {
            ...session,
            questions: session.questions.map((question) => {
              if (question.id !== questionId) return question;
              return {
                ...question,
                status: "answered",
                answer: {
                  id: newAnswerId,
                  questionId: question.id,
                  authorId: state.mentor.id,
                  content,
                  createdAt,
                },
              };
            }),
          };
        }),
      };
    }
    case "ADD_QUESTION": {
      const { sessionId, authorId, content } = action.payload;
      const questionId = generateId();
      const createdAt = new Date().toISOString();

      return {
        ...state,
        sessions: state.sessions.map((session) => {
          if (session.id !== sessionId) return session;
          const newQuestion: Question = {
            id: questionId,
            sessionId,
            authorId,
            content,
            createdAt,
            status: "pending",
            votes: 0,
          };
          return {
            ...session,
            questions: [newQuestion, ...session.questions],
          };
        }),
      };
    }
    case "ADD_ANNOUNCEMENT": {
      const { actionUrl, audience, content, title, authorId } = action.payload;
      const announcement: Announcement = {
        id: generateId(),
        actionUrl,
        audience,
        content,
        title,
        createdAt: new Date().toISOString(),
        authorId: authorId ?? state.mentor.id,
      };

      return {
        ...state,
        announcements: [announcement, ...state.announcements],
      };
    }
    default:
      return state;
  }
};

export function MentorshipProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(mentorshipReducer, initialState);
  const value = useMemo(() => ({ state, dispatch }), [state, dispatch]);

  return <MentorshipContext.Provider value={value}>{children}</MentorshipContext.Provider>;
}

export const useMentorship = () => {
  const context = useContext(MentorshipContext);
  if (!context) {
    throw new Error("useMentorship must be used within a MentorshipProvider");
  }
  return context;
};
