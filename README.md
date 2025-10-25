# MTM 플랫폼 (MVP)

MTM 팀이 멘토링 일정, 출석, 질문, 공지 흐름을 한 곳에서 관리할 수 있도록 설계한 Next.js 기반 웹 애플리케이션입니다. 현재는 1명의 멘토와 여러 멘티를 전제로 하며, 데이터 통신 없이 프론트엔드 목업 상태로 사용자 흐름을 검증할 수 있습니다.

## 주요 기능 (MVP)
- **일정 관리**: 세션 생성/목록, 진행 순서와 자료 관리, 태그 프리셋 지원
- **출석 관리**: 세션별 멘티 출석 상태 실시간 토글, 출석률 요약 제공
- **질문 & 답변**: 세션별 질문 상태 필터, 답변 작성/수정, 테스트용 질문 등록
- **공지 관리**: 공지 대상/내용 등록, 외부 링크 연결, 최신 순 정렬

## 기술 스택
- **프론트엔드**: Next.js (App Router, TypeScript)
- **상태 관리**: Context + Reducer 기반 `MentorshipProvider` (목업 데이터 → 전역 상태)
- **스타일링**: Tailwind CSS v4 프리뷰(@tailwindcss/postcss) + Material UI + MUI Theme 커스터마이징
- **컴포넌트/폰트**: Material UI, Geist/Roboto 폰트
- **도구**: ESLint, TypeScript path alias (`@/*`)

## 화면 구성
```
/app
├─ (app)/layout.tsx       # AppShell (사이드바 + 상단바)
├─ (app)/sessions         # 일정 생성 및 목록
├─ (app)/attendance       # 출석 현황 관리
├─ (app)/questions        # 질문 상태/답변 관리
└─ (app)/announcements    # 공지 작성 및 목록
```
- 모든 화면은 `MentorshipProvider` 전역 상태를 사용하므로, 백엔드 연동 전에도 UI 상호작용을 일관된 데이터 소스로 시뮬레이션할 수 있습니다.
- 세션/질문/공지 생성 시 `crypto.randomUUID()` 기반으로 임시 ID가 부여되며, 새 엔트리가 최상단에 노출됩니다.

## 개발 환경 실행
```bash
npm install       # 의존성 설치 (최초 1회)
npm run dev       # http://localhost:3000 접속 후 사이드바 사용
```

## 문서
- `docs/domain-model.md`: 도메인 엔터티 및 사용자 흐름

## 다음 단계 제안
1. Prisma + PostgreSQL 도입 후 Context → Server Actions 또는 React Query로 데이터 연동
2. 인증/인가 (멘토 vs 멘티) 플로우 정의 및 페이지 접근 제어
3. 출석/질문/공지 작성 폼을 실제 API와 연결하고 optimistic UI 추가
4. 이메일/푸시 등 알림 채널 및 리마인더 자동화 설계
