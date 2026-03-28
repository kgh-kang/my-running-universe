import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import RunningTickets from '../components/RunningTickets';

export default function Tickets() {
  const navigate = useNavigate();
  const paths = useStore((s) => s.paths);

  return (
    <div className="tickets-page">
      <div className="tickets-page-header">
        <button onClick={() => navigate('/universe')} className="back-btn">
          ← 지도로 돌아가기
        </button>
        <h2 className="tickets-page-title">Boarding Passes</h2>
      </div>
      <div className="tickets-page-content">
        <RunningTickets paths={paths} />
      </div>
    </div>
  );
}
