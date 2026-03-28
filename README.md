# My Running Universe 🌍

Nike Run Club의 러닝 GPS 데이터를 다크 테마 지도 위에 빛나는 궤적으로 시각화하는 웹앱.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript)
![MapLibre](https://img.shields.io/badge/MapLibre_GL-JS-396CB2)

## 주요 기능

- **다크 테마 지도** — CARTO Dark Matter 타일 기반, 도시/도로 레벨까지 확대 가능
- **러닝 경로 시각화** — GPS 궤적을 글로우 효과와 함께 지도 위에 렌더링
- **페이스별 색상** — 빠른 페이스는 파랑, 느린 페이스는 빨강으로 구분
- **경로 선택** — 리스트에서 클릭하면 해당 경로로 줌인 + 하이라이트
- **위치 자동 인식** — GPS 좌표 기반으로 서울, 코타키나발루 등 도시명 표시
- **Boarding Pass** — 뛰어본 도시별 비행기 티켓 스타일 카드 생성
- **Nike Run Club 연동** — Bearer 토큰으로 전체 러닝 기록 + GPS 경로 자동 fetch

## 데이터 소스

### Nike Run Club (비공식 API)

Nike 공식 OAuth는 제공되지 않지만, 웹사이트 로그인 후 Bearer 토큰을 통해 데이터를 가져올 수 있습니다.

**토큰 가져오는 법:**
1. [nike.com](https://www.nike.com/kr/member/profile) 로그인
2. F12 → Console 탭
3. 아래 명령어 입력:
```js
JSON.parse(localStorage.getItem('oidc.user:https://accounts.nike.com:4fd2d5e7db76e0f85a6bb56721bd51df')).access_token
```
4. 나온 토큰을 앱에 붙여넣기

**사용하는 API 엔드포인트:**
- 활동 목록: `GET /plus/v3/activities/before_id/v3/*`
- 활동 상세 (GPS): `GET /sport/v3/me/activity/{id}?metrics=ALL`

> 토큰은 약 1시간 후 만료됩니다. 비공식 API이므로 언제든 변경될 수 있습니다.

## 시작하기

```bash
# 설치
npm install

# .env 파일 생성 (선택 — 토큰 자동 로딩용)
echo "VITE_NIKE_TOKEN=your_token_here" > .env

# 개발 서버 실행
npm run dev
```

http://localhost:3000 접속 → Nike Run Club 연결하기

## 기술 스택

| 항목 | 선택 |
|------|------|
| 프론트엔드 | React + TypeScript |
| 지도 | MapLibre GL JS + CARTO Dark Matter 타일 |
| 상태관리 | Zustand |
| 빌드 | Vite |
| 배포 | Vercel |

## 프로젝트 구조

```
src/
├── components/
│   ├── three/
│   │   └── GlobeScene.tsx    # MapLibre 지도 + 경로 렌더링
│   ├── ActivityList.tsx       # 러닝 기록 리스트
│   └── RunningTickets.tsx     # Boarding Pass 카드
├── lib/
│   └── nike.ts               # Nike API 연동
├── pages/
│   ├── Landing.tsx            # 랜딩 + 토큰 가이드
│   ├── Universe.tsx           # 메인 지도 화면
│   └── Tickets.tsx            # Boarding Pass 페이지
├── store/
│   └── useStore.ts            # Zustand 상태관리
├── types/
│   └── strava.ts              # 타입 정의
└── utils/
    └── locationName.ts        # GPS → 도시명 매칭
```

## 향후 계획

- [ ] Strava OAuth 연동 (실시간 자동 동기화)
- [ ] 삼성헬스 연동 (수면/스트레스 → 배경색 변화)
- [ ] 연속 러닝 보상 이펙트 (오로라, 링)
- [ ] 운동 안 하면 지도가 어두워지는 생명주기
- [ ] 친구 기능 (URL 공유, 랭킹)

## License

MIT
