import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../../components/Layout';
import { FaShieldAlt, FaStar } from 'react-icons/fa';
import Link from 'next/link';

export default function CWLWarDetail() {
  const router = useRouter();
  const { warTag } = router.query;
  const [war, setWar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mounted, setMounted] = useState(false);

  const fetchCWLWarData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/cwl/${encodeURIComponent(warTag)}`);
      if (!res.ok) throw new Error('Failed to fetch CWL war data');
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
    if (warTag && mounted) {
      fetchWarData();
    }
  }, [warTag, mounted]);

  if (!mounted || loading) {
    return (
      <Layout>
        <div style={{ textAlign: 'center', padding: '100px 20px' }}>
          <div className="loading-spinner"></div>
          <p style={{ color: '#fff', marginTop: '20px' }}>Loading CWL war data...</p>
        </div>
      </Layout>
    );
  }

  if (error || !war) {
    return (
      <Layout>
        <div style={{ textAlign: 'center', padding: '100px 20px' }}>
          <h2 style={{ color: '#ff5f2e' }}>Error loading CWL war</h2>
          <p style={{ color: '#888' }}>{error || 'War not found'}</p>
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
      <div className="war-detail-container">
        {/* War Header */}
        <div className="war-header">
          <h1>CWL War</h1>
          <div className="war-tag-display">{warTag}</div>
          <div className="war-state" style={{ 
            color: war.state === 'inWar' ? '#ff5f2e' : war.state === 'preparation' ? '#ffa726' : '#888' 
          }}>
            {war.state === 'inWar' && 'Battle Day'}
            {war.state === 'preparation' && 'Preparation Day'}
            {war.state === 'warEnded' && 'War Ended'}
          </div>
        </div>

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

        {/* Clan Members */}
        <div className="war-members-section">
          <h2><FaShieldAlt /> {war.clan?.name} - Members</h2>
          <div className="war-members-grid">
            {war.clan?.members?.map((member) => (
              <div key={member.tag} className="war-member-card">
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

        {/* Opponent Members */}
        <div className="war-members-section">
          <h2><FaShieldAlt /> {war.opponent?.name} - Members</h2>
          <div className="war-members-grid">
            {war.opponent?.members?.map((member) => (
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
      </div>
    </Layout>
  );
}
