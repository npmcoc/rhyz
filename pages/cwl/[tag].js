import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import HackerLoader from '../../components/HackerLoader';
import { FaTrophy, FaShieldAlt, FaStar } from 'react-icons/fa';
import Link from 'next/link';

export default function CWLDetail() {
  const router = useRouter();
  const { tag } = router.query;
  const [cwl, setCwl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mounted, setMounted] = useState(false);

  const fetchCWLData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/cwl?tag=${encodeURIComponent(tag)}`);
      if (!res.ok) throw new Error('Failed to fetch CWL data');
      const data = await res.json();
      setCwl(data);
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
      fetchCWLData();
    }
  }, [tag, mounted]);

  if (!mounted || loading) {
    return <HackerLoader text="FETCHING CWL DATA" />;
  }

  if (error || !cwl) {
    return (
      <Layout>
        <div style={{ textAlign: 'center', padding: '100px 20px' }}>
          <h2 style={{ color: '#ff5f2e' }}>Error loading CWL</h2>
          <p style={{ color: '#888' }}>{error || 'CWL data not found or clan not in CWL'}</p>
          <Link href="/">
            <button style={{ marginTop: '20px', padding: '10px 30px', background: '#d500f9', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
              Back to Home
            </button>
          </Link>
        </div>
      </Layout>
    );
  }

  if (cwl.state === 'notInCWL') {
    return (
      <Layout>
        <div style={{ textAlign: 'center', padding: '100px 20px' }}>
          <FaTrophy style={{ fontSize: '60px', color: '#888', marginBottom: '20px', opacity: 0.5 }} />
          <h2 style={{ color: '#888' }}>Not in CWL</h2>
          <p style={{ color: '#ccc', maxWidth: '500px', margin: '20px auto', lineHeight: '1.6' }}>
            {cwl.error}
          </p>
          <Link href="/">
            <button style={{ marginTop: '30px', padding: '10px 30px', background: '#d500f9', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
              Back to Home
            </button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="cwl-detail-container">
        {/* CWL Header */}
        <div className="cwl-header">
          <FaTrophy style={{ fontSize: '40px', color: '#ffd700' }} />
          <h1>Clan War League</h1>
          <div className="cwl-season">{cwl.season}</div>
          <div className="cwl-state" style={{ 
            color: cwl.state === 'inWar' ? '#ff5f2e' : cwl.state === 'preparation' ? '#ffa726' : '#888' 
          }}>
            {cwl.state === 'inWar' && '⚔️ Battle In Progress'}
            {cwl.state === 'preparation' && '⏳ Preparation'}
            {cwl.state === 'ended' && '✅ Season Ended'}
          </div>
        </div>

        {/* Participating Clans */}
        <div className="cwl-clans-section">
          <h2>Participating Clans</h2>
          <div className="cwl-clans-grid">
            {cwl.clans?.map((clan, index) => (
              <div key={clan.tag} className="cwl-clan-card">
                <div className="cwl-clan-rank">#{index + 1}</div>
                <img src={clan.badgeUrls?.medium || clan.badgeUrls?.small} alt={clan.name} className="cwl-clan-badge" />
                <h3>{clan.name}</h3>
                <div className="cwl-clan-tag">{clan.tag}</div>
                <div className="cwl-clan-stats">
                  <div className="cwl-stat">
                    <FaStar className="cwl-stat-icon" />
                    <span>Level {clan.clanLevel}</span>
                  </div>
                  <div className="cwl-stat">
                    <FaShieldAlt className="cwl-stat-icon" />
                    <span>{clan.members} Members</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* War Rounds */}
        {cwl.rounds && cwl.rounds.length > 0 && (
          <div className="cwl-rounds-section">
            <h2>War Rounds</h2>
            <div className="cwl-rounds-list">
              {cwl.rounds.map((round, roundIndex) => (
                <div key={roundIndex} className="cwl-round-card">
                  <h3>Round {roundIndex + 1}</h3>
                  <div className="cwl-wars-grid">
                    {round.warTags?.filter(tag => tag !== '#0').map((warTag, warIndex) => (
                      <Link key={warIndex} href={`/cwl/war/${encodeURIComponent(warTag)}`} className="cwl-war-link">
                        <div className="cwl-war-item">
                          <FaShieldAlt />
                          <span>War {warIndex + 1}</span>
                          <span className="war-tag-small">{warTag}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
