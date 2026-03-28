import { useState } from 'react';
import { fetchAllNikeActivities, nikeActivityToPath } from '../lib/nike';
import { useStore } from '../store/useStore';
import type { RunningPath } from '../types/strava';

export default function NikeTokenInput() {
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState('');
  const [error, setError] = useState('');
  const { paths, setPaths } = useStore();

  async function handleImport() {
    if (!token.trim()) return;
    setLoading(true);
    setError('');
    setProgress('러닝 기록 목록 가져오는 중...');

    try {
      // "Bearer " 접두사 자동 제거
      const cleanToken = token.trim().replace(/^Bearer\s+/i, '');
      const activities = await fetchAllNikeActivities(cleanToken);
      setProgress(`${activities.length}개 기록 발견. GPS 데이터 로딩 중...`);

      const newPaths: RunningPath[] = [];
      for (let i = 0; i < activities.length; i++) {
        setProgress(`GPS 데이터 로딩 중... (${i + 1}/${activities.length})`);
        const path = await nikeActivityToPath(cleanToken, activities[i]);
        if (path) newPaths.push(path);
      }

      // 기존 경로와 합치기 (중복 제거)
      const existingIds = new Set(paths.map((p) => p.id));
      const merged = [...paths, ...newPaths.filter((p) => !existingIds.has(p.id))];
      setPaths(merged);
      setProgress(`${newPaths.length}개 러닝 경로 추가 완료!`);
      setToken('');
    } catch {
      setError('토큰이 만료되었거나 잘못되었습니다. 다시 발급해주세요.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="nike-input">
      <h3>Nike Run Club 연동</h3>
      <p className="nike-desc">
        nike.com 로그인 → F12 → Network → api.nike.com 요청에서 Bearer 토큰 복사
      </p>
      <div className="nike-form">
        <input
          type="password"
          placeholder="Bearer 토큰 붙여넣기"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          disabled={loading}
          className="nike-token-input"
        />
        <button onClick={handleImport} disabled={loading || !token.trim()} className="nike-btn">
          {loading ? '불러오는 중...' : '가져오기'}
        </button>
      </div>
      {progress && <p className="nike-progress">{progress}</p>}
      {error && <p className="nike-error">{error}</p>}
    </div>
  );
}
