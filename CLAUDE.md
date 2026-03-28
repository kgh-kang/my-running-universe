# My Running Universe

## 프로젝트 개요
러닝 GPS 데이터를 3D 지구본 위에 빛나는 궤적으로 시각화하는 웹앱.
줌아웃하면 우주에서 내 지구를 바라보는 시점으로 전환된다.
운동할수록 지구가 밝아지는 경험.

## 데이터 연동
- **메인**: Strava OAuth2 → API로 러닝 GPS 경로 실시간 연동
- **삼성헬스/나이키런 → Strava 자동 동기화**로 데이터 수집
- **보조 (v2)**: 나이키런 GDPR JSON 파일 업로드 (과거 데이터 보완)
- ※ Nike 비공식 API는 2025년 기준 폐쇄 확인됨

## 기술 스택
- React + TypeScript
- React Three Fiber (3D 렌더링)
- react-globe.gl 또는 three-globe (지구본)
- Strava OAuth2 + REST API + Webhook
- Supabase (백엔드/DB + Edge Functions)
- Vercel (배포)

## 프로젝트 구조 규칙
- 컴포넌트: `src/components/`
- 페이지: `src/pages/`
- 3D 관련: `src/components/three/`
- 유틸: `src/utils/`
- Strava 연동: `src/lib/strava.ts`
- Supabase 관련: `src/lib/supabase.ts`
- 타입 정의: `src/types/`

## 코딩 컨벤션
- TypeScript strict 모드
- 함수형 컴포넌트 + hooks
- 컴포넌트 파일명: PascalCase (예: `GlobeView.tsx`)
- 유틸 파일명: camelCase (예: `decodePolyline.ts`)
- CSS: Tailwind CSS
- 상태관리: 필요시 Zustand (최소한으로)

## 주의사항
- 3D 성능 최적화 신경 쓸 것 (모바일 대응)
- Strava polyline 데이터 디코딩 필요 (Google Encoded Polyline → 위도/경도 배열)
- GPS 좌표 데이터가 클 수 있으므로 필요한 필드만 추출/저장
- Strava API 제한: 15분당 100회 / 일 1,000회
- MVP 스코프를 벗어나는 기능은 docs/PLAN.md의 "미포함" 섹션 확인
