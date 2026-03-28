// 주요 도시 좌표 기반 근사 매칭 (역지오코딩 API 없이)
const CITIES: { name: string; lat: number; lng: number; radius: number }[] = [
  // 한국
  { name: '서울', lat: 37.5665, lng: 126.978, radius: 0.3 },
  { name: '인천', lat: 37.4563, lng: 126.7052, radius: 0.2 },
  { name: '수원', lat: 37.2636, lng: 127.0286, radius: 0.15 },
  { name: '성남', lat: 37.4201, lng: 127.1265, radius: 0.12 },
  { name: '용인', lat: 37.2411, lng: 127.1776, radius: 0.15 },
  { name: '부산', lat: 35.1796, lng: 129.0756, radius: 0.2 },
  { name: '대구', lat: 35.8714, lng: 128.6014, radius: 0.2 },
  { name: '대전', lat: 36.3504, lng: 127.3845, radius: 0.2 },
  { name: '광주', lat: 35.1595, lng: 126.8526, radius: 0.2 },
  { name: '울산', lat: 35.5384, lng: 129.3114, radius: 0.2 },
  { name: '세종', lat: 36.48, lng: 127.0, radius: 0.15 },
  { name: '제주', lat: 33.4996, lng: 126.5312, radius: 0.3 },
  { name: '춘천', lat: 37.8813, lng: 127.7298, radius: 0.15 },
  { name: '강릉', lat: 37.7519, lng: 128.8761, radius: 0.15 },
  { name: '전주', lat: 35.8242, lng: 127.148, radius: 0.15 },
  { name: '포항', lat: 36.019, lng: 129.3435, radius: 0.15 },
  { name: '김포', lat: 37.6153, lng: 126.7156, radius: 0.12 },
  { name: '파주', lat: 37.76, lng: 126.78, radius: 0.15 },
  { name: '고양', lat: 37.6584, lng: 126.832, radius: 0.12 },
  { name: '하남', lat: 37.539, lng: 127.214, radius: 0.1 },
  // 일본
  { name: '도쿄', lat: 35.6762, lng: 139.6503, radius: 0.3 },
  { name: '오사카', lat: 34.6937, lng: 135.5023, radius: 0.3 },
  { name: '후쿠오카', lat: 33.5904, lng: 130.4017, radius: 0.2 },
  // 동남아
  { name: '코타키나발루', lat: 5.9804, lng: 116.0735, radius: 0.3 },
  { name: '방콕', lat: 13.7563, lng: 100.5018, radius: 0.3 },
  { name: '싱가포르', lat: 1.3521, lng: 103.8198, radius: 0.2 },
  { name: '호치민', lat: 10.8231, lng: 106.6297, radius: 0.3 },
  { name: '하노이', lat: 21.0278, lng: 105.8342, radius: 0.3 },
  { name: '다낭', lat: 16.0544, lng: 108.2022, radius: 0.2 },
  { name: '발리', lat: -8.3405, lng: 115.092, radius: 0.3 },
  { name: '세부', lat: 10.3157, lng: 123.8854, radius: 0.3 },
  { name: '쿠알라룸푸르', lat: 3.139, lng: 101.6869, radius: 0.3 },
  // 기타
  { name: '뉴욕', lat: 40.7128, lng: -74.006, radius: 0.3 },
  { name: 'LA', lat: 34.0522, lng: -118.2437, radius: 0.3 },
  { name: '런던', lat: 51.5074, lng: -0.1278, radius: 0.3 },
  { name: '파리', lat: 48.8566, lng: 2.3522, radius: 0.3 },
  { name: '시드니', lat: -33.8688, lng: 151.2093, radius: 0.3 },
];

export function getLocationName(lat: number, lng: number): string {
  let closest: { name: string; dist: number } | null = null;

  for (const city of CITIES) {
    const dist = Math.sqrt((lat - city.lat) ** 2 + (lng - city.lng) ** 2);
    if (dist <= city.radius) {
      if (!closest || dist < closest.dist) {
        closest = { name: city.name, dist };
      }
    }
  }

  if (closest) return closest.name;

  // 한국 내 대략적 판별
  if (lat >= 33 && lat <= 39 && lng >= 124 && lng <= 132) return '한국';
  // 일본
  if (lat >= 30 && lat <= 46 && lng >= 129 && lng <= 146) return '일본';

  return `${lat.toFixed(1)}°, ${lng.toFixed(1)}°`;
}
