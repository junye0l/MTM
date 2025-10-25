import type {
  Announcement,
  AttendanceRecord,
  Session,
  UserProfile,
} from "@/types/domain";

export const mentor: UserProfile = {
  id: "mentor-1",
  name: "김멘토",
  role: "mentor",
  email: "mentor@example.com",
  avatarUrl: "",
  bio: "프론트엔드 개발 8년차, React와 클린 아키텍처 전문",
  organization: "MTM",
};

export const mentees: UserProfile[] = [
  {
    id: "mentee-1",
    name: "달이",
    role: "mentee",
    email: "moon@example.com",
    avatarUrl: "",
    organization: "멍멍대학교",
  },
  {
    id: "mentee-2",
    name: "깜이",
    role: "mentee",
    email: "darkdog@example.com",
    avatarUrl: "",
    organization: "멍멍대학교",
  },
  {
    id: "mentee-3",
    name: "참깨",
    role: "mentee",
    email: "bird@example.com",
    avatarUrl: "",
    organization: "짹짹대학교",
  },
];

const baseAttendance = (
  sessionId: string,
  overrides: Partial<AttendanceRecord> = {},
): AttendanceRecord => ({
  id: `${sessionId}-${overrides.menteeId}`,
  sessionId,
  menteeId: overrides.menteeId ?? "",
  status: overrides.status ?? "expected",
  updatedAt: overrides.updatedAt ?? new Date().toISOString(),
  note: overrides.note,
});

export const sessions: Session[] = [
  {
    id: "session-2024-08-1",
    title: "React 상태 관리 집중 세션",
    mentorId: mentor.id,
    startAt: "2024-08-20T19:00:00+09:00",
    endAt: "2024-08-20T21:00:00+09:00",
    location: "온라인 (Zoom)",
    description:
      "실무에서 자주 문제되는 상태 관리 패턴을 리뷰하고, 멘티들의 코드 고민을 해결합니다.",
    focusTags: ["React", "상태관리", "실습"],
    attendeeIds: mentees.map((mentee) => mentee.id),
    agenda: [
      { time: "19:00", topic: "체크인 & 난이도 진단" },
      { time: "19:20", topic: "상태 관리 패턴 비교", goal: "장단점 이해" },
      { time: "20:00", topic: "멘티 코드 리뷰", goal: "실전 적용" },
      { time: "20:40", topic: "Q&A 및 과제 안내" },
    ],
    resources: [
      { label: "사전 읽기 자료", url: "https://beta.reactjs.org/learn" },
      { label: "과제 제출 폼", url: "https://forms.gle/sample" },
    ],
    questions: [
      {
        id: "question-1",
        sessionId: "session-2024-08-1",
        authorId: "mentee-1",
        content: "Redux Toolkit과 Zustand 중 어떤 것을 선택해야 할까요?",
        createdAt: "2024-08-14T10:30:00+09:00",
        status: "pending",
        votes: 5,
      },
      {
        id: "question-2",
        sessionId: "session-2024-08-1",
        authorId: "mentee-2",
        content:
          "Context API로 글로벌 상태를 관리하고 있는데 렌더링 최적화가 어렵습니다. 구조를 어떻게 바꿔야 할까요?",
        createdAt: "2024-08-15T15:10:00+09:00",
        status: "in-progress",
        votes: 3,
      },
    ],
    attendance: [
      baseAttendance("session-2024-08-1", {
        menteeId: "mentee-1",
        status: "checked-in",
        updatedAt: "2024-08-20T18:55:00+09:00",
      }),
      baseAttendance("session-2024-08-1", {
        menteeId: "mentee-2",
        status: "expected",
      }),
      baseAttendance("session-2024-08-1", {
        menteeId: "mentee-3",
        status: "expected",
      }),
    ],
  },
  {
    id: "session-2024-08-2",
    title: "TypeScript로 안전한 협업하기",
    mentorId: mentor.id,
    startAt: "2024-08-27T19:00:00+09:00",
    endAt: "2024-08-27T21:00:00+09:00",
    location: "오프라인 (강남 위워크 5F)",
    description: "팀 프로젝트에서 바로 적용할 수 있는 TypeScript 패턴을 다룹니다.",
    focusTags: ["TypeScript", "협업", "코드리뷰"],
    attendeeIds: mentees.map((mentee) => mentee.id),
    agenda: [
      { time: "19:00", topic: "기존 코드 품질 리뷰" },
      { time: "19:40", topic: "타입 설계 워크숍" },
      { time: "20:30", topic: "출석 & 피드백 수집" },
    ],
    resources: [
      { label: "예제 레포지토리", url: "https://github.com/vercel/next.js" },
    ],
    questions: [
      {
        id: "question-3",
        sessionId: "session-2024-08-2",
        authorId: "mentee-3",
        content:
          "타입 가드와 제네릭을 함께 사용할 때 가장 깔끔한 패턴이 궁금합니다.",
        createdAt: "2024-08-16T09:00:00+09:00",
        status: "pending",
        votes: 2,
      },
    ],
    attendance: mentees.map((mentee) =>
      baseAttendance("session-2024-08-2", {
        menteeId: mentee.id,
        status: "expected",
      }),
    ),
  },
];

export const announcements: Announcement[] = [
  {
    id: "announcement-1",
    title: "8월 2주차 미션 안내",
    content:
      "다음 세션 전까지 개인 프로젝트의 상태 관리 구조를 리팩터링해서 PR로 공유해주세요.",
    createdAt: "2024-08-13T09:00:00+09:00",
    authorId: mentor.id,
    audience: "mentees",
    actionUrl: "https://forms.gle/sample",
  },
  {
    id: "announcement-2",
    title: "오프라인 세션 출석 체크",
    content: "8월 27일 세션은 오프라인으로 진행됩니다. 참석이 어려우면 미리 알려주세요.",
    createdAt: "2024-08-18T11:30:00+09:00",
    authorId: mentor.id,
    audience: "all",
  },
];

export const getUserById = (id: string): UserProfile | undefined => {
  if (id === mentor.id) {
    return mentor;
  }
  return mentees.find((mentee) => mentee.id === id);
};
