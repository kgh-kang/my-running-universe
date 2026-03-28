import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { validateToken } from '../lib/nike';

const NIKE_TOKEN_COMMAND = `JSON.parse(localStorage.getItem('oidc.user:https://accounts.nike.com:4fd2d5e7db76e0f85a6bb56721bd51df')).access_token`;

export default function Landing() {
  const navigate = useNavigate();
  const { setNikeToken } = useStore();
  const [token, setToken] = useState('');
  const [step, setStep] = useState<'main' | 'guide'>('main');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  async function handleConnect() {
    if (!token.trim()) return;
    const cleanToken = token.trim().replace(/^Bearer\s+/i, '').replace(/^'|'$/g, '');
    setLoading(true);
    setError('');

    try {
      const valid = await validateToken(cleanToken);
      if (!valid) {
        setError('토큰이 만료되었거나 잘못되었습니다. 다시 시도해주세요.');
        return;
      }
      setNikeToken(cleanToken);
      navigate('/universe');
    } catch {
      setError('연결에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  }

  function handleCopyCommand() {
    navigator.clipboard.writeText(NIKE_TOKEN_COMMAND);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (step === 'guide') {
    return (
      <div className="landing">
        <div className="landing-stars" />
        <div className="guide-content">
          <button onClick={() => setStep('main')} className="guide-back">← 돌아가기</button>
          <h2 className="guide-title">Nike 토큰 가져오기</h2>

          <div className="guide-steps">
            <div className="guide-step">
              <div className="step-number">1</div>
              <div className="step-text">
                <a href="https://www.nike.com/kr/member/profile" target="_blank" rel="noreferrer" className="step-link">
                  nike.com 로그인 →
                </a>
              </div>
            </div>

            <div className="guide-step">
              <div className="step-number">2</div>
              <div className="step-text">
                <strong>F12</strong> 눌러서 개발자 도구 열기 → <strong>Console</strong> 탭 클릭
              </div>
            </div>

            <div className="guide-step">
              <div className="step-number">3</div>
              <div className="step-text">아래 명령어를 복사해서 Console에 붙여넣기 → Enter</div>
            </div>
          </div>

          <div className="guide-command-box">
            <code className="guide-command">{NIKE_TOKEN_COMMAND}</code>
            <button onClick={handleCopyCommand} className="copy-btn">
              {copied ? '복사됨!' : '복사'}
            </button>
          </div>

          <div className="guide-steps">
            <div className="guide-step">
              <div className="step-number">4</div>
              <div className="step-text">나온 토큰(<code>eyJ...</code>)을 복사해서 아래에 붙여넣기</div>
            </div>
          </div>

          <div className="guide-input-area">
            <input
              type="password"
              placeholder="토큰 붙여넣기"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              disabled={loading}
              className="guide-token-input"
            />
            <button
              onClick={handleConnect}
              disabled={loading || !token.trim()}
              className="guide-connect-btn"
            >
              {loading ? '확인 중...' : '연결하기'}
            </button>
          </div>
          {error && <p className="guide-error">{error}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="landing">
      <div className="landing-stars" />
      <div className="landing-content">
        <h1 className="landing-title">
          My Running
          <span className="landing-highlight"> Universe</span>
        </h1>
        <p className="landing-subtitle">
          내가 뛴 지구, 우주에서 바라보다
        </p>
        <p className="landing-desc">
          러닝 GPS 경로가 지도 위에 빛나는 궤적으로 표시됩니다.
          <br />
          운동할수록 나의 지도가 밝아집니다.
        </p>
        <button onClick={() => setStep('guide')} className="start-btn">
          Nike Run Club 연결하기
        </button>
      </div>
    </div>
  );
}
