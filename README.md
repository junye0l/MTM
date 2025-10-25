# MTM Mentorship Hub

MTM 팀의 멘토링 일정·출석·질문·공지 업무를 한 화면에서 관리하기 위한 SPA입니다. Next.js 15(App Router) 기반으로 작성되었고, Supabase Auth/DB를 붙여 실제 사용자 흐름(회원가입→로그인→멘토링 데이터 관리)을 점진적으로 구현하고 있습니다.

## 핵심 기능

- **계정 관리**: Supabase Auth + 이메일 검증을 사용하는 회원가입/로그인 UI, 역할(멘토·멘티·관리자) 선택, 프로필 자동 생성
- **세션 관리**: 세션 생성/목록, 태그와 자료, 아젠다, 참석자 리스트
- **출석 관리**: 멘티별 출석 상태 토글, 체크인 시간 기록
- **Q&A**: 세션별 질문 상태 전환, 답변 작성, 투표수 정보
- **공지**: 대상/링크/내용을 포함한 공지 작성 및 최신순 표시

현재는 목업 데이터를 Context 전역 상태(`MentorshipProvider`)로 보관하고 있으며, Supabase 테이블로 데이터를 이전하기 위한 준비가 완료된 상태입니다.

## 기술 스택

- **Framework**: Next.js 15(App Router) · React 19 · TypeScript 5
- **Auth / Data**: Supabase (Auth + Postgres) · Row Level Security 정책
- **UI / Styling**: Material UI 7 + Emotion · Tailwind CSS v4 (유틸리티 보강)
- **State**: Context + Reducer (`MentorshipContext`) – 서버 연동 전까지 목업 데이터 유지
- **Tooling**: ESLint 9 · TypeScript path alias(`@/*`) · npm scripts

## 프로젝트 구조 (요약)

```
src/
├─ app/
│  ├─ (auth)        # 로그인/회원가입 + 서버 액션
│  ├─ (app)         # 실제 기능 페이지 (sessions, questions, attendance, announcements)
│  ├─ layout.tsx    # 전역 레이아웃
│  └─ providers.tsx # MUI Theme + MentorshipProvider
├─ context/         # MentorshipContext (mock state → 차후 Supabase 연동)
├─ data/            # mockData.ts (초기 상태)
├─ lib/             # Supabase client helpers
└─ types/           # 도메인 타입 정의
```

## 로컬 개발

1. 의존성 설치

   ```bash
   npm install
   ```

2. 개발 서버 실행
   ```bash
   npm run dev
   ```
