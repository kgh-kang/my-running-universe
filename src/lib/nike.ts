import type { RunningPath } from '../types/strava';

// Vite proxy를 통해 CORS 우회
const ACTIVITIES_URL = '/nike-api/plus/v3/activities/before_id/v3';
const ACTIVITY_DETAIL_URL = '/nike-api/sport/v3/me/activity';

interface NikeSummary {
  metric: string;
  summary: string;
  value: number;
}

interface NikeActivity {
  id: string;
  type: string;
  start_epoch_ms: number;
  end_epoch_ms: number;
  active_duration_ms: number;
  summaries: NikeSummary[];
  tags: Record<string, string>;
}

interface NikeMetricValue {
  start_epoch_ms: number;
  end_epoch_ms: number;
  value: number;
}

interface NikeMetric {
  type: string;
  values: NikeMetricValue[];
}

interface NikeActivityDetail {
  id: string;
  type: string;
  tags: Record<string, string>;
  metrics: NikeMetric[];
  summaries: NikeSummary[];
  start_epoch_ms: number;
  active_duration_ms: number;
}

export async function validateToken(token: string): Promise<boolean> {
  const url = `${ACTIVITIES_URL}/*?limit=1&types=run&include_deleted=false`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.ok;
}

export async function fetchNikeActivities(
  token: string,
  beforeId = '*',
  limit = 30,
): Promise<{ activities: NikeActivity[]; nextBeforeId: string | null }> {
  const url = `${ACTIVITIES_URL}/${beforeId}?limit=${limit}&types=run,jogging&include_deleted=false`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`Nike API error: ${res.status}`);
  const data = await res.json();
  const activities: NikeActivity[] = data.activities || [];

  // 페이지네이션: 마지막 활동 ID가 next before_id
  const nextBeforeId = activities.length === limit
    ? activities[activities.length - 1].id
    : null;

  return { activities, nextBeforeId };
}

export async function fetchAllNikeActivities(token: string): Promise<NikeActivity[]> {
  const all: NikeActivity[] = [];
  let beforeId: string | null = '*';

  while (beforeId) {
    const { activities, nextBeforeId } = await fetchNikeActivities(token, beforeId);
    all.push(...activities);
    beforeId = nextBeforeId;
  }

  return all;
}

export async function fetchNikeActivityDetail(
  token: string,
  activityId: string,
): Promise<NikeActivityDetail> {
  const res = await fetch(`${ACTIVITY_DETAIL_URL}/${activityId}?metrics=ALL`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`Nike detail API error: ${res.status}`);
  return res.json();
}

function speedToColor(avgSpeedKmh: number): string {
  if (avgSpeedKmh >= 14) return '#00bfff';
  if (avgSpeedKmh >= 10) return '#00ff88';
  if (avgSpeedKmh >= 7) return '#ffaa00';
  return '#ff4444';
}

export async function nikeActivityToPath(
  token: string,
  activity: NikeActivity,
): Promise<RunningPath | null> {
  try {
    const detail = await fetchNikeActivityDetail(token, activity.id);

    const latMetric = detail.metrics.find((m) => m.type === 'latitude');
    const lngMetric = detail.metrics.find((m) => m.type === 'longitude');

    if (!latMetric || !lngMetric || latMetric.values.length < 2) return null;

    const coordinates: [number, number][] = latMetric.values.map((latVal, i) => {
      const lngVal = lngMetric.values[i];
      return [latVal.value, lngVal?.value ?? 0] as [number, number];
    });

    const distSummary = activity.summaries.find(
      (s) => s.metric === 'distance' && s.summary === 'total',
    );
    const speedSummary = activity.summaries.find(
      (s) => s.metric === 'speed' && s.summary === 'mean',
    );

    const distance = (distSummary?.value ?? 0) * 1000; // km -> m
    const avgSpeedKmh = speedSummary?.value ?? 0;
    const name = activity.tags['com.nike.name'] || activity.type;

    return {
      id: hashStringToNumber(activity.id),
      name,
      date: new Date(activity.start_epoch_ms).toISOString(),
      distance,
      duration: Math.round(activity.active_duration_ms / 1000),
      avgSpeed: avgSpeedKmh / 3.6, // km/h -> m/s
      coordinates,
      color: speedToColor(avgSpeedKmh),
    };
  } catch {
    return null;
  }
}

function hashStringToNumber(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash);
}
