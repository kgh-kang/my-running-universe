import type { RunningPath } from '../types/strava';
import { getLocationName } from '../utils/locationName';

interface Props {
  paths: RunningPath[];
}

interface LocationTicket {
  location: string;
  firstDate: string;
  lastDate: string;
  totalRuns: number;
  totalDistanceKm: number;
}

function groupByLocation(paths: RunningPath[]): LocationTicket[] {
  const map = new Map<string, LocationTicket>();

  for (const path of paths) {
    if (path.coordinates.length === 0) continue;
    const loc = getLocationName(path.coordinates[0][0], path.coordinates[0][1]);
    const existing = map.get(loc);
    const date = path.date;

    if (existing) {
      existing.totalRuns++;
      existing.totalDistanceKm += path.distance / 1000;
      if (date < existing.firstDate) existing.firstDate = date;
      if (date > existing.lastDate) existing.lastDate = date;
    } else {
      map.set(loc, {
        location: loc,
        firstDate: date,
        lastDate: date,
        totalRuns: 1,
        totalDistanceKm: path.distance / 1000,
      });
    }
  }

  return Array.from(map.values()).sort((a, b) => b.totalDistanceKm - a.totalDistanceKm);
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('ko-KR', { year: 'numeric', month: 'short', day: 'numeric' });
}

export default function RunningTickets({ paths }: Props) {
  if (paths.length === 0) return null;

  const tickets = groupByLocation(paths);
  const allDates = paths.map((p) => p.date).sort();
  const firstDate = allDates[0];
  const totalKm = paths.reduce((s, p) => s + p.distance, 0) / 1000;
  const totalRuns = paths.length;

  return (
    <div className="tickets-section">
      {/* 총 통계 티켓 */}
      <div className="total-stats-ticket">
        <div className="ticket-perforated" />
        <div className="ticket-left">
          <div className="ticket-airline">MY RUNNING UNIVERSE</div>
          <div className="ticket-label">RUNNING SINCE</div>
          <div className="ticket-date">{formatDate(firstDate)}</div>
          <div className="ticket-label" style={{ marginTop: '0.8rem' }}>TOTAL RUNS</div>
          <div className="ticket-big">{totalRuns}</div>
        </div>
        <div className="ticket-right">
          <div className="ticket-label">TOTAL DISTANCE</div>
          <div className="ticket-distance">{totalKm.toFixed(1)}<span className="ticket-unit">km</span></div>
          <div className="ticket-label" style={{ marginTop: '0.8rem' }}>DESTINATIONS</div>
          <div className="ticket-big">{tickets.length}</div>
        </div>
      </div>

      {/* 도시별 보딩패스 */}
      <div className="ticket-grid">
        {tickets.map((t) => (
          <div key={t.location} className="ticket-card">
            <div className="ticket-perforated" />
            <div className="ticket-left">
              <div className="ticket-airline">MY RUNNING UNIVERSE</div>
              <div className="ticket-city">{t.location}</div>
              <div className="ticket-label">
                {formatDate(t.firstDate)}
                {t.firstDate !== t.lastDate && ` ~ ${formatDate(t.lastDate)}`}
              </div>
            </div>
            <div className="ticket-right">
              <div className="ticket-label">DISTANCE</div>
              <div className="ticket-km">{t.totalDistanceKm.toFixed(1)}km</div>
              <div className="ticket-label">RUNS</div>
              <div className="ticket-runs">{t.totalRuns}회</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
