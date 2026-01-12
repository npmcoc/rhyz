import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import HackerLoader from '../../components/HackerLoader';
import { FaTrophy, FaStar, FaShieldAlt, FaHome, FaExternalLinkAlt, FaCopy } from 'react-icons/fa';
import Link from 'next/link';

export default function PlayerDetail() {
  const router = useRouter();
  const { tag } = router.query;
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);

  const fetchPlayerData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/player?tag=${encodeURIComponent(tag)}`);
      if (!res.ok) throw new Error('Failed to fetch player data');
      const data = await res.json();
      setPlayer(data);
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
      fetchPlayerData();
    }
  }, [tag, mounted]);

  const copyTag = () => {
    navigator.clipboard.writeText(tag);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const openInGame = () => {
    window.open(`clashofclans://action=OpenPlayerProfile&tag=${tag.replace('#', '')}`, '_self');
  };

  if (!mounted || loading) {
    return <HackerLoader text="FETCHING PLAYER DATA" />;
  }

  if (error || !player) {
    return (
      <Layout>
        <div style={{ textAlign: 'center', padding: '100px 20px' }}>
          <h2 style={{ color: '#ff5f2e' }}>Error loading player</h2>
          <p style={{ color: '#888' }}>{error || 'Player not found'}</p>
          <Link href="/">
            <button style={{ marginTop: '20px', padding: '10px 30px', background: '#d500f9', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
              Back to Home
            </button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="player-detail-container">
        {/* Header Section */}
        <div className="player-header">
          <div className="player-header-info">
            <h1>{player.name}</h1>
            <div className="player-tag-row">
              <span className="tag-display">{tag}</span>
              <button onClick={copyTag} className="icon-btn" title="Copy Tag">
                <FaCopy />
                {copied && <span className="tooltip-popup">Copied!</span>}
              </button>
              <button onClick={openInGame} className="icon-btn" title="Open in Game">
                <FaExternalLinkAlt />
              </button>
            </div>
            {player.clan && (
              <div className="player-clan-info">
                <span>Member of: </span>
                <Link href={`/clan/${encodeURIComponent(player.clan.tag)}`} className="clan-link">
                  {player.clan.name}
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <FaHome className="stat-icon" />
            <div className="stat-content">
              <div className="stat-value">TH {player.townHallLevel}</div>
              <div className="stat-label">Town Hall</div>
            </div>
          </div>
          <div className="stat-card">
            <FaTrophy className="stat-icon" />
            <div className="stat-content">
              <div className="stat-value">{player.trophies?.toLocaleString()}</div>
              <div className="stat-label">Trophies</div>
            </div>
          </div>
          <div className="stat-card">
            <FaStar className="stat-icon" />
            <div className="stat-content">
              <div className="stat-value">{player.expLevel}</div>
              <div className="stat-label">Experience</div>
            </div>
          </div>
          <div className="stat-card">
            <FaShieldAlt className="stat-icon" />
            <div className="stat-content">
              <div className="stat-value">{player.warStars || 0}</div>
              <div className="stat-label">War Stars</div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="info-section">
          <div className="info-card">
            <h3>Player Statistics</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Best Trophies:</span>
                <span className="info-value">{player.bestTrophies?.toLocaleString() || 0}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Attack Wins:</span>
                <span className="info-value">{player.attackWins?.toLocaleString() || 0}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Defense Wins:</span>
                <span className="info-value">{player.defenseWins?.toLocaleString() || 0}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Builder Hall Level:</span>
                <span className="info-value">BH {player.builderHallLevel || 0}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Versus Trophies:</span>
                <span className="info-value">{player.versusTrophies?.toLocaleString() || 0}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Role:</span>
                <span className="info-value">
                  <span className={`role-badge role-${player.role?.toLowerCase() || 'member'}`}>
                    {player.role || 'Member'}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Troops Section */}
        {player.troops && player.troops.length > 0 && (
          <div className="troops-section">
            <h2>Troops & Spells</h2>
            <div className="troops-grid">
              {player.troops.slice(0, 20).map((troop, index) => (
                <div key={index} className="troop-card">
                  <div className="troop-name">{troop.name}</div>
                  <div className="troop-level">Lvl {troop.level}/{troop.maxLevel}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Heroes Section */}
        {player.heroes && player.heroes.length > 0 && (
          <div className="heroes-section">
            <h2>Heroes</h2>
            <div className="heroes-grid">
              {player.heroes.map((hero, index) => (
                <div key={index} className="hero-card">
                  <div className="hero-name">{hero.name}</div>
                  <div className="hero-level">Level {hero.level}/{hero.maxLevel}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Achievements Sample */}
        {player.achievements && player.achievements.length > 0 && (
          <div className="achievements-section">
            <h2>Recent Achievements</h2>
            <div className="achievements-grid">
              {player.achievements.slice(0, 6).map((achievement, index) => (
                <div key={index} className="achievement-card">
                  <div className="achievement-name">{achievement.name}</div>
                  <div className="achievement-progress">{achievement.value} / {achievement.target}</div>
                  <div className="achievement-stars">{'⭐'.repeat(achievement.stars || 0)}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
