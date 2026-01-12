import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import HackerLoader from '../../components/HackerLoader';
import { FaShieldAlt, FaTrophy, FaStar, FaExclamationTriangle, FaArrowLeft } from 'react-icons/fa';
import Link from 'next/link';

export default function WarLogDetail() {
  const router = useRouter();
  const { tag } = router.query;
  const [warLog, setWarLog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mounted, setMounted] = useState(false);

  const fetchWarLogData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/warlog?tag=${encodeURIComponent(tag)}`);
      if (!res.ok) throw new Error('Failed to fetch war log');
      const data = await res.json();
      setWarLog(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (tag && mounted) {
      fetchWarLogData();
    }
  }, [tag, mounted]);

  if (!mounted || loading) {
    return <HackerLoader text="FETCHING WAR LOG" />;
  }

  if (warLog?.state === 'private') {
    return (
      <Layout>
        <div style={{ textAlign: 'center', padding: '100px 20px' }}>
          <FaExclamationTriangle style={{ fontSize: '64px', color: '#ff5f2e', marginBottom: '20px' }} />
          <h2 style={{ color: '#ff5f2e', marginBottom: '10px' }}>War Log is Private</h2>
          <p style={{ color: '#888', marginBottom: '30px' }}>
            This clan's war log is set to private. Enable public war log in clan settings to view history.
          </p>
          <Link href={`/clan/${encodeURIComponent(tag)}`}>
            <button style={{ padding: '12px 30px', background: '#d500f9', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px' }}>
              <FaArrowLeft style={{ marginRight: '8px' }} />
              Back to Clan
            </button>
          </Link>
        </div>
      </Layout>
    );
  }

  if (error || !warLog) {
    return (
      <Layout>
        <div style={{ textAlign: 'center', padding: '100px 20px' }}>
          <h2 style={{ color: '#ff5f2e' }}>Error loading war log</h2>
          <p style={{ color: '#888' }}>{error || 'War log not found'}</p>
          <Link href={`/clan/${encodeURIComponent(tag)}`}>
            <button style={{ marginTop: '20px', padding: '10px 30px', background: '#d500f9', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
              Back to Clan
            </button>
          </Link>
        </div>
      </Layout>
    );
  }

  const calculateStats = () => {
    const wars = warLog.wars || [];
    const wins = wars.filter(w => w.result === 'win').length;
    const losses = wars.filter(w => w.result === 'lose').length;
    const draws = wars.filter(w => w.result === 'tie').length;
    const totalStars = wars.reduce((sum, w) => sum + (w.clan?.stars || 0), 0);
    const avgStars = wars.length > 0 ? (totalStars / wars.length).toFixed(2) : 0;
    const totalDestruction = wars.reduce((sum, w) => sum + (w.clan?.destructionPercentage || 0), 0);
    const avgDestruction = wars.length > 0 ? (totalDestruction / wars.length).toFixed(2) : 0;
    
    return { wins, losses, draws, totalWars: wars.length, avgStars, avgDestruction };
  };

  const stats = calculateStats();

  return (
    <Layout>
      <div className="war-log-container">
        <div className="war-log-header">
          <Link href={`/clan/${encodeURIComponent(tag)}`}>
            <button className="back-button">
              <FaArrowLeft /> Back to Clan
            </button>
          </Link>
          <h1><FaShieldAlt /> War Log History</h1>
          <p className="clan-tag">{tag}</p>
        </div>

        {/* Statistics Overview */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value" style={{ color: '#4caf50' }}>{stats.wins}</div>
            <div className="stat-label">Wins</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" style={{ color: '#f44336' }}>{stats.losses}</div>
            <div className="stat-label">Losses</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" style={{ color: '#ff9800' }}>{stats.draws}</div>
            <div className="stat-label">Draws</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.totalWars}</div>
            <div className="stat-label">Total Wars</div>
          </div>
          <div className="stat-card">
            <FaStar className="stat-icon" style={{ color: '#ffd700' }} />
            <div className="stat-value">{stats.avgStars}</div>
            <div className="stat-label">Avg Stars</div>
          </div>
          <div className="stat-card">
            <FaTrophy className="stat-icon" style={{ color: '#ff9800' }} />
            <div className="stat-value">{stats.avgDestruction}%</div>
            <div className="stat-label">Avg Destruction</div>
          </div>
        </div>

        {/* War Log List */}
        <div className="war-log-list">
          <h2>Recent Wars</h2>
          {warLog.wars && warLog.wars.length > 0 ? (
            <div className="wars-grid">
              {warLog.wars.map((war, index) => (
                <div key={index} className={`war-log-card war-result-${war.result}`}>
                  <div className="war-result-badge">
                    <span className={`result-text result-${war.result}`}>
                      {war.result === 'win' ? '🏆 Victory' : war.result === 'lose' ? '💀 Defeat' : '🤝 Draw'}
                    </span>
                  </div>
                  
                  <div className="war-teams">
                    <div className="war-team">
                      <img src={war.clan?.badgeUrls?.medium || war.clan?.badgeUrls?.small} alt={war.clan?.name} className="team-badge" />
                      <div className="team-info">
                        <div className="team-name">{war.clan?.name}</div>
                        <div className="team-stats">
                          <span className="stars">⭐ {war.clan?.stars || 0}</span>
                          <span className="destruction">💥 {war.clan?.destructionPercentage?.toFixed(2) || 0}%</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="vs-divider">VS</div>
                    
                    <div className="war-team">
                      <img src={war.opponent?.badgeUrls?.medium || war.opponent?.badgeUrls?.small} alt={war.opponent?.name} className="team-badge" />
                      <div className="team-info">
                        <div className="team-name">{war.opponent?.name}</div>
                        <div className="team-stats">
                          <span className="stars">⭐ {war.opponent?.stars || 0}</span>
                          <span className="destruction">💥 {war.opponent?.destructionPercentage?.toFixed(2) || 0}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="war-meta">
                    <span className="war-size">{war.teamSize}v{war.teamSize}</span>
                    <span className="war-date">{new Date(war.endTime).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '50px', color: '#888' }}>
              <p>No wars found in the log</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
