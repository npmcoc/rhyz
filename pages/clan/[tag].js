import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import HackerLoader from '../../components/HackerLoader';
import { FaUsers, FaTrophy, FaStar, FaCrown, FaExternalLinkAlt, FaCopy, FaChartLine, FaShieldAlt } from 'react-icons/fa';
import Link from 'next/link';

function MemberRow({ member, index }) {
  const [copiedTag, setCopiedTag] = useState(false);
  
  const copyMemberTag = () => {
    navigator.clipboard.writeText(member.tag);
    setCopiedTag(true);
    setTimeout(() => setCopiedTag(false), 2000);
  };

  return (
    <tr>
      <td><strong>{index + 1}</strong></td>
      <td>
        <div className="xp-badge">
          <img src="/xp.png" alt="XP" className="xp-icon" />
          <span className="xp-level">{member.expLevel || 1}</span>
        </div>
      </td>
      <td>
        <div className="player-cell">
          <Link href={`/player/${encodeURIComponent(member.tag)}`} className="member-link">
            <div className="player-name">{member.name}</div>
          </Link>
          <div className="player-tag-row">
            <span className="player-tag">{member.tag}</span>
            <button onClick={copyMemberTag} className="copy-tag-btn" title="Copy Tag">
              <FaCopy />
              {copiedTag && <span className="copied-tooltip">Copied!</span>}
            </button>
          </div>
        </div>
      </td>
      <td>
        <div className="th-cell">
          <img 
            src={`/townhalls/th-${member.townHallLevel || 1}.png`} 
            alt={`TH${member.townHallLevel}`}
            className="th-icon"
            onError={(e) => e.target.style.display = 'none'}
          />
        </div>
      </td>
      <td>
        <span className={`role-badge role-${member.role?.toLowerCase() || 'member'}`}>
          {member.role || 'Member'}
        </span>
      </td>
      <td>🏆 {member.trophies?.toLocaleString() || 0}</td>
      <td>📤 {member.donations?.toLocaleString() || 0}</td>
      <td>📥 {member.donationsReceived?.toLocaleString() || 0}</td>
    </tr>
  );
}

export default function ClanDetail() {
  const router = useRouter();
  const { tag } = router.query;
  const [clan, setClan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);

  const fetchClanData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/clan?tag=${encodeURIComponent(tag)}`);
      if (!res.ok) throw new Error('Failed to fetch clan data');
      const data = await res.json();
      setClan(data);
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
      fetchClanData();
    }
  }, [tag, mounted]);

  const copyTag = () => {
    navigator.clipboard.writeText(tag);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const openInGame = () => {
    window.open(`clashofclans://action=OpenClanProfile&tag=${tag.replace('#', '')}`, '_self');
  };

  if (!mounted || loading) {
    return <HackerLoader text="FETCHING CLAN DATA" />;
  }

  if (error || !clan) {
    return (
      <Layout>
        <div style={{ textAlign: 'center', padding: '100px 20px' }}>
          <h2 style={{ color: '#ff5f2e' }}>Error loading clan</h2>
          <p style={{ color: '#888' }}>{error || 'Clan not found'}</p>
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
      <div className="clan-detail-container">
        {/* Header Section */}
        <div className="clan-header">
          <div className="clan-header-badge">
            <img src={clan.badgeUrls?.large || clan.badgeUrls?.medium} alt={clan.name} />
          </div>
          <div className="clan-header-info">
            <h1>{clan.name}</h1>
            <div className="clan-tag-row">
              <span className="tag-display">{tag}</span>
              <button onClick={copyTag} className="icon-btn" title="Copy Tag">
                <FaCopy />
                {copied && <span className="tooltip-popup">Copied!</span>}
              </button>
              <button onClick={openInGame} className="icon-btn" title="Open in Game">
                <FaExternalLinkAlt />
              </button>
            </div>
            <p className="clan-description">{clan.description || 'No description available'}</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <FaUsers className="stat-icon" />
            <div className="stat-content">
              <div className="stat-value">{clan.members}/50</div>
              <div className="stat-label">Members</div>
            </div>
          </div>
          <div className="stat-card">
            <FaStar className="stat-icon" />
            <div className="stat-content">
              <div className="stat-value">{clan.clanLevel}</div>
              <div className="stat-label">Clan Level</div>
            </div>
          </div>
          <div className="stat-card">
            <FaTrophy className="stat-icon" />
            <div className="stat-content">
              <div className="stat-value">{clan.clanPoints?.toLocaleString()}</div>
              <div className="stat-label">Clan Points</div>
            </div>
          </div>
          <div className="stat-card">
            <FaChartLine className="stat-icon" />
            <div className="stat-content">
              <div className="stat-value">{clan.warWins || 0}</div>
              <div className="stat-label">War Wins</div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="info-section">
          <div className="info-card">
            <h3>Clan Information</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Location:</span>
                <span className="info-value">{clan.location?.name || 'International'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">War League:</span>
                <span className="info-value">{clan.warLeague?.name || 'Unranked'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">War Frequency:</span>
                <span className="info-value">{clan.warFrequency || 'Unknown'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">War Win Streak:</span>
                <span className="info-value">{clan.warWinStreak || 0}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Required Trophies:</span>
                <span className="info-value">{clan.requiredTrophies || 0}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Capital Hall Level:</span>
                <span className="info-value">{clan.clanCapital?.capitalHallLevel || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Members List */}
        <div className="members-section">
          <h2><FaUsers /> Members ({clan.memberList?.length || 0})</h2>
          <div className="members-table-container">
            <table className="members-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>XP</th>
                  <th>Player</th>
                  <th>Town Hall</th>
                  <th>Role</th>
                  <th>Trophies</th>
                  <th>Donated</th>
                  <th>Received</th>
                </tr>
              </thead>
              <tbody>
                {clan.memberList?.map((member, index) => (
                  <MemberRow key={member.tag} member={member} index={index} />
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* War & CWL Section */}
        <div className="war-section">
          <h2>War & League Information</h2>
          <div className="war-actions-grid">
            <Link href={`/war/${encodeURIComponent(tag)}`}>
              <div className="war-action-card">
                <FaShieldAlt className="war-action-icon" />
                <h3>Current War</h3>
                <p>View ongoing clan war details, attacks, and progress</p>
              </div>
            </Link>
            <Link href={`/cwl/${encodeURIComponent(tag)}`}>
              <div className="war-action-card">
                <FaCrown className="war-action-icon" />
                <h3>Clan War League</h3>
                <p>View CWL standings, rounds, and war history</p>
              </div>
            </Link>
            <div 
              className={`war-action-card ${!clan.warLog ? 'disabled' : ''}`}
              onClick={() => clan.warLog && router.push(`/warlog/${encodeURIComponent(tag)}`)}
              style={{ cursor: clan.warLog ? 'pointer' : 'not-allowed', opacity: clan.warLog ? 1 : 0.6 }}
            >
              <FaChartLine className="war-action-icon" />
              <h3>War Log</h3>
              <p>{clan.warLog ? 'View complete war history and statistics' : 'War log is private'}</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
