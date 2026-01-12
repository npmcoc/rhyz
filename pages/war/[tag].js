import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import HackerLoader from '../../components/HackerLoader';
import { FaShieldAlt, FaStar, FaFire, FaExclamationTriangle } from 'react-icons/fa';
import Link from 'next/link';

export default function WarDetail() {
  const router = useRouter();
  const { tag } = router.query;
  const [war, setWar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mounted, setMounted] = useState(false);

  const fetchWarData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/war?tag=${encodeURIComponent(tag)}`);
      if (!res.ok) throw new Error('Failed to fetch war data');
      const data = await res.json();
      setWar(data);
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
      fetchWarData();
    }
  }, [tag, mounted]);

  if (!mounted || loading) {
    return <HackerLoader text="FETCHING WAR DATA" />;
  }

  if (error || !war) {
    return (
      <Layout>
        <div style={{ textAlign: 'center', padding: '100px 20px' }}>
          <h2 style={{ color: '#ff5f2e' }}>Error loading war</h2>
          <p style={{ color: '#888' }}>{error || 'War not found or clan not in war'}</p>
          <Link href="/">
            <button style={{ marginTop: '20px', padding: '10px 30px', background: '#d500f9', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
              Back to Home
            </button>
          </Link>
        </div>
      </Layout>
    );
  }

  if (war.state === 'private') {
    return (
      <Layout>
        <div style={{ textAlign: 'center', padding: '100px 20px' }}>
          <FaExclamationTriangle style={{ fontSize: '60px', color: '#ffa726', marginBottom: '20px' }} />
          <h2 style={{ color: '#ffa726' }}>War Log is Private</h2>
          <p style={{ color: '#ccc', maxWidth: '500px', margin: '20px auto', lineHeight: '1.6' }}>
            {war.error}
          </p>
          <p style={{ color: '#888', fontSize: '14px', marginTop: '10px' }}>
            To view war data, the clan leader must enable public war log in Clash of Clans settings.
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

  const getStateColor = (state) => {
    switch (state) {
      case 'inWar': return '#ff5f2e';
      case 'preparation': return '#ffa726';
      case 'warEnded': return '#888';
      default: return '#fff';
    }
  };

  const getStateIcon = (state) => {
    switch (state) {
      case 'inWar': return <FaFire />;
      case 'preparation': return <FaExclamationTriangle />;
      case 'warEnded': return <FaShieldAlt />;
      default: return null;
    }
  };

  return (
    <Layout>
      <div className="war-detail-container">
        {/* War Header */}
        <div className="war-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            {getStateIcon(war.state)}
            <h1 style={{ margin: 0 }}>Current War</h1>
          </div>
          <div className="war-state" style={{ color: getStateColor(war.state) }}>
            {war.state === 'inWar' && 'Battle Day'}
            {war.state === 'preparation' && 'Preparation Day'}
            {war.state === 'warEnded' && 'War Ended'}
            {war.state === 'notInWar' && 'Not in War'}
          </div>
        </div>

        {war.state !== 'notInWar' && (
          <>
            {/* War Overview */}
            <div className="war-overview">
              <div className="war-clan-card">
                <img src={war.clan?.badgeUrls?.medium} alt={war.clan?.name} className="war-clan-badge" />
                <h2>{war.clan?.name}</h2>
                <div className="war-score">{war.clan?.stars || 0} ⭐</div>
                <div className="war-destruction">{war.clan?.destructionPercentage?.toFixed(2) || 0}%</div>
                <div className="war-attacks">{war.clan?.attacks || 0} Attacks</div>
              </div>

              <div className="war-vs">
                <div className="vs-text">VS</div>
                <div className="team-size">{war.teamSize} vs {war.teamSize}</div>
              </div>

              <div className="war-clan-card">
                <img src={war.opponent?.badgeUrls?.medium} alt={war.opponent?.name} className="war-clan-badge" />
                <h2>{war.opponent?.name}</h2>
                <div className="war-score">{war.opponent?.stars || 0} ⭐</div>
                <div className="war-destruction">{war.opponent?.destructionPercentage?.toFixed(2) || 0}%</div>
                <div className="war-attacks">{war.opponent?.attacks || 0} Attacks</div>
              </div>
            </div>

            {/* War Times */}
            {war.startTime && (
              <div className="war-times">
                <div className="time-info">
                  <span className="time-label">Start Time:</span>
                  <span className="time-value">{new Date(war.startTime).toLocaleString()}</span>
                </div>
                {war.endTime && (
                  <div className="time-info">
                    <span className="time-label">End Time:</span>
                    <span className="time-value">{new Date(war.endTime).toLocaleString()}</span>
                  </div>
                )}
              </div>
            )}

            {/* Our Clan Members */}
            <div className="war-members-section">
              <h2><FaShieldAlt /> {war.clan?.name} - Members</h2>
              <div className="war-members-grid">
                {war.clan?.members?.map((member, index) => (
                  <div key={member.tag} className="war-member-card">
                    <div className="member-position">#{member.mapPosition}</div>
                    <div className="member-info">
                      <Link href={`/player/${encodeURIComponent(member.tag)}`} className="member-name-link">
                        {member.name}
                      </Link>
                      <div className="member-th">TH {member.townhallLevel}</div>
                    </div>
                    <div className="member-attacks">
                      {member.attacks?.map((attack, i) => (
                        <div key={i} className="attack-info">
                          <FaStar className="attack-icon" />
                          <span>{attack.stars}⭐ {attack.destructionPercentage}%</span>
                        </div>
                      ))}
                      {(!member.attacks || member.attacks.length === 0) && (
                        <div className="no-attacks">No attacks yet</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Opponent Members */}
            <div className="war-members-section">
              <h2><FaShieldAlt /> {war.opponent?.name} - Members</h2>
              <div className="war-members-grid">
                {war.opponent?.members?.map((member, index) => (
                  <div key={member.tag} className="war-member-card opponent">
                    <div className="member-position">#{member.mapPosition}</div>
                    <div className="member-info">
                      <div className="member-name-text">{member.name}</div>
                      <div className="member-th">TH {member.townhallLevel}</div>
                    </div>
                    <div className="member-attacks">
                      {member.attacks?.map((attack, i) => (
                        <div key={i} className="attack-info">
                          <FaStar className="attack-icon" />
                          <span>{attack.stars}⭐ {attack.destructionPercentage}%</span>
                        </div>
                      ))}
                      {(!member.attacks || member.attacks.length === 0) && (
                        <div className="no-attacks">No attacks yet</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
