import type { RunningPath } from '../types/strava';

const EARTH_TO_MOON_KM = 384400;

interface Props {
  paths: RunningPath[];
}

export default function StatsPanel({ paths }: Props) {
  const totalDistance = paths.reduce((sum, p) => sum + p.distance, 0);
  const totalDistanceKm = totalDistance / 1000;
  const totalRuns = paths.length;
  const totalDuration = paths.reduce((sum, p) => sum + p.duration, 0);
  const moonProgress = Math.min((totalDistanceKm / EARTH_TO_MOON_KM) * 100, 100);

  const formatDuration = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return `${h}시간 ${m}분`;
  };

  return (
    <div className="stats-panel">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{totalRuns}</div>
          <div className="stat-label">총 러닝</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{totalDistanceKm.toFixed(1)}km</div>
          <div className="stat-label">총 거리</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{formatDuration(totalDuration)}</div>
          <div className="stat-label">총 시간</div>
        </div>
      </div>

      <div className="moon-progress">
        <div className="moon-header">
          <span>🌍 지구</span>
          <span className="moon-distance">{totalDistanceKm.toFixed(0)} / {EARTH_TO_MOON_KM.toLocaleString()}km</span>
          <span>🌙 달</span>
        </div>
        <div className="moon-bar">
          <div className="moon-fill" style={{ width: `${moonProgress}%` }}>
            <span className="moon-runner">🏃</span>
          </div>
        </div>
        <div className="moon-percent">{moonProgress.toFixed(3)}%</div>
      </div>
    </div>
  );
}
