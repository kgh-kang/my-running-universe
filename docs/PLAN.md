# My Running Universe - 기획서

## 컨셉

**"내가 뛴 지구, 우주에서 바라보다"**

3D 지구본 위에 러닝 GPS 경로가 빛나는 궤적으로 표시되고,
줌아웃하면 우주에서 내 지구를 바라보는 시점으로 전환된다.

많이 뛴 지역은 밝게 빛나고, 안 가본 곳은 어둠 속에 잠겨 있다.
운동할수록 나의 지구가 점점 밝아지는 경험.

---

## 핵심 기능

### 1. 3D 지구본 러닝 맵
- GPS 경로를 3D 지구본 위에 빛나는 선으로 렌더링
- 많이 뛴 지역 → 밝고 두꺼운 궤적
- 한 번만 뛴 곳 → 희미한 궤적
- 안 가본 곳 → 어둠

### 2. 우주 시점 전환
- 줌인: 도시 레벨에서 상세 경로 확인
- 줌아웃: 우주에서 지구 전체를 바라보는 시점
- 지구 주변에 별, 성운 등 우주 배경

### 3. 러닝 통계 → 우주 요소
| 데이터 | 우주 표현 |
|--------|-----------|
| 총 누적 거리 | 지구 → 달 → 화성 진행률 표시 |
| 러닝 1회 | 지구 위 빛나는 궤적 (GPS 경로) |
| 페이스 (빠름) | 궤적 색상 파랑 |
| 페이스 (느림) | 궤적 색상 빨강 |
| 연속 러닝 7일 | 지구 주변에 오로라 이펙트 |
| 연속 러닝 30일 | 지구에 링(토성처럼) 생성 |
| 운동 안 한 기간 | 지구가 서서히 어두워짐 |

### 4. 삼성헬스 컨디션 (v2 확장)
| 데이터 | 우주 표현 |
|--------|-----------|
| 수면 좋음 + 스트레스 낮음 | 우주 배경 맑은 남색 |
| 수면 부족 + 스트레스 높음 | 우주 배경 붉은 톤 |

### 5. 친구 기능 (v2 이후)
- 각자 고유 URL: `myrunning.universe/u/닉네임`
- 친구 지구를 우주 공간에서 나란히 볼 수 있음
- 친구 지구가 밝으면 자극, 어두우면 "야 뛰어" 압박
- 주간 랭킹 (누적 거리, 연속일수)

---

## 데이터 소스

### 실시간 연동: Strava API (메인)

삼성헬스/나이키런 → Strava 자동 동기화 → Strava API → 우리 웹앱

- **Strava 공식 REST API** (무료)
  - OAuth2 로그인
  - Webhook: 새 활동 등록 시 자동 알림
  - GPS polyline 경로 데이터 제공
  - 페이스, 거리, 시간, 심박수, 고도 포함
- **API 제한**: 15분당 100회 / 일 1,000회 (사이드 프로젝트 충분)
- **사용자 흐름**:
  1. 삼성헬스 앱에서 Strava 동기화 켜기 (1회 설정)
  2. 웹앱에서 "Strava로 로그인" 클릭 (1회)
  3. 이후 뛰면 자동으로 지구본에 경로 반영
- **주의**: 동기화는 새 활동만 지원 (과거 기록은 Strava에 이미 있는 것만 가져옴)

### Nike Run Club 연동: Bearer 토큰 방식 (비공식 API)

구 엔드포인트(`/sport/v3/me/activities/after_time/`)는 폐쇄됐지만,
**새 엔드포인트가 동작하는 것을 2026-03-28 확인함.**

- **사용자 흐름**:
  1. Nike 웹사이트 로그인 → DevTools → Network 탭에서 Bearer 토큰 복사
  2. 웹앱에서 토큰 붙여넣기
  3. 전체 러닝 기록 + GPS 경로 자동 fetch
- **API 엔드포인트**:
  - 활동 목록: `GET https://api.nike.com/plus/v3/activities/before_id/v3/*?limit=30&types=run,jogging`
  - 활동 상세 (GPS): `GET https://api.nike.com/sport/v3/me/activity/{id}?metrics=ALL`
- **가져올 수 있는 데이터**: GPS 좌표(latitude/longitude), 페이스, 거리, 칼로리, 고도, 걸음수
- **장점**: GDPR 대기 없이 즉시 전체 기록 확보, GPS 경로 포함
- **단점**: 비공식 API (언제 막힐지 모름), 토큰 만료 시 재발급 필요 (~1시간), 사용자가 DevTools 사용해야 함

---

## MVP (v1) 스코프

**Strava OAuth 로그인 / 실시간 러닝 연동 / 3D 지구본 시각화**

### 포함
- [x] Strava OAuth 로그인
- [x] Strava API로 활동 목록 + GPS 경로 가져오기
- [ ] Nike Run Club Bearer 토큰 입력 → 전체 러닝 데이터 + GPS fetch
- [x] 다크 테마 지도 위 GPS 경로 렌더링 (글로우 효과)
- [x] 줌인/줌아웃 (도시 레벨 상세 지도)
- [x] 러닝 기록 목록 + 선택 시 해당 경로 하이라이트

### 미포함 (v2 이후)
- Strava Webhook (실시간 자동 반영)
- 삼성헬스 연동 (수면/스트레스 → 배경색)
- 연속 러닝 보상 이펙트 (오로라, 링)
- 운동 안 하면 지구 어두워지는 생명주기
- 친구 기능 (URL 공유, 랭킹)

---

## 기술 스택

| 항목 | 선택 | 이유 |
|------|------|------|
| 프론트 | React + React Three Fiber | 3D 지구본 + 우주 렌더링 |
| 지구본 | three-globe 또는 react-globe.gl | Globe 시각화 특화 라이브러리 |
| 인증 | Strava OAuth2 | 실시간 러닝 데이터 연동 |
| 백엔드 | Supabase (Edge Functions) | OAuth 토큰 관리, Webhook 수신, 데이터 저장 |
| 배포 | Vercel | React 앱 무료 배포 |

---

## 화면 플로우

```
[랜딩 페이지]
    ↓
["Strava로 로그인" 버튼]
    ↓
[Strava OAuth 인증 → 권한 동의]
    ↓
[러닝 데이터 자동 로딩]
    ↓
[내 지구 (3D 지구본 + 러닝 궤적)]
    ├── 줌인 → 도시 레벨 경로 상세
    ├── 줌아웃 → 우주 시점 (지구 + 별)
    └── 누적 거리 진행률 표시
```

---

## Strava API 연동 상세

### OAuth2 흐름
1. 사용자가 "Strava로 로그인" 클릭
2. Strava 인증 페이지로 리다이렉트
3. 사용자 동의 → authorization code 반환
4. 서버에서 code → access_token + refresh_token 교환
5. access_token으로 API 호출

### 주요 API 엔드포인트
- 활동 목록: `GET https://www.strava.com/api/v3/athlete/activities`
- 활동 상세: `GET https://www.strava.com/api/v3/activities/{id}`
- GPS 경로: 활동 상세의 `map.polyline` 필드 (Google Encoded Polyline)
- Webhook: `POST callback_url` — 새 활동 생성 시 자동 알림

### 데이터 매핑
| Strava 필드 | 시각화 용도 |
|-------------|------------|
| `map.polyline` | 지구본 위 GPS 궤적 렌더링 |
| `distance` | 누적 거리 계산 |
| `average_speed` | 궤적 색상 (빠름=파랑, 느림=빨강) |
| `elapsed_time` | 운동 시간 |
| `start_date` | 연속 러닝 계산, 생명주기 판단 |
| `total_elevation_gain` | 고도 시각화 (v2) |

---

## 참고

- Strava API 문서: https://developers.strava.com/docs/reference/
- Strava OAuth 가이드: https://developers.strava.com/docs/authentication/
- Strava Webhook: https://developers.strava.com/docs/webhooks/
- Google Encoded Polyline 디코딩: https://github.com/mapbox/polyline
- react-globe.gl: https://github.com/vasturiano/react-globe.gl
- 나이키런 GDPR 데이터 요청: Nike 앱 → 설정 → 개인정보 → 데이터 다운로드 요청
