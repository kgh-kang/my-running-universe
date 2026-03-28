import type { StravaActivity, StravaTokenResponse, RunningPath } from '../types/strava';
import polyline from 'polyline';

const CLIENT_ID = '217112';
const CLIENT_SECRET = '424cfcea9205f42ad020e431316eaec0a2a7adec';
const REDIRECT_URI = `${window.location.origin}/callback`;
const STRAVA_AUTH_URL = 'https://www.strava.com/oauth/authorize';
const STRAVA_TOKEN_URL = 'https://www.strava.com/oauth/token';
const STRAVA_API_URL = 'https://www.strava.com/api/v3';

export function getAuthUrl(): string {
  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    response_type: 'code',
    redirect_uri: REDIRECT_URI,
    scope: 'activity:read_all',
    approval_prompt: 'force',
  });
  return `${STRAVA_AUTH_URL}?${params.toString()}`;
}

export async function exchangeToken(code: string): Promise<StravaTokenResponse> {
  const res = await fetch(STRAVA_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      code,
      grant_type: 'authorization_code',
    }),
  });
  if (!res.ok) throw new Error('Token exchange failed');
  return res.json();
}

export async function refreshAccessToken(refreshToken: string): Promise<StravaTokenResponse> {
  const res = await fetch(STRAVA_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  });
  if (!res.ok) throw new Error('Token refresh failed');
  return res.json();
}

export async function fetchActivities(
  accessToken: string,
  page = 1,
  perPage = 50
): Promise<StravaActivity[]> {
  const res = await fetch(
    `${STRAVA_API_URL}/athlete/activities?page=${page}&per_page=${perPage}`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  if (!res.ok) throw new Error('Failed to fetch activities');
  return res.json();
}

export async function fetchAllActivities(accessToken: string): Promise<StravaActivity[]> {
  const all: StravaActivity[] = [];
  let page = 1;
  while (true) {
    const batch = await fetchActivities(accessToken, page, 50);
    if (batch.length === 0) break;
    all.push(...batch);
    page++;
  }
  return all;
}

function speedToColor(avgSpeed: number): string {
  // avgSpeed in m/s. Walking ~1.5, jogging ~2.5, fast ~4+
  if (avgSpeed >= 4.0) return '#00bfff'; // 빠름 - 파랑
  if (avgSpeed >= 3.0) return '#00ff88'; // 보통 - 초록
  if (avgSpeed >= 2.0) return '#ffaa00'; // 느림 - 주황
  return '#ff4444'; // 아주 느림 - 빨강
}

export function activityToPath(activity: StravaActivity): RunningPath | null {
  if (!activity.map.summary_polyline) return null;

  const decoded = polyline.decode(activity.map.summary_polyline);
  if (decoded.length < 2) return null;

  return {
    id: activity.id,
    name: activity.name,
    date: activity.start_date_local,
    distance: activity.distance,
    duration: activity.moving_time,
    avgSpeed: activity.average_speed,
    coordinates: decoded as [number, number][],
    color: speedToColor(activity.average_speed),
  };
}
