# 도메인 개요

MTM에서 멘토 1명이 여러 멘티와 세션을 운영한다는 기본 구조를 바탕으로 MVP에서 다뤄야 할 핵심 개념과 흐름을 정리했습니다.

## 핵심 엔터티

### UserProfile
- `role`: `mentor | mentee | admin`
- 멘토 / 멘티 공통 프로필 (이름, 이메일, 소속, 소개, 아바타)
- 추후 관리자를 추가해 공지 승인, 통계 열람 같은 권한을 분리할 수 있습니다.

### Session
- 멘토링 일정(시작/종료 시각, 장소, 설명, 태그)
- `agenda`: 시간대별 진행 계획
- `resources`: 사전/사후 자료 링크
- `questions` / `attendance`와 1:N 관계

### Question & Answer
- 세션별 질문, 상태(`pending | in-progress | answered`) 관리
- 멘토 답변은 `Answer`에 저장 (멘토 외 코멘트 확장성 고려)
- `votes` 필드로 멘티들의 관심도 확인 -> 우선순위 판단 근거

### AttendanceRecord
- 멘티별 출석 상태(`expected | checked-in | late | absent`)
- 추후 체크인 시간, 지각 사유 등을 `note`로 확장 가능

### Announcement
- 공지 제목/내용/게시 시간과 대상(`mentees | mentors | all`)
- 선택적으로 action 링크 제공 (과제 폼, 자료실 등)

## 주요 사용자 흐름 (MVP)

1. **멘토 일정 생성**
   - 세션 기본 정보 + agenda + 자료 링크 등록
   - 참석 멘티 리스트 자동 포함 (멤버십 기반)

2. **멘티 질문 등록**
   - 세션 선택 → 질문 작성 → 상태 `pending`
   - 멘토 검토/답변 시 상태 업데이트 (`in-progress` → `answered`)

3. **출석 체크**
   - 세션 당일 멘토/운영자가 멘티별 상태 변경
   - `checked-in` 수에 따라 출석률 확인, 후속 액션 결정

4. **공지 발송**
   - 공지 작성 → 대상 선택 → 게시 & 알림 (이메일/푸시는 차후 구현)

5. **대시보드 확인**
   - 다음 세션 정보, 출석 현황, 미답변 질문, 최신 공지를 한 화면에서 파악

## 기술적 고려사항

- **Next.js App Router + Tailwind + MUI**: Tailwind로 유연한 커스터마이징, MUI로 빠른 UI 컴포넌트 활용
- **상태/데이터 레이어**: MVP는 목업 데이터 → 이후 Prisma + PostgreSQL 도입, React Query 또는 Server Actions 고려
- **역할 기반 접근 제어**: 라우트/컴포넌트 가드로 멘토/멘티 권한 분리
- **알림 모듈**: MVP에서는 공지 중심, 차후 이메일/푸시, 실시간(WebSocket) 확장

## 차후 확장 아이디어

- 세션 회고 & 피드백 설문, 자동 리마인드
- 멘티 진도 추적(과제 제출, 상담 기록)
- 멘토링 통계 대시보드 (출석률, 질문 해결률 등)
- 다중 멘토/트랙을 위한 조직 구조화

## 프론트엔드 시뮬레이션 (현재 상태)

- `MentorshipContext`가 목업 데이터를 전역 상태로 보관하고, reducer 액션으로 일정/질문/공지/출석을 업데이트합니다.
- 각 화면에서 사용되는 주요 액션
  - `ADD_SESSION`: 세션 생성 시 멘토/멘티 관계를 유지하면서 기본 출석 레코드를 자동 생성
  - `UPDATE_ATTENDANCE_STATUS`: 출석 토글 UI에서 실시간으로 상태 변경
  - `ADD_QUESTION`, `SET_QUESTION_STATUS`, `ADD_ANSWER`: 질문 흐름(등록 → 검토 → 답변)을 시뮬레이션
  - `ADD_ANNOUNCEMENT`: 공지 생성 및 리스트 갱신
- 백엔드 연동 시 동일한 액션 시그니처를 API layer로 옮겨 재사용할 수 있도록 구성했습니다.
