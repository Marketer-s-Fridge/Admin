# Marketer's Fridge 관리자 (mf-admin)

Marketer's Fridge 운영을 위한 관리자 웹 콘솔입니다.
콘텐츠 등록/관리, 예약 업로드, 문의 응대, 통계 확인 등 운영 업무를 빠르게 처리할 수 있도록 설계되었습니다.

## 주요 기술 스택

- Next.js 15 (App Router)
- React 19
- TypeScript
- TanStack React Query – 서버 상태 관리
- Tailwind CSS v4 – UI 스타일링
- Axios – 백엔드 API 통신

## 주요 기능

- 콘텐츠 업로드 및 수정/삭제
- 게시물 상태별 관리(임시 저장/예약/게시)
- 업로드 예약 관리
- 문의 답변 관리
- 대시보드 통계 및 분석

## 실행 환경

- Node.js 18+ 권장
- 패키지 매니저: npm (또는 yarn/pnpm)

## 실행 방법

```bash
git clone https://github.com/Marketer-s-Fridge/Admin.git
cd mf-admin
npm install
npm run dev
```

브라우저에서 `http://localhost:3000` 으로 접속합니다.

## 환경 변수

기본적으로 로컬에서는 아래 값을 사용합니다.

```
NEXT_PUBLIC_API_URL=/
```

백엔드가 다른 도메인/포트일 경우 `.env.local`에 실제 API 주소를 지정해 주세요.
