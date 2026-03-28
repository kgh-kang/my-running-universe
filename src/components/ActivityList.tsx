import type { RunningPath } from '../types/strava';
import { useStore } from '../store/useStore';
import { getLocationName } from '../utils/locationName';

interface Props {
  paths: RunningPath[];
}

export default function ActivityList({ paths }: Props) {
  const setSelectedPath = useStore((s) => s.setSelectedPath);
  const selectedPath = useStore((s) => s.selectedPath);

  if (paths.length === 0) {
    return (
      <div className="activity-list empty">
        <p>GPS 경로가 있는 러닝 기록이 없습니다.</p>
        <p className="activity-hint">Nike 토큰을 입력하거나 Strava를 연동해보세요!</p>
      </div>
    );
  }

  const totalKm = paths.reduce((sum, p) => sum + p.distance, 0) / 1000;

  return (
    <div className="activity-list">
      <div className="activity-header">
        <h3>러닝 기록</h3>
        <span className="activity-summary">{paths.length}개 · {totalKm.toFixed(0)}km</span>
      </div>
      <div className="activity-items">
        {paths.map((path) => {
          const loc = path.coordinates.length > 0
            ? getLocationName(path.coordinates[0][0], path.coordinates[0][1])
            : '';
          return (
            <button
              key={path.id}
              className={`activity-item ${selectedPath?.id === path.id ? 'selected' : ''}`}
              onClick={() => setSelectedPath(selectedPath?.id === path.id ? null : path)}
            >
              <div className="activity-color" style={{ backgroundColor: path.color }} />
              <div className="activity-info">
                <div className="activity-name">{path.name}</div>
                <div className="activity-meta">
                  {new Date(path.date).toLocaleDateString('ko-KR')} · {(path.distance / 1000).toFixed(1)}km
                  {loc && <span className="activity-loc"> · {loc}</span>}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
