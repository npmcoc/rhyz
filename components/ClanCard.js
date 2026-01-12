import { FaExternalLinkAlt, FaCopy, FaInfoCircle } from 'react-icons/fa';
import { useState } from 'react';
import Link from 'next/link';

export default function ClanCard({ clan }) {
  const [copied, setCopied] = useState(false);

  const copyTag = () => {
    if (clan.tag) {
      navigator.clipboard.writeText(clan.tag);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const openInGame = () => {
    if (clan.tag) {
      window.open(`clashofclans://action=OpenClanProfile&tag=${clan.tag.replace('#', '')}`, '_self');
    }
  };

  const isClanFull = clan.members >= 50;
  const canJoin = clan.members < 50;

  return (
    <div className="clan-card-wrapper">
      <div className="clan-badge-wrapper">
        <img 
          src={clan.badgeUrls?.medium || ''} 
          alt={clan.name} 
          className="clan-badge-img"
        />
      </div>
      <article className="clan-card">
        <div className="corner-accent tl"></div>
        <div className="corner-accent tr"></div>
        <div className="corner-accent bl"></div>
        <div className="corner-accent br"></div>
        
        <div className="card-actions">
          <button onClick={openInGame} className="action-btn" title="Open in Game">
            <FaExternalLinkAlt />
          </button>
          <Link href={`/clan/${encodeURIComponent(clan.tag)}`}>
            <button className="action-btn" title="Clan Details">
              <FaInfoCircle />
            </button>
          </Link>
        </div>

        <h3 className="clan-name">{clan.name || 'Unknown'}</h3>
        <div className="clan-details">
          <div className="detail-row">
            <span className="label">Tag:</span>
            <div className="tag-with-copy">
              <span className="value">{clan.tag || 'N/A'}</span>
              <button onClick={copyTag} className="copy-tag-small" title="Copy Tag">
                <FaCopy />
                {copied && <span className="copied-tooltip">Copied!</span>}
              </button>
            </div>
          </div>
          <div className="detail-row">
            <span className="label">Level:</span>
            <span className="value">{clan.clanLevel || 'N/A'}</span>
          </div>
          <div className="detail-row">
            <span className="label">Members:</span>
            <span className="value">{clan.members || 0}/50</span>
          </div>
          <div className="detail-row">
            <span className="label">War Wins:</span>
            <span className="value">{clan.warWins ?? 'N/A'}</span>
          </div>
          <div className="detail-row">
            <span className="label">Capital Hall:</span>
            <span className="value">{clan.clanCapital?.capitalHallLevel || 'N/A'}</span>
          </div>
        </div>
        
        <Link href={`/clan/${encodeURIComponent(clan.tag)}`}>
          <button className="view-clan-btn">
            📊 View Clan Details
          </button>
        </Link>
        
        {canJoin ? (
          <button onClick={openInGame} className="join-btn">
            🎮 Join Clan
          </button>
        ) : (
          <button className="full-btn" disabled>
            🔒 Clan Full (50/50)
          </button>
        )}
      </article>
    </div>
  )
}
